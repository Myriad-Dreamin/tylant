import type { AstroConfig, HookParameters, ViteUserConfig } from 'astro';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveCollectionPath } from './src/collection-fs';
import type { TylantConfig } from './src/types';
// import { getAllNewestCommitDate } from '../utils/git';

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
    return `\0${id}`;
}

/** Vite plugin that exposes tylant user config and project context via virtual modules. */
export function vitePluginTylantUserConfig(
    command: HookParameters<'astro:config:setup'>['command'],
    opts: TylantConfig,
    {
        build,
        legacy,
        root,
        srcDir,
        trailingSlash,
    }: Pick<AstroConfig, 'root' | 'srcDir' | 'trailingSlash'> & {
        build: Pick<AstroConfig['build'], 'format'>;
        legacy: Pick<AstroConfig['legacy'], 'collections'>;
    },
): NonNullable<ViteUserConfig['plugins']>[number] {
    /**
     * Resolves module IDs to a usable format:
     * - Relative paths (e.g. `'./module.js'`) are resolved against `base` and formatted as an absolute path.
     * - Package identifiers (e.g. `'module'`) are returned unchanged.
     *
     * By default, `base` is the project root directory.
     */
    const resolveId = (id: string, base = root) =>
        JSON.stringify(id.startsWith('.') ? resolve(fileURLToPath(base), id) : id);

    /**
     * Resolves a path to a tylant file relative to this file.
     * @example
     * resolveLocalPath('../utils/git.ts');
     * // => '"/users/houston/docs/node_modules/@astrojs/tylant/utils/git.ts"'
     */
    const resolveLocalPath = (path: string) =>
        JSON.stringify(fileURLToPath(new URL(path, import.meta.url)));

    const rootPath = fileURLToPath(root);
    const docsPath = resolveCollectionPath('docs', srcDir);

    let collectionConfigImportPath = resolve(
        fileURLToPath(srcDir),
        legacy.collections ? './content/config.ts' : './content.config.ts'
    );
    // If not using legacy collections and the config doesn't exist, fallback to the legacy location.
    // We need to test this ahead of time as we cannot `try/catch` a failing import in the virtual
    // module as this would fail at build time when Rollup tries to resolve a non-existent path.
    if (!legacy.collections && !existsSync(collectionConfigImportPath)) {
        collectionConfigImportPath = resolve(fileURLToPath(srcDir), './content/config.ts');
    }

    const bind = (it: 'components' | 'layouts') => {
        const { minimal, ...rest } = opts[it];

        const virtualMinimalComponentModules = Object.fromEntries(
            Object.entries(minimal).map(([name, path]) => [
                `virtual:tylant/${it}/minimal/${name}`,
                `export { default } from ${resolveId(path)};`,
            ])
        );

        const virtualComponentModules = Object.fromEntries(
            Object.entries(rest).map(([name, path]) => [
                `virtual:tylant/${it}/${name}`,
                `export { default } from ${resolveId(path)};`,
            ])
        );

        return {
            ...virtualMinimalComponentModules,
            ...virtualComponentModules,
        }
    }


    /** Map of virtual module names to their code contents as strings. */
    const modules = {
        'virtual:tylant/user-config': `export default ${JSON.stringify(opts)}`,
        'virtual:tylant/project-context': `export default ${JSON.stringify({
            build: { format: build.format },
            legacyCollections: legacy.collections,
            root,
            srcDir,
            trailingSlash,
        })}`,
        // 'virtual:tylant/git-info':
        //     (command !== 'build'
        //         ? `import { makeAPI } from ${resolveLocalPath('../utils/git.ts')};` +
        //         `const api = makeAPI(${JSON.stringify(rootPath)});`
        //         : `import { makeAPI } from ${resolveLocalPath('../utils/gitInlined.ts')};` +
        //         `const api = makeAPI(${JSON.stringify(getAllNewestCommitDate(rootPath, docsPath))});`) +
        //     'export const getNewestCommitDate = api.getNewestCommitDate;',
        /**
         * Module containing styles for features that can be toggled on or off such as heading anchor links.
         */
        // 'virtual:tylant/optional-css': opts.markdown.headingLinks
        //     ? `import ${resolveLocalPath('../style/anchor-links.css')};`
        //     : '',
        /**
         * Module containing imports of user-specified custom CSS files.
         */
        'virtual:tylant/user-css': opts.customCss.map((id) => `import ${resolveId(id)};`).join(''),
        'virtual:tylant/user-images': opts.logo
            ? 'src' in opts.logo
                ? `import src from ${resolveId(
                    opts.logo.src
                )}; export const logos = { dark: src, light: src };`
                : `import dark from ${resolveId(opts.logo.dark)}; import light from ${resolveId(
                    opts.logo.light
                )}; export const logos = { dark, light };`
            : 'export const logos = {};',
        'virtual:tylant/collection-config': `let userCollections;
			try {
				userCollections = (await import(${JSON.stringify(collectionConfigImportPath)})).collections;
			} catch {}
			export const collections = userCollections;`,
        // 'virtual:tylant/plugin-translations': `export default ${JSON.stringify(pluginTranslations)}`,
        /**
         * Exports an array of route middleware functions.
         * For example, might generate a module that looks like:
         *
         * ```js
         * import { onRequest as routeMiddleware0 } from "/users/houston/docs/src/middleware";
         * import { onRequest as routeMiddleware1 } from "@houston-inc/plugin/middleware";
         *
         * export const routeMiddleware = [
         * 	routeMiddleware0,
         * 	routeMiddleware1,
         * ];
         * ```
         */
        'virtual:tylant/route-middleware':
            opts.routeMiddleware
                .reduce(
                    ([imports, entries], id, index) => {
                        const importName = `routeMiddleware${index}`;
                        imports += `import { onRequest as ${importName} } from ${resolveId(id)};\n`;
                        entries += `\t${importName},\n`;
                        return [imports, entries] as [string, string];
                    },
                    ['', 'export const routeMiddleware = [\n'] as [string, string]
                )
                .join('\n') + '];',
        ...bind('components'),
        ...bind('layouts'),
    } satisfies Record<string, string>;

    /** Mapping names prefixed with `\0` to their original form. */
    const resolutionMap = Object.fromEntries(
        (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
            resolveVirtualModuleId(key),
            key,
        ])
    );

    return {
        name: 'vite-plugin-tylant-user-config',
        resolveId(id): string | void {
            if (id in modules) return resolveVirtualModuleId(id);
        },
        load(id): string | void {
            const resolution = resolutionMap[id];
            if (resolution) return modules[resolution];
        },
    };
}
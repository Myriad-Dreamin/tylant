// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.

/// <reference path="./virtual.d.ts" />

import { AstroError } from 'astro/errors';
import type { AstroIntegration, HookParameters as AstroHookParameters } from 'astro';

import { parseWithFriendlyErrors } from './src/error-map';
import { renderComment, renderMonthlyPdf } from "./src/components/Typst";
import { processI18nConfig } from './src/i18n';

import { vitePluginTylantUserConfig } from './virtual-content';


import { TylantConfigSchema } from './src/types';
import type { TylantUserConfig } from './src/types';
export type { TylantConfig } from './src/types';

export type BlogComment = {
    id: string;
    articleId: string;
    content: string;
    email: string;
    authorized?: boolean;
    createdAt: number;
};

export interface CommentHost {
    renderComment: (content: string) => Promise<string>;
}

export interface PdfArchive {
    id: string;
    data: {
        title: string;
        date: Date;
        indices?: string[];
    };
}

export interface ArchiveProps {
    pdfArchives: PdfArchive[];
}



export type TylantPluginContext = Pick<
    AstroHookParameters<'astro:config:setup'>,
    'command' | 'config' | 'isRestart' | 'logger'
>;

export function tylant(opts: TylantUserConfig): AstroIntegration {
    if (typeof opts !== 'object' || opts === null || Array.isArray(opts))
        throw new AstroError(
            'Invalid config passed to tylant integration',
            `The Tylant integration expects a configuration object with at least a \`title\` property.\n\n` +
            `See more details in the [tylant configuration reference](https://github.com/Myriad-Dreamin/tylant)\n`
        );
    return {
        name: '@myriaddreamin/tylant',
        hooks: {
            'astro:config:setup': async ({
                command,
                config,
                updateConfig,
            }) => {
                const parseConfig = parseWithFriendlyErrors(
                    TylantConfigSchema,
                    opts,
                    'Invalid config passed to tylant integration'
                );
                // Process the Astro and Starlight configurations for i18n and translations.
                const { astroI18nConfig, tylantConfig } = processI18nConfig(parseConfig, config.i18n);

                const integrations: AstroIntegration[] = [];

                // addMiddleware({ entrypoint: '@astrojs/starlight/locals', order: 'pre' });

                // if (!tylantConfig.disable404Route) {
                //     injectRoute({
                //         pattern: '404',
                //         entrypoint: tylantConfig.prerender
                //             ? '@astrojs/starlight/routes/static/404.astro'
                //             : '@astrojs/starlight/routes/ssr/404.astro',
                //         prerender: tylantConfig.prerender,
                //     });
                // }
                // injectRoute({
                //     pattern: '[...slug]',
                //     entrypoint: tylantConfig.prerender
                //         ? '@astrojs/starlight/routes/static/index.astro'
                //         : '@astrojs/starlight/routes/ssr/index.astro',
                //     prerender: tylantConfig.prerender,
                // });

                // Add built-in integrations only if they are not already added by the user through the
                // config or by a plugin.
                // const allIntegrations = [...config.integrations, ...integrations];
                // if (!allIntegrations.find(({ name }) => name === '@astrojs/sitemap')) {
                //     integrations.push(starlightSitemap(tylantConfig));
                // }

                // Add Starlight directives restoration integration at the end of the list so that remark
                // plugins injected by Starlight plugins through Astro integrations can handle text and
                // leaf directives before they are transformed back to their original form.
                // integrations.push(starlightDirectivesRestorationIntegration());

                // Add integrations immediately after Starlight in the config array.
                // e.g. if a user has `integrations: [starlight(), tailwind()]`, then the order will be
                // `[starlight(), expressiveCode(), sitemap(), mdx(), tailwind()]`.
                // This ensures users can add integrations before/after Starlight and we respect that order.
                const selfIndex = config.integrations.findIndex((i) => i.name === '@myriaddreamin/tylant');
                config.integrations.splice(selfIndex + 1, 0, ...integrations);

                updateConfig({
                    vite: {
                        plugins: [
                            vitePluginTylantUserConfig(command, tylantConfig, config),
                        ],
                    },
                    scopedStyleStrategy: 'where',
                    // If not already configured, default to prefetching all links on hover.
                    prefetch: config.prefetch ?? { prefetchAll: true },
                    i18n: astroI18nConfig,
                });
            },

            // 'astro:config:done': ({ injectTypes }) => {
            //     injectPluginTranslationsTypes(pluginTranslations, injectTypes);
            // },

            'astro:build:done': ({ }) => { },
        },
    };
}

export {
    renderComment, renderMonthlyPdf,
};

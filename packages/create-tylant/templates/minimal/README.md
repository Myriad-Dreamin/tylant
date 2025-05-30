# Blog

My personal blog, powered by [typst](https://github.com/typst/typst) and [Astro](https://astro.build/).

> [!NOTE]
> wanna use it to write your blog posts? Please fork [blog-template](https://github.com/Myriad-Dreamin/blog-template) instead of my personal blog, which contains my personal blog posts and configurations.

## Features

- **Tags**: Categorize your blog posts with tags.
- **Search**: Search through your blog posts by "title", "description", or "tags".
- **Self-Host Fonts**: bundle and self-host fonts via `@fontsource-variable/inter`.
- **Link Preview**: Link Preview on Open Graph, Facebook, and Twitter.
- **SEO**: ARIA and Sitemap support.
- **Click Stats, Like Reaction, and Comment** (Optional): Using an optional backend to store your blog post's click statistics and comments.

Typst-specific features:

- Heading Permalinks and Table of Contents.
- PDF Archives.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## Editor Setup

### VS Code

Open using the default setting:

```
code .vscode/blog.code-workspace
```

Or customize it:

```
cp .vscode/blog.code-workspace .vscode/blog.private.code-workspace
code .vscode/blog.private.code-workspace
```

Install suggseted extensions:

- `myriad-dreamin.tinymist`, for writing blog posts in typst.
- `astro-build.astro-vscode`, for developing astro components.

### Official Web App

(Untested) [Start from GitHub](https://typst.app/) and open your blog repository. You should be able to write articles like you do in local.

## Writing

Create a new blog post in [`content/article`:](https://github.com/Myriad-Dreamin/Myriad-Dreamin/tree/ffbfbbad99c172c7e6d60c511fdee2c24d9af7ff/article/)

```typ
#import "/typ/templates/blog.typ": *
#show: main.with(
  title: "Title of the blog post",
  desc: [This is a test post.],
  date: "2025-04-25",
  tags: (
    blog-tags.misc,
  ),
)
```

The `blog-tags` index is defined in [`content/article/blog-tags.typ`](./typ/templates/mod.typ#L14) to ensure type safety. You can add your own tags by adding a new `blog-tags` index.

There is a sample blog post in [`content/article/personal-info.typ`](https://github.com/Myriad-Dreamin/Myriad-Dreamin/tree/ffbfbbad99c172c7e6d60c511fdee2c24d9af7ff/article/personal-info.typ).

## Deploying to GitHub Pages

1. Set the URL_BASE in [.env](./.env). If you would like to keep it in secret, please set it in either `.env.{production,development}` file in root or [Environments](../../settings/environments).
   - For a GitHub page `https://username.github.io/repo`, the URL base is `/repo/`.
1. Change Source's "Build and deployment" to "GitHub Actions" in [Page Settings](../../settings/pages).
1. Push your changes to the `main` branch and it will automatically deploy to GitHub Pages by [CI](.github/workflows/gh-pages.yml).

## Customization

- `.env`: Configuration read by files, Please check `defineConfig/env` in [astro.config.mjs](astro.config.mjs) for schema.
- [`src/consts.ts`](./src/consts.ts),[`src/components/BaseHead.astro`](./src/components/BaseHead.astro): global metadata, font resource declarations, and the head component.
- [`src/styles/*`](src/styles/): CSS styles.

## Todo

Improve experience:

- [x] More friendly submodule for forks
- [ ] Split Backend Components to a separate repository

Improve website:

- [ ] Intro-site Link Hover Preview
- [ ] [Last Modified Time](https://5-0-0-beta.docs.astro.build/en/recipes/modified-time/)
- [ ] Styling
  - [ ] Table
  - [x] Inline Raw
  - [ ] Blocky Raw
- [ ] Index Page Design
  - [ ] Badge
- [ ] Comment Reply
- [ ] Better [`theme-frame`](typ/templates/theme.typ)
- [ ] Refactor code to publish packages
  - [ ] `@myriad-dreamin/blog-template` for creating blogs
  - Some components that could be removed (JS required):
    - [ ] `@myriaddreamin/tylant-search`
    - [x] `@myriaddreamin/tylant-theme-toggle`
  - Typst Kit
    - [ ] `@myriaddreamin/tylant-typst-kit`
      - focus on concept: `post` collections
    - [x] `@myriaddreamin/tylant-pdf-archive`
      - focus on concept: `pdf` collections
  - People who don't like backend could remove them:
    - [ ] `@myriaddreamin/tylant-backend-client`
    - [ ] `@myriaddreamin/tylant-click`
    - [x] `@myriaddreamin/tylant-like-reaction`
    - [x] `@myriaddreamin/tylant-comment`

## Credit

- This theme is based off of the lovely [Bear Blog.](https://github.com/HermanMartinus/bearblog/)
- The astro integration is supported by [astro-typst.](https://github.com/overflowcat/astro-typst)
- And, the lovely [typst.](https://github.com/typst/typst)

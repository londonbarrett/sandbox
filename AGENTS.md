# sandbox

pnpm monorepo (v11) | Turborepo v2 | Next.js 16 | React 19 | Tailwind CSS v4 | shadcn/ui (base-vega style)

## Commands

- `pnpm dev` — start all workspaces in dev mode (`turbo dev`)
- `pnpm build` / `pnpm lint` / `pnpm typecheck` / `pnpm format` — turbo-orchestrated per workspace
- `pnpm --filter web <cmd>` — target `apps/web` only
- `pnpm dlx shadcn@latest add <component> -c apps/web` — add shadcn components (output goes to `packages/ui/src/components/`)
- `pnpm format` runs Prettier (no semicolons, double quotes, trailingComma es5, printWidth 72)

## Architecture

- **3 shared packages**: `@workspace/ui`, `@workspace/eslint-config`, `@workspace/typescript-config`
- **PostCSS** defined once in `packages/ui/postcss.config.mjs`; `apps/web` re-exports it
- **Global CSS** imported from `@workspace/ui/globals.css` (root layout) — Tailwind v4 `@import` syntax
- **UI package** is transpiled by Next.js via `transpilePackages: ["@workspace/ui"]` — not built separately
- **ccxt** is in `serverComponentsExternalPackages` to avoid native dep issues
- **shadcn primitives**: `@base-ui/react` (not Radix)
- **TypeScript path aliases**: `@/` → `apps/web/*`, `@workspace/ui/*` → `packages/ui/src/*`

## Conventions

- **Theme**: `next-themes` with class-based dark mode; press `d` to toggle
- **Fonts**: Oxanium (sans, `--font-sans`), Geist Mono (mono, `--font-mono`) via next/font/google
- **Imports**: app-local → `@/components/...`, shared UI → `@workspace/ui/components/...`, utils → `@workspace/ui/lib/utils`
- **cn()** utility from `@workspace/ui/lib/utils` (clsx + tailwind-merge)
- **ESLint**: flat config (`eslint.config.js`), rules shared from `@workspace/eslint-config`
- **No tests, no CI, no pre-commit hooks in this repo**

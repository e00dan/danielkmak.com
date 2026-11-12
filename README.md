# danielkmak.com

Personal site, built with [React](https://react.dev) + [Vite](https://vite.dev) and deployed to GitHub Pages.

## Development

```sh
nvm use      # Node 24, see .nvmrc
npm install
npm run dev  # http://localhost:5173
```

`npm run build` type-checks and writes the static site to `dist/`; `npm run preview` serves that build locally.

## Structure

- `src/main.tsx` – routes (hash-based, so old `/#/contact` links keep working)
- `src/components/` – layout/nav and the particle background
- `src/pages/` – Home and Contact
- `src/styles.css` – all styles
- `public/` – copied as-is (`CNAME`, favicon, robots.txt)

## Deployment

Every push to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages. Pull requests run the build only.

One-time repo setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**, with `danielkmak.com` as the custom domain.

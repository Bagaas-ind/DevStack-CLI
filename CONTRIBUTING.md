# Contributing

Thanks for considering a contribution to React-Lara Forge.

## Before opening an issue

- Search existing issues to avoid duplicates.
- Include your operating system, Node.js, npm, PHP, and Composer versions.
- Include the exact command you ran and the complete relevant error output.
- Never include passwords, access tokens, or private `.env` values.

## Development setup

```bash
git clone https://github.com/Bagaas-ind/react-lara-forge.git
cd react-lara-forge
npm ci
npm test
```

To test generation locally, use a disposable directory and make sure PHP and Composer are installed. A full generation test downloads Laravel and frontend packages, so it requires an internet connection.

## Pull requests

1. Create a focused branch from `main`.
2. Keep changes compatible with the existing Laravel + React generator purpose.
3. Add or update tests for behavior changes.
4. Run `npm test` before submitting.
5. Update README or other documentation when CLI behavior changes.
6. Describe what changed, why it changed, and how you tested it.

Avoid committing generated applications, `node_modules`, `.env` files, secrets, or local database files.

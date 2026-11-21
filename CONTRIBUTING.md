# Contributing to DevStack CLI

Thanks for considering a contribution to DevStack CLI. Bug reports, documentation fixes, tests, and focused feature proposals are welcome.

## Before opening an issue

- Search existing issues to avoid duplicates.
- Include your operating system, Node.js, npm, PHP, and Composer versions.
- Include the exact command you ran and the complete relevant error output.
- Never include passwords, access tokens, or private `.env` values.
- For feature requests, explain the user problem and a small example of the expected workflow.

## Development setup

```bash
git clone https://github.com/Bagaas-ind/DevStack-CLI.git
cd DevStack-CLI
npm ci
npm test
```

To test generation locally, use a disposable directory and make sure PHP and Composer are installed. A full generation test downloads Laravel and frontend packages, so it requires an internet connection.

## Project principles

- Keep the current Laravel + React generator working while adding new capabilities.
- Do not document planned framework installers as released functionality.
- Prefer guided, beginner-friendly workflows with clear error messages.
- Validate user input and avoid destructive operations outside the target project directory.
- Add automated tests for new behavior and regression fixes.
- Keep Windows, macOS, and Linux behavior in mind.

## Pull requests

1. Create a focused branch from `main`.
2. Keep changes small enough to review.
3. Add or update tests for behavior changes.
4. Run `npm test` before submitting.
5. Update README or other documentation when CLI behavior changes.
6. Describe what changed, why it changed, and how you tested it.

Avoid committing generated applications, `node_modules`, `.env` files, secrets, or local database files.

# Security Policy

## Reporting a vulnerability

Please do not report security vulnerabilities in public issues.

Use GitHub's private vulnerability reporting feature for this repository. Include the affected version, reproduction steps, impact, and any suggested mitigation. Do not include real credentials, personal data, or production secrets.

## Supported scope

The repository contains a command-line application generator and templates. Reports may cover the CLI itself, generated backend/frontend templates, dependency handling, and project-generation behavior.

## Important usage notes

StackPilot currently generates a development starter; it is not a fully security-audited production system. Review authentication storage, authorization, CORS, environment secrets, rate limits, logging, dependency versions, and deployment configuration before exposing a generated application publicly.

Never paste secrets or real production environment files into public issues or pull requests.

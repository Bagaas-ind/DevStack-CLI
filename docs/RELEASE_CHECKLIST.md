# Release Checklist

Use this checklist when preparing a StackPilot release. It is a manual maintainer guide; completing it does not replace reviewing the release diff or checking the CI results.

## 1. Review the change

- [ ] Confirm the release scope and review all changes included since the previous release.
- [ ] Check that no temporary files, generated test projects, local databases, `.env` files, credentials, or personal data are included.
- [ ] Confirm that README instructions describe behavior that is actually available in the current version.
- [ ] Review dependency changes and the lockfile together.

## 2. Verify locally

Run from a clean checkout:

```bash
npm ci
npm test
```

Then:

- [ ] Check the GitHub Actions result for the release commit.
- [ ] Run the CLI help command and verify the documented commands are listed.
- [ ] Smoke-test the installation path on each operating system claimed as supported.
- [ ] If a generator workflow changed, generate into a disposable directory and verify the output before testing installation or database setup.
- [ ] Record any platform or prerequisite limitations that could not be tested.

Do not describe a check as passing unless it was actually run and its result was reviewed.

## 3. Prepare release notes

- [ ] Update `package.json` and `package-lock.json` together when changing the package version.
- [ ] Add a dated entry to `CHANGELOG.md` describing user-visible changes.
- [ ] Mention breaking changes, new prerequisites, and known limitations.
- [ ] Check both English and Indonesian documentation when user-facing behavior or instructions change.

## 4. Publish and verify

- [ ] Review the final diff and confirm the target branch is correct.
- [ ] Create a Git tag that matches the package version (for example, `v0.5.0`).
- [ ] Publish release notes that match the changelog.
- [ ] If distributing a package or installer, verify the published artifact and installation instructions from a clean environment.
- [ ] After publishing, check the repository release page and test the documented installation command.

## Release quality rule

A green contribution graph or a created tag is not evidence that a release works. Prefer a smaller, verified release over a larger release with untested claims.

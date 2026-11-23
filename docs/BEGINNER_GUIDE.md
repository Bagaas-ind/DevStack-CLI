# Beginner Guide: From GitHub to Running StackPilot

**Language:** English · [Bahasa Indonesia](BEGINNER_GUIDE.id.md)

This guide is for people who are new to GitHub and command-line terminals. You do not need to understand Git to try the one-command Windows launcher.

## 1. Basic terms

- **Repository (repo):** a project folder hosted on GitHub.
- **README:** the project's introduction and getting-started instructions.
- **Clone:** downloading a repository copy with Git.
- **Terminal:** an application where you type commands, such as CMD or PowerShell.
- **Runtime:** software that executes a program; StackPilot runs on Node.js.
- **Dependency:** an additional library required by an application.
- **Framework:** a foundation for building applications, such as Laravel, React, or Django.
- **CLI:** an application controlled through terminal commands and menus.
- **Fork:** your own GitHub copy of someone else's repository, usually used to propose changes safely.
- **Branch:** a separate line of work where you can make changes without directly changing the main branch.
- **Commit:** a saved snapshot of your changes with a short description.
- **Issue:** a GitHub discussion used to report a bug, ask a question, or suggest an improvement.
- **Pull request (PR):** a proposal to review and merge changes from one branch into another.

You can use StackPilot without cloning the repository. Start with the one-command method below.

## 2. What you need

For the simplest method, prepare:

1. Windows 10/11 64-bit (Intel/AMD x64).
2. An internet connection.
3. A regular CMD window — Administrator rights are not required.

The one-command launcher does not currently support Windows ARM64 or 32-bit. It provides portable Node.js 22 LTS, but it does not install every framework runtime.

## 3. Run StackPilot from CMD

1. Press Windows + R.
2. Type `cmd` and press Enter.
3. Copy the complete command below and paste it into CMD:

```cmd
powershell.exe -NoLogo -NoProfile -Command "irm 'https://raw.githubusercontent.com/Bagaas-ind/StackPilot/main/scripts/install.ps1' | iex"
```

4. Press Enter.
5. Wait while the launcher downloads the runtime and prepares StackPilot.
6. When the main menu appears, type the number of the feature you want and press Enter.

**Important:** this command downloads and executes a script from the internet. You can inspect the [installer script](../scripts/install.ps1) first. Run it only if you trust the source code and understand that it will execute on your computer.

## 4. Other ways to launch

### PowerShell

Open a regular PowerShell window and run:

```powershell
irm https://raw.githubusercontent.com/Bagaas-ind/StackPilot/main/scripts/install.ps1 | iex
```

### Node.js is already installed

If Node.js 22 or 24 LTS and npm are available:

```bash
npx --yes github:Bagaas-ind/StackPilot
```

### Clone the source code with Git

This method requires Git, Node.js 22/24, npm, and internet access:

```bash
git clone https://github.com/Bagaas-ind/StackPilot.git
cd StackPilot
npm ci
node index.js
```

## 5. Understand the StackPilot menu

| Menu | Purpose | Notes |
| --- | --- | --- |
| Runtime Doctor | Checks runtimes and tool versions | Does not install or remove software |
| Framework Installer | Helps create projects with 11 frameworks | Check framework prerequisites first |
| Application Generator | Creates a Laravel API + React starter | Backend requires PHP 8.2+ and Composer 2.x |
| Environment Manager | Shows runtime inventory and PATH | Read-only; does not change PATH |
| Database Manager | Checks database clients and common TCP ports | Does not test login or run SQL queries |
| Docker Manager | Checks Docker/Compose and offers Compose actions | Start/stop requires confirmation |
| Exit | Closes the application | — |

Enter the displayed menu number to continue. Read each prompt and action summary before confirming an operation.

## 6. Framework prerequisites

The launcher only provides Node.js for running StackPilot. Other tools are still required for the workflow you choose:

- Laravel, CodeIgniter 4, Symfony: PHP and Composer.
- React, Vue.js, Next.js, Express.js: Node.js and npm.
- Django, Flask, FastAPI: Python and pip.
- Spring Boot: Java and `tar`.
- Docker Manager: Docker Engine/Desktop and the Compose plugin.

Application Generator backend creation requires PHP 8.2+ and Composer 2.x. Frameworks and dependencies are generally downloaded from the internet.

## 7. Troubleshooting

| Symptom | What to check |
| --- | --- |
| CMD command does not run | Copy the entire command including quotation marks; make sure you are in CMD |
| Download fails | Check internet, proxy, firewall, then retry |
| Node.js is missing when using npx | Install Node.js 22/24 LTS and ensure npm is on PATH |
| PHP/Composer is not detected | Install the framework's required version and open a new terminal |
| Docker daemon is unreachable | Start Docker Desktop/Engine and wait until it is ready |
| Generator cannot download dependencies | Check internet access and Composer/npm error output |

When asking for help, include your operating system, installation method, command, and full relevant error output. Remove passwords, tokens, and secrets before sharing logs.

## 8. Explore the source and contribute

To learn the project:

1. Open the [StackPilot repository](https://github.com/Bagaas-ind/StackPilot).
2. Use the **Code** tab to browse folders and files.
3. Read the README before running commands.
4. Explore `lib/` for CLI modules, `scripts/` for launchers, and `templates/` for project templates.
5. Read [CONTRIBUTING.md](../CONTRIBUTING.md) before submitting changes.

To test a local clone, run:

```bash
npm ci
npm test
```

Never commit `.env` files, passwords, tokens, private databases, or the `node_modules` folder.

## 9. Security and limitations

- Do not run scripts or commands you do not understand.
- Review Compose files before confirming Docker Compose up/down.
- Never include database credentials in public bug reports.
- Generated projects are development starters, not applications that are automatically production-secure.
- Review authentication, authorization, CORS, secrets, dependencies, and deployment before publishing an application.

## References

- [StackPilot repository](https://github.com/Bagaas-ind/StackPilot)
- [Full usage guide](USAGE.id.md)
- [Contribution guide](../CONTRIBUTING.md)
- [Security policy](../SECURITY.md)

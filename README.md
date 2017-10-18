# TeamCity build number

> Sets the TeamCity build number based on the branch or Pull Request.

Designed to be run as a build step within a TeamCity pipeline. It accesses system properties via `env.TEAMCITY_BUILD_PROPERTIES_FILE` but needs others passed in as arguments (see [options](#options) below).

This can be used as a cross-platform replacement for the 'GitFlow' PowerShell build step.

## Build number format

The build number format is in the form:

**Major.Minor.Patch.Counter-(BranchName OR rCommitHash]**

Note: the following examples assume a version of *1.2.3*, a build counter of *99* and a commit hash of *a1b2c3d*:

| Branch                     | Version              |
| -------------------------- | -------------------- |
| master                     | 1.2.3.99-ra1b2c3d    |
| pull request (from branch) | 1.2.3.99-branch-name |
| feature branch             | 1.2.3.99-branch-name |

## Usage

With npm>=5.2, use the Command Line Interface via npx:

```sh
npx @nice-digital/teamcity-build-number --branch=%teamcity.build.branch% --usePackageJsonVersion=true --gitHubToken=%GITHUB_TOKEN% --gitHubRepo=%system.GitHubOwnerRepo%
```

## Options

### branch

- Type: `String`
- Required: `true`
- CLI alias: `b`

The branch to build from e.g. `%teamcity.build.branch%`

### usePackageJsonVersion

- Type: `Boolean`
- Required: `false`
- Default: `false`

Whether to use the package.json version as the build number.

Note: this assumes that the `%system.build.vcs.number%` TeamCity parameter is a build countere, e.g. *Build number format*:  `%build.counter%`

### gitHubToken

- Type: `String`
- Required: `true` to build Pull Requests

A GitHub authentication. Used for getting details of a Pull Request from the GitHub API.

### gitHubRepo

- Type: `String`
- Required: `true`

### packageRelativePath

- Type: `String`
- Required: `false`

If no value is supplied the package.json file will be looked for in the root of the repository. 
If a value is given such as "src", then it will look for said file in "[repo root]\src\package.json"

## Debugging this module

To debug this module run a command like the following:

```sh
node --inspect-brk bin/cli.js --branch mybranch --gitHubToken mytoken --gitHubRepo myrepo --usePackageJsonVersion
```

then navigate chrome to:

[chrome://inspect](chrome://inspect)


a "Remote target" should pop up. Just click 'inspect' and chrome dev tools will debug the script.

# TeamCity build number

> Sets the TeamCity build number based on the branch or Pull Request.

[![npm](https://img.shields.io/npm/v/@nice-digital/teamcity-build-number.svg)](https://www.npmjs.com/package/@nice-digital/teamcity-build-number)
[![License](https://img.shields.io/github/license/nice-digital/teamcity-build-number.svg)](https://github.com/nice-digital/teamcity-build-number/blob/master/LICENSE)
[![Dependencies](https://img.shields.io/david/nice-digital/teamcity-build-number.svg)](https://david-dm.org/nice-digital/teamcity-build-number)
[![Dev dependencies](https://img.shields.io/david/dev/nice-digital/teamcity-build-number.svg)](https://david-dm.org/nice-digital/teamcity-build-number?type=dev)

<details>
<summary><strong>Table of contents</strong></summary>

- [TeamCity build number](#teamcity-build-number)
	- [What is it?](#what-is-it)
	- [Build number format](#build-number-format)
	- [Usage](#usage)
	- [Options](#options)
		- [branch](#branch)
		- [usePackageJsonVersion](#usepackagejsonversion)
		- [gitHubToken](#githubtoken)
		- [gitHubRepo](#githubrepo)
		- [packageRelativePath](#packagerelativepath)
		- [enforceNamingConvention](#enforcenamingconvention)
	- [Debugging this module](#debugging-this-module)
	- [TeamCity config](#teamcity-config)
		- [Update npm](#update-npm)
		- [Branch specification](#branch-specification)
</details>


## What is it?

Command line tool to set the build number based on the branch or pull request within TeamCity.

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
npx @nice-digital/teamcity-build-number --branch=%teamcity.build.branch% --usePackageJsonVersion --gitHubToken=%GITHUB_TOKEN% --gitHubRepo=%system.GitHubOwnerRepo%
```

## Options

### branch

- Type: `String`
- Required: `true`
- CLI alias: `b`
- Example: `--branch=%teamcity.build.branch%`

The branch to build from e.g. `%teamcity.build.branch%`

### usePackageJsonVersion

- Type: `Boolean`
- Required: `false`
- Default: `false`
- Example: `--usePackageJsonVersion`

Whether to use the package.json version as the build number. Only needed if you are using package.json version, and it doesn't require a value e.g. just `--usePackageJsonVersion`.

Note: in v0.x this option could be used like `--usePackageJsonVersion=true` but this is no longer the case.

Note 2: If you use this you need to add system.build.counter and point it to %build.counter% in the System Properties in the Parameters of the Build Configuration.

### gitHubToken

- Type: `String`
- Required: `true` to build Pull Requests

A GitHub authentication token. Used for getting details of a Pull Request from the GitHub API. Must have access to the repository set in `gitHubRepo`.

### gitHubRepo

- Type: `String`
- Required: `true`
- Example: `--gitHubRepo nice-digital/guidance-web`

The GitHub organisation (or username) and repository to check for status of Pull Requests etc.

### packageRelativePath

- Type: `String`
- Required: `false`
- Example: `--packageRelativePath src/client`

If no value is supplied the package.json file will be looked for in the root of the repository. 
If a value is given such as "src", then it will look for said file in "[repo root]\src\package.json"

### enforceNamingConvention

- Type: `Boolean`
- Required: `false`
- Example: `--enforceNamingConvention`

If no value is supplied the naming conventions on the branch and pull request names are not enforced. 
If present (which means `true`) then the naming conventions are enforced and the build will be cancelled with the reason logged.

Note: in v0.x this option could be used like `--enforceNamingConvention=true` but this is no longer the case.

## Debugging this module

To debug this module run a command like the following:

```sh
node --inspect-brk bin/cli.js --branch mybranch --gitHubToken mytoken --gitHubRepo myrepo --usePackageJsonVersion
```

then navigate chrome to:

[chrome://inspect](chrome://inspect)

a "Remote target" should pop up. Just click 'inspect' and chrome dev tools will debug the script.

## TeamCity config

### Update npm

If you're using NVM or an npm version < 5.2 then you might need to run the following command before setting the build number:

```sh
npm install -g npm
```

> Note: if you're using a build agent with Node.js >= 8.2.0 this should have npm >= 5.3 pre-installed so you might not need to update npm.

### Branch specification

We recommend the following branch specification for your VCS root (
 Build Configuration Settings -> Version Control Settings -> VCS Roots -> Branch specification). This automatically builds master.

```sh
+:refs/heads/(master)
```

DO NOT specify `+:refs/pull/(*/merge)` in the branch specification this will allow for unauthorised pull requests to run in TC. If you want to build pull requests use the build feature "Pull requests" this will allow you to limit pull requests from members and collaborators.

See [Building GitHub pull requests with TeamCity](https://blog.jetbrains.com/teamcity/2019/08/building-github-pull-requests-with-teamcity/) on the JetBrains blog for more info.

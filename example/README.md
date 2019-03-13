# @nice-digital/teamcity-build-number example

An example project for running locally. This is useful if you want to test the console output locally, without having to run in an actual TeamCity instance. We provide a fake *build.properties* file to mimic TeamCity.

## Steps to run

Run the following in GitBash:

```sh
TEAMCITY_BUILD_PROPERTIES_FILE=build.properties npx @nice-digital/teamcity-build-number --branch 1/merge --gitHubToken $GITHUB_TOKEN --gitHubRepo nhsevidence/global-nav --usePackageJsonVersion --packageRelativePath test --enforceNamingConvention`
```

You'll need to find a valid pull request and project to use in place of *1/merge* and *global-nav* and you'll need to set the `GITHUB_TOKEN` environment variable to be a valid GitHub access token.

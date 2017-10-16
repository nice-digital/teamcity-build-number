const path = require("path"),
	https = require("https");

const PullRequestRegex = /(\d+)\/merge/i,
	MaxBranchNameLength = 20;

function setBuildNumber(usePackageJsonVersion, branch, gitHubToken, gitHubRepo) {

	console.log("Settings build number...");

	const tcProps = require("./tc-props")();
	console.log("TeamCity properties", tcProps);

	branch = sanitiseBranchName(branch);

	const projectName = tcProps.get("system.teamcity.projectName"),
		fullHash = tcProps.get("system.build.vcs.number"),
		shortHash = fullHash.slice(0,7).toUpperCase();

	var buildNumber = tcProps.get("system.build.number");

	if(usePackageJsonVersion) {
		console.log("##teamcity[blockOpened name='package.json version']");

		console.log("Using package json version as build number");

		const packageJsonPath = path.join(process.cwd(), "package.json"),
			packageJson = require(packageJsonPath),
			version = packageJson.version;

		console.log(`Current package json version is '${ version }'`);

		// Assume buildNumber is a counter if we're using the package.json build number
		if(!buildNumber.toString().match(/^\d+$/)) {
			throw new Error("Expected system.build.number to be a build counter integer, but found '${ buildNumber }'");
		}

		console.log(`Build counter is '${ buildNumber }'`);

		// Use Major.Minor.Patch.Counter format
		buildNumber = `${ version }.${ buildNumber }`;

		console.log("##teamcity[blockClosed name='package.json version']");
	}

	console.log(`Setting build number for project '${ projectName }'`);
	console.log(`Current build number is '${ buildNumber }'`);
	console.log(`Branch is '${ branch }'`);

	if (branch == "master")
	{
		console.log("Building master");
		buildNumber = `${ buildNumber }-r${ shortHash }`;
		outputTeamCityBuildNumber(buildNumber);
		return buildNumber;
	}

	const pullRequestMatch = branch.match(PullRequestRegex);

	if(!pullRequestMatch) {
		console.log("Building a feature branch");
		branch = trimBranchName(branch);
		buildNumber = `${ buildNumber }-${ branch }`;
		outputTeamCityBuildNumber(buildNumber);
		return buildNumber;
	}

	console.log("##teamcity[blockOpened name='Pull Request']");
	var pullRequestId = Number(pullRequestMatch[1]);
	console.log(`Using pull request #${ pullRequestId }`);

	getPullRequest(gitHubToken, gitHubRepo, pullRequestId)
		.then((data) => {
			if(!data.mergeable) {
				console.error(`Pull request #${ pullRequestId } is not mergeable into master.`);
				process.exit(1);
			} else {
				console.log(`Pull request #${ pullRequestId } can be merged into master.`);
				branch = trimBranchName(sanitiseBranchName(data.head.ref));
				console.log(`Branch for PR #${ pullRequestId } is '${ branch }'.`);
				buildNumber = `${ buildNumber }-${ branch }`;
				outputTeamCityBuildNumber(buildNumber);

				console.log("##teamcity[blockClosed name='Pull Request']");
			}
		});
}

/**
 * Gets a pull request object from the GitHub API, returning a promise.
 *
 * @param      {string}   gitHubToken    The GitHub authentication token
 * @param      {string}   gitHubRepo     The string repo e.g. "nhsevidence/NICE.TopHat"
 * @param      {integer}   pullRequestId  The pull request identifier
 * @return     {Promise}  A promise that resolves with the PR object.
 */
function getPullRequest(gitHubToken, gitHubRepo, pullRequestId) {

	const auth = `${ gitHubToken }:x-oauth-basic`,
		authToken = new Buffer(auth).toString("base64"),
		requestOptions = {
			method: "GET",
			protocol: "https:",
			port: 443,
			hostname: "api.github.com",
			path: `/repos/${ gitHubRepo }/pulls/${ pullRequestId }`,
			headers: {
				"Authorization": `Basic ${authToken}`,
				"User-Agent": "TeamCity"
			}
		};

	return new Promise((resolve, reject) => {
		const request = https.request(requestOptions, function(response) {
			const body = [];
			response.on("data", (d) => { body.push(d); });
			response.on("end", () => {
				if (response.statusCode < 200 || response.statusCode > 299) {
					reject(new Error(`Failed to load page, status code: ${ response.statusCode }`));
				} else {
					try {
						const parsed = JSON.parse(body.join(""));
						resolve(parsed);
					} catch (error) {
						reject(error);
					}
				}
			});
		});

		request.on("error", reject);
		request.end();
	});
}

/**
 * Writes the teamcity build number to the log
 *
 * @param      {string}  buildNumber  The build number
 */
function outputTeamCityBuildNumber(buildNumber) {
	console.log(`## teamcity[buildNumber '${ buildNumber }']`);
}

/**
 * Sanitises a branch name by removing things like refs/heads to get the
 * raw branch name
 *
 * @param      {string}  branchName  The branch name
 * @return     {string}  { The sanitised branch name }
 */
function sanitiseBranchName(branchName) {
	// Sometimes branches are like "refs/heads/master" or "refs/pulls/15/merge"
	branchName = branchName.replace("refs/heads/", "");
	branchName = branchName.replace("refs/pulls/", "");
	branchName = branchName.replace("feature/", "");
	return branchName;
}

/**
 * Trims a branch name if it's too long
 *
 * @param      {string}  branchName  The branch name
 * @return     {string}  { The new, trimmed branch name }
 */
function trimBranchName(branchName) {
	if(branchName.length > MaxBranchNameLength) {
		console.log(`Branch '${ branchName }'' name too long, trimming to ${ MaxBranchNameLength } chars.`);
		branchName = branchName.substring(0, MaxBranchNameLength);
		console.log(`Trimmed to '${ branchName }'.`);
	}

	return branchName;
}


module.exports = {
	setBuildNumber: setBuildNumber,
	getPullRequest: getPullRequest,
	outputTeamCityBuildNumber: outputTeamCityBuildNumber,
	sanitiseBranchName: sanitiseBranchName,
	trimBranchName: trimBranchName,
	MaxBranchNameLength: MaxBranchNameLength
};

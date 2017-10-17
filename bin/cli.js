#! /usr/bin/env node

const commandLineArgs = require("command-line-args");

const optionDefinitions = [
	{ name: "branch", alias: "b", type: String },
	{ name: "gitHubToken", type: String },
	{ name: "gitHubRepo", type: String },
	{ name: "usePackageJsonVersion", type: Boolean },
	{ name: "packageRelativePath", type: String }
];

const options = commandLineArgs(optionDefinitions);

require("../src/").setBuildNumber(options.usePackageJsonVersion, options.branch, options.gitHubToken, options.gitHubRepo, options.packageRelativePath);

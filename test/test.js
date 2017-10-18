var assert = require("assert");

var index = require("../src/");

describe("TeamCity build number", function() {
	describe("Trim branch name", function() {
		it("should trim branch when too long", function() {
			var branch = "abcdefghijklmnopqrstuvwxyz";

			var trimmed = index.trimBranchName(branch);

			assert.equal(trimmed, "abcdefghijklmnopqrst");
		});
	});

	describe("Get package.json path", function() {
		var processCwd = "C:\\_src\\teamcity-build-number";

		it("when relative path is null process directory is unchanged", function() {
			var pathToPackage = index.getPackagePath(processCwd, null);
			assert.equal(pathToPackage, "C:\\_src\\teamcity-build-number\\package.json");
		});

		it("when relative path is undefined process directory is unchanged", function() {
			var pathToPackage = index.getPackagePath(processCwd, undefined);
			assert.equal(pathToPackage, "C:\\_src\\teamcity-build-number\\package.json");
		});

		it("when relative path is passed process directory is correct", function() {
			var pathToPackage = index.getPackagePath(processCwd, "src");
			assert.equal(pathToPackage, "C:\\_src\\teamcity-build-number\\src\\package.json");
		});
	});

	// TODO...
});

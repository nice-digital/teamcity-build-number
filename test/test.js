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

	describe("Name Matches Convention", function() {
		
		it("when enforceNamingConvention is not set, true is always returned", function() {
			var returnValue = index.nameMatchesConvention(undefined, null);
			assert.equal(returnValue, true);
		});

		it("when enforceNamingConvention is null, true is always returned", function() {
			var returnValue = index.nameMatchesConvention(null, null);
			assert.equal(returnValue, true);
		});

		it("when enforceNamingConvention is false, true is always returned", function() {
			var returnValue = index.nameMatchesConvention(false, null);
			assert.equal(returnValue, true);
		});

		it("when enforceNamingConvention is true and an undefined object is passed, false is returned", function() {
			var returnValue = index.nameMatchesConvention(true, undefined);
			assert.equal(returnValue, false);
		});

		it("when enforceNamingConvention is true and a null is passed, false is returned", function() {
			var returnValue = index.nameMatchesConvention(true, null);
			assert.equal(returnValue, false);
		});

		it("when enforceNamingConvention is true and an empty string is passed, false is returned", function() {
			var returnValue = index.nameMatchesConvention(true, "");
			assert.equal(returnValue, false);
		});

		it("when enforceNamingConvention is true and a valid string is passed, true is returned", function() {
			var returnValue = index.nameMatchesConvention(true, "PW-11 upgrade mspec");
			assert.equal(returnValue, true);
		});
	});
});

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

	// TODO...
});

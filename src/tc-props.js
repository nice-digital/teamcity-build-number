// Abstraction around teamcity-properties module so we can mock it for testing
// without having to have an actual .properties file
module.exports = () => require("teamcity-properties");

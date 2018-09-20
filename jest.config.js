// https://stackoverflow.com/questions/49603939/jest-async-callback-was-not-invoked-within-the-5000ms-timeout-specified-by-jest
module.exports = {
	setupTestFrameworkScriptFile: './jest.setup.js',
	collectCoverage: false,
	collectCoverageFrom: [
		"**/*.{js,jsx}",
		"!**/node_modules/**",
		"!**/vendor/**"
	  ]
}

module.exports = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	setupFiles: [
		'jest-canvas-mock',
		'jest-localstorage-mock',
		'<rootDir>/packages/core/test/setup.js',
	],
};
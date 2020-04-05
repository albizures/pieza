module.exports = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	globals: {
		__ELECTRON__: false,
	},
	setupFiles: [
		'jest-canvas-mock',
		'jest-localstorage-mock',
		'<rootDir>/packages/core/src/utils/test/setup.js',
	],
};

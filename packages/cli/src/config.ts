import { Configuration } from 'webpack';

const defaultBabelConfig = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					browsers: ['last 2 versions'],
				},
			},
		],
		'@babel/preset-typescript',
	],
};

const defaultWebpackConfig: Configuration = {
	output: {
		filename: '[name].js',
		chunkFilename: '[name].js',
	},
	optimization: {
		usedExports: true,
	},
	stats: 'none',
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: defaultBabelConfig,
				},
			},
		],
	},
};

export { defaultBabelConfig, defaultWebpackConfig };

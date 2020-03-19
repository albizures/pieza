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
	mode: 'development',
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
	resolve: {
		extensions: ['.js', '.ts'],
	},
};

if (process.env.NODE_ENV === 'production') {
	defaultWebpackConfig.mode = 'production';

	if (defaultWebpackConfig.resolve) {
		defaultWebpackConfig.resolve.alias = {
			p5: require.resolve('p5/lib/p5.min.js'),
		};
	}
}

export { defaultBabelConfig, defaultWebpackConfig };

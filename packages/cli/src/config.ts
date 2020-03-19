import { Configuration } from 'webpack';

const defaultBabelConfig = {
	presets: ['@babel/preset-typescript'],
};

const defaultWebpackConfig: Configuration = {
	output: {
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: '[name].js',
	},
	performance: { hints: false },
	stats: 'none',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /(node_modules)/,
				use: [
					'cache-loader',
					{
						loader: 'babel-loader',
						options: defaultBabelConfig,
					},
				],
			},
		],
	},
	resolve: {
		alias: {
			p5: require.resolve('p5/lib/p5.min.js'),
		},
		extensions: ['.js', '.ts'],
	},
};

export { defaultBabelConfig, defaultWebpackConfig };

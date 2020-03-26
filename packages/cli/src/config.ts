import { Configuration } from 'webpack';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const defaultBabelConfig = {
	presets: ['@babel/preset-typescript'],
};

const defaultWebpackConfig: Configuration = {
	output: {
		publicPath: '/',
		filename: '[name].[hash:8].js',
		chunkFilename: '[id].c.[hash:8].js',
	},
	performance: { hints: false },
	optimization: {
		nodeEnv: 'electron',
	},
	stats: 'none',
	mode: 'development',
	devtool: false,
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

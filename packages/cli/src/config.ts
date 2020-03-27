import fs from 'fs';
import path from 'path';

const projectPath = fs.realpathSync(process.cwd());
const defaultBuildPath = path.join(projectPath, 'dist');
const cachePath = path.join(projectPath, 'node_modules', '.cache', 'pieza');
const sketchesPath = path.join(projectPath, 'src/sketches');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const defaultBabelConfig = {
	presets: ['@babel/preset-typescript'],
};

const defaultWebpackConfig = {
	output: {
		publicPath: '/',
		filename: '[name].[hash:8].js',
		chunkFilename: '[id].c.[hash:8].js',
		path: defaultBuildPath,
		libraryTarget: undefined as string | undefined,
	},
	performance: { hints: false },
	optimization: {},
	target: 'web',
	mode: 'development',
	stats: 'none',
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
	plugins: [] as unknown[],
	resolve: {
		alias: {
			p5: require.resolve('p5/lib/p5.min.js'),
		},
		extensions: ['.js', '.ts'],
	},
};

export {
	defaultBabelConfig,
	defaultWebpackConfig,
	projectPath,
	defaultBuildPath,
	cachePath,
	sketchesPath,
};

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Rewrite } from 'connect-history-api-fallback';
import webpack, { Configuration, Compiler } from 'webpack';
// @ts-ignore
import createLogger from 'webpack-dev-server/lib/utils/createLogger';
import Server, { Configuration as ServerConfig } from 'webpack-dev-server';
import { defaultWebpackConfig } from '../config';
import { Pieza, OptionConfig, EnvType, SketchData } from '../types';
import { getAssetsFolder } from './files';

const createDevServer = (
	compiler: Compiler,
	rewrites: Rewrite[],
	verbose: boolean,
) => {
	const log = createLogger({
		...(verbose ? {} : { logLevel: 'silent' }),
	});

	const config: ServerConfig = {
		compress: false,
		contentBase: [getAssetsFolder()],
		historyApiFallback: {
			rewrites: rewrites,
		},
	};
	// @ts-ignore
	return new Server(compiler, config, log);
};

const createCompiler = (options: OptionConfig) => {
	const config = createWebpackConfig(options);

	return webpack(config);
};

const getPlugins = async (
	piezas: Pieza[],
	sketchesData: Record<string, SketchData>,
): Promise<HtmlWebpackPlugin[]> => {
	const names = piezas.map((pieza) => pieza.id);
	return piezas.map((pieza) => {
		const { id } = pieza;
		const { name } = sketchesData[id];

		return new HtmlWebpackPlugin({
			excludeChunks: names.filter((current) => current !== id),
			xhtml: true,
			title: name,
			filename: `${id}.html`,
			minify: process.env.NODE_ENV === 'production' && {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true,
				minifyCSS: true,
			},
			template: path.join(__dirname, '..', '..', 'template.html'),
		});
	});
};

const createWebpackConfig = (options: OptionConfig): Configuration => {
	const {
		envType = EnvType.Web,
		production = false,
		plugins = [],
		entry,
		buildPath,
	} = options;

	const config = {
		...defaultWebpackConfig,
		output: {
			...defaultWebpackConfig.output,
		},
		entry,
	};

	const definePluginConfig = {
		__SERVER__: false,
		__ELECTRON__: false,
	};

	if (envType === EnvType.Electron) {
		config.target = 'electron-renderer';
		config.optimization = {
			nodeEnv: 'electron',
		};
		config.entry['electron-page'] = require.resolve(
			'@pieza/dev-window/dist/page',
		);
		definePluginConfig.__ELECTRON__ = true;
	} else if (envType === EnvType.Server) {
		config.target = 'node';
		config.output.filename = '[name].js';
		config.output.libraryTarget = 'commonjs2';
		definePluginConfig.__SERVER__ = true;
	}

	if (buildPath) {
		config.output.path = buildPath;
	}

	if (production) {
		config.mode = 'production';
	}

	config.plugins = plugins.concat(new webpack.DefinePlugin(definePluginConfig));

	return config as Configuration;
};

const compile = (compiler: Compiler) =>
	new Promise((resolve, reject) => {
		compiler.run((error, stats) => {
			if (error) {
				reject(error);
			} else {
				resolve(stats);
			}
		});
	});

export { createDevServer, createCompiler, getPlugins, compile };

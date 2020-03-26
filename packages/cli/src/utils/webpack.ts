import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Rewrite } from 'connect-history-api-fallback';
import webpack, { Configuration, Compiler } from 'webpack';
// @ts-ignore
import createLogger from 'webpack-dev-server/lib/utils/createLogger';
import Server, { Configuration as ServerConfig } from 'webpack-dev-server';
import { defaultWebpackConfig } from '../config';
import { Pieza, OptionConfig, EnvType } from '../types';
import { getPiezaName } from './files';

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

const getPlugins = async (piezas: Pieza[]): Promise<HtmlWebpackPlugin[]> => {
	const names = piezas.map((pieza) => pieza.name);
	return piezas.map((pieza) => {
		const { name, file } = pieza;

		return new HtmlWebpackPlugin({
			excludeChunks: names.filter((current) => current !== name),
			xhtml: true,
			title: getPiezaName(file) || name,
			filename: `${name}.html`,
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
	} = options;

	const config = {
		...defaultWebpackConfig,
		entry,
	};

	const definePluginConfig: Record<string, boolean> = {
		__SERVER__: envType === EnvType.Server,
	};

	if (envType === EnvType.Electron) {
		config.target = 'electron-renderer';
		config.optimization = {
			nodeEnv: 'electron',
		};
		config.entry['electron-page'] = require.resolve(
			'@pieza/dev-window/dist/page',
		);
	}

	if (production) {
		config.mode = 'production';
	}

	config.plugins = plugins.concat(new webpack.DefinePlugin(definePluginConfig));

	return config as Configuration;
};

export { createDevServer, createCompiler, getPlugins };

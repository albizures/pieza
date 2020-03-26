import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Rewrite } from 'connect-history-api-fallback';
import webpack, { Configuration, Compiler } from 'webpack';
// @ts-ignore
import createLogger from 'webpack-dev-server/lib/utils/createLogger';
import Server, { Configuration as ServerConfig } from 'webpack-dev-server';
import { defaultWebpackConfig } from '../config';
import { Pieza } from '../types';
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

const createCompiler = (customConfig: Configuration, electron = false) => {
	const options: Configuration = Object.assign(
		{},
		defaultWebpackConfig,
		customConfig,
	);

	if (electron) {
		options.target = 'electron-renderer';
	}

	return webpack(options);
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
			template: path.join(__dirname, '..', 'template.html'),
		});
	});
};

export { createDevServer, createCompiler, getPlugins };

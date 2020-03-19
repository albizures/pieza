import glob from 'glob';
import fs from 'fs';
import path from 'path';
import Server, { Configuration as ServerConfig } from 'webpack-dev-server';
import { Rewrite } from 'connect-history-api-fallback';
// @ts-ignore
import createLogger from 'webpack-dev-server/lib/utils/createLogger';
import webpack, { Configuration, Compiler } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { defaultWebpackConfig } from './config';

const appDirectory = fs.realpathSync(process.cwd());

const getFiles = (root: string): Promise<string[]> =>
	new Promise((resolve, reject) => {
		glob(path.join(root, '**/*.ts'), (error, files) => {
			if (error) {
				reject(error);
			} else {
				resolve(files);
			}
		});
	});

const getEntries = async (files: string[]): Promise<Record<string, string>> => {
	return files.reduce((entries, file) => {
		const { name } = path.parse(file);

		entries[name] = file;

		return entries;
	}, {} as Record<string, string>);
};

const getPiezaName = (file: string) => {
	try {
		const line = fs
			.readFileSync(file, 'utf8')
			.split('\n')
			.find((line) => line.includes('// @pieza-name: '));
		if (line) {
			return line.replace('// @pieza-name: ', '');
		}
	} catch (error) {
		return error;
	}

	return undefined;
};

const getPlugins = async (files: string[]): Promise<HtmlWebpackPlugin[]> => {
	return files.map((file) => {
		const { name } = path.parse(file);

		return new HtmlWebpackPlugin({
			chunks: [name],
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

const createCompiler = (customConfig: Configuration) => {
	const options = Object.assign({}, defaultWebpackConfig, customConfig);
	return webpack(options);
};

const createDevServer = (compiler: Compiler, rewrites: Rewrite[]) => {
	const log = createLogger({
		logLevel: 'silent',
	});
	const config: ServerConfig = {
		historyApiFallback: {
			rewrites: rewrites,
		},
	};
	// @ts-ignore
	return new Server(compiler, config, log);
};

const getMainFolder = () => {
	return path.join(appDirectory, 'src/sketches');
};

const getRoutes = (filenames: string[]): Rewrite[] => {
	return filenames.map((filename) => {
		const { name } = path.parse(filename);
		return {
			from: new RegExp(`/${name}`),
			to: `/${name}.html`,
		};
	});
};

export {
	getFiles,
	getRoutes,
	getEntries,
	getPlugins,
	createCompiler,
	createDevServer,
	getMainFolder,
};

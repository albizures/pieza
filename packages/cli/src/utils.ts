import glob from 'glob';
import fs from 'fs';
import path from 'path';
import Server from 'webpack-dev-server';
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
		return require(file).default.name;
	} catch (error) {
		const relativeFile = file.replace(appDirectory, '.');
		throw new Error(`${relativeFile} invalid export`);
	}

	return undefined;
};

const getPlugins = async (files: string[]): Promise<HtmlWebpackPlugin[]> => {
	return files.map((file) => {
		const { name } = path.parse(file);

		return new HtmlWebpackPlugin({
			chunks: [name],
			title: getPiezaName(file) || name,
			filename: `${name}.html`,
		});
	});
};

const createCompiler = (customConfig: Configuration) => {
	const options = Object.assign({}, defaultWebpackConfig, customConfig);
	return webpack(options);
};

const createDevServer = (compiler: Compiler) => {
	const log = createLogger({
		logLevel: 'silent',
	});
	// @ts-ignore
	return new Server(compiler, {}, log);
};

const getMainFolder = () => {
	return path.join(appDirectory, 'src/piezas');
};

export {
	getFiles,
	getEntries,
	getPlugins,
	createCompiler,
	createDevServer,
	getMainFolder,
};

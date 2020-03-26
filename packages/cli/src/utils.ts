import glob from 'glob';
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import Server, { Configuration as ServerConfig } from 'webpack-dev-server';
import { Rewrite } from 'connect-history-api-fallback';
// @ts-ignore
import createLogger from 'webpack-dev-server/lib/utils/createLogger';
import webpack, { Configuration, Compiler } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { defaultWebpackConfig } from './config';

interface Pieza {
	name: string;
	from: RegExp;
	to: string;
	file: string;
}

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

const getEntries = async (piezas: Pieza[]): Promise<Record<string, string>> => {
	return piezas.reduce((entries, pieza) => {
		const { name, file } = pieza;

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

const getMainFolder = () => {
	return path.join(appDirectory, 'src/sketches');
};

const getRoutes = (piezas: Pieza[]): Rewrite[] => {
	return piezas.map((pieza) => {
		const { from, to } = pieza;
		return {
			from,
			to,
		};
	});
};

const parseFiles = (files: string[]): Pieza[] => {
	return files.map((file) => {
		const { name } = path.parse(file);
		return {
			name,
			from: new RegExp(`/${name}`),
			to: `/${name}.html`,
			file,
		};
	});
};

const getPackage = () => {
	return require(`${appDirectory}/package.json`);
};

const isYarnAvailable = async () => {
	try {
		await execa('yarn', ['--version']);
		return true;
	} catch (e) {
		return false;
	}
};

export {
	getFiles,
	getRoutes,
	getPackage,
	getEntries,
	parseFiles,
	getPlugins,
	createCompiler,
	createDevServer,
	isYarnAvailable,
	getMainFolder,
};

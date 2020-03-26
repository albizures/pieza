import glob from 'glob';
import path from 'path';
import { Rewrite } from 'connect-history-api-fallback';
import { getProjectFolder } from './files';
import { Pieza } from '../types';

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

const getRoutes = (piezas: Pieza[]): Rewrite[] => {
	return piezas.map((pieza) => {
		const { from, to } = pieza;
		return {
			from,
			to,
		};
	});
};

const getPackage = () => {
	return require(`${getProjectFolder()}/package.json`);
};

export { getFiles, getRoutes, getPackage, getEntries };

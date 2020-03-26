import fs from 'fs';
import path from 'path';
import { Pieza } from '../types';

const getProjectFolder = () => fs.realpathSync(process.cwd());

const getMainFolder = () => {
	return path.join(getProjectFolder(), 'src/sketches');
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

export { getMainFolder, getProjectFolder, parseFiles, getPiezaName };

import path from 'path';
import type { Pieza as PiezaData } from '@pieza/core';
import { projectPath, cachePath } from '../config';
import { Pieza, EnvType, SketchData } from '../types';
import { createCompiler, compile } from './webpack';
import rimraf from 'rimraf';

const getMainFolder = () => {
	return path.join(projectPath, 'src/sketches');
};

const getSketchesData = async (
	entry: Record<string, string>,
): Promise<Record<string, SketchData>> => {
	const compiler = createCompiler({
		entry,
		buildPath: path.join(projectPath, 'node_modules/.cache/pieza'),
		envType: EnvType.Server,
	});

	await compile(compiler);

	return Object.keys(entry).reduce((result, id) => {
		result[id] = getSketchData(id);
		return result;
	}, {} as Record<string, SketchData>);
};

const getSketchData = (id: string): SketchData => {
	const { name } = require(path.join(cachePath, `${id}.js`))
		.default as PiezaData;

	return {
		name,
	};
};

const parseFiles = (files: string[]): Pieza[] => {
	return files.map((file) => {
		const { name } = path.parse(file);
		return {
			id: name,
			from: new RegExp(`/${name}`),
			to: `/${name}.html`,
			file,
		};
	});
};

const clean = (buildPath: string) => {
	rimraf.sync(cachePath);
	rimraf.sync(buildPath);
};

export { getMainFolder, parseFiles, getSketchesData, clean };

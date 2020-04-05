import { Plugin, Entry } from 'webpack';

export interface SketchData {
	name: string;
	width: number;
	height: number;
	url: string;
}

export interface Pieza {
	id: string;
	from: RegExp;
	to: string;
	file: string;
}

export enum EnvType {
	Electron = 'electron',
	Web = 'web',
	Server = 'server',
}

export interface OptionConfig {
	buildPath?: string;
	envType?: EnvType;
	production?: boolean;
	plugins?: Plugin[];
	entry: Entry;
}

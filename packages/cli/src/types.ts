import { Plugin, Entry } from 'webpack';

export interface Pieza {
	name: string;
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
	envType?: EnvType;
	production?: boolean;
	plugins?: Plugin[];
	entry: Entry;
}

import p5 from 'p5';
import { Size, PiezaData } from './types';
import { clean, isClient } from './utils';
import {
	setCurrentPiezaData,
	cleanCurrentPiezaData,
	useContext,
} from './hooks';

type Setup<S> = () => void | S;
type SettingsFactory<T> = (context: p5) => T;

type PiezaSize = number | Size;
const isSettingsFactory = <T>(
	factory: SettingsFactory<T> | T,
): factory is SettingsFactory<T> => {
	return typeof factory === 'function';
};

interface PiezaConfig<T, S> {
	name: string;
	autoAttach?: boolean;
	autoClean?: boolean;
	type?: p5.WEBGL | p5.P2D;
	size?: PiezaSize;
	setup?: Setup<S>;
	draw?: () => void;
	update?: (state: S) => S;
	state?: S;
	settings?: SettingsFactory<T> | T;
}

const noop = () => undefined;

const parseSize = (size: PiezaSize): Size => {
	if (typeof size === 'number') {
		return {
			width: size,
			height: size,
		};
	}

	return size;
};

export interface Pieza {
	attach: (parent: HTMLElement) => Promise<void>;
	updateSetting: (settingName: string, value: any) => void;
}

const piezas = new Map<string, Pieza>();
const piezasData = new Map<string, PiezaData>();

export type Piezas = typeof piezas;
export type PiezasData = typeof piezasData;

const defaultSetup = () => {
	const context = useContext();

	context.strokeWeight(2);
};

const getLocalSettings = <T extends object>(name: string) => {
	if (!isClient) {
		return {};
	}

	const rawSetting = localStorage.getItem(`${name}-pieza-settings`);

	if (rawSetting) {
		try {
			return JSON.parse(rawSetting) as T;
		} catch (error) {
			return {};
		}
	}
	return {};
};

const setLocalSetting = (name: string, settingName: string, value: unknown) => {
	const localSettings = getLocalSettings(name);
	if (!isClient) {
		return;
	}
	localStorage.setItem(
		`${name}-pieza-settings`,
		JSON.stringify({
			...localSettings,
			[settingName]: value,
		}),
	);
};

const run = (fns: (Function | null | undefined)[], data: PiezaData) => {
	setCurrentPiezaData(data);
	fns.forEach((fn) => {
		if (!fn) {
			return;
		}
		try {
			fn();
		} catch (error) {
			console.error(error);
		}
	});
	cleanCurrentPiezaData();
};

const runSetup = <S>(setup: Setup<S>, data: PiezaData) => () => {
	const state = setup();
	if (state) {
		data.state = state;
	}
};

const defaultSize: PiezaSize = isClient
	? {
			height: window.innerHeight,
			width: window.innerWidth,
	  }
	: 360;

const create = <T extends object = {}, S extends object = {}>(
	config: PiezaConfig<T, S>,
) => {
	const {
		setup = noop,
		type,
		autoClean = false,
		autoAttach = true,
		size: rawSize = defaultSize,
		name,
		settings,
		draw,
		update,
		state: defaultState = {} as S,
	} = config;

	if (!isClient) {
		return {
			attach: () => console.log('not available in the server'),
			updateSetting: () => console.log('not available in the server'),
			name,
		};
	}

	if (piezas.has(name)) {
		throw new Error(`Name already used: '${name}'`);
	}

	const localSettings = getLocalSettings<T>(name);

	const size = parseSize(rawSize);

	const properties = Object.keys(localSettings);

	if (localSettings && properties.length > 0) {
		console.warn(
			`Using local setting for ${properties.join(', ')} in pieza '${name}'`,
		);
	}

	let context: p5;
	const data = {
		state: defaultState,
		name,
		get context() {
			return context;
		},
		sizeAndCenter: {
			...size,
			centerX: size.width / 2,
			centerY: size.height / 2,
		},
		settings: {},
	};

	piezasData.set(name, data);

	const attach = async (parent: HTMLElement) => {
		console.log('attaging', parent);

		const { default: p5 } = await import('p5');
		new p5((sketch: p5) => {
			context = sketch;
			context.setup = () => {
				context.createCanvas(size.width, size.height, type);
				if (!draw) {
					context.noLoop();
				}

				data.settings = {
					...(isSettingsFactory(settings) ? settings(context) : settings),
					...localSettings,
				};

				run([defaultSetup, runSetup(setup, data), draw], data);
			};

			if (draw) {
				const updateState = () => {
					if (typeof update === 'function') {
						data.state = update(data.state);
					}
				};
				context.draw = () => {
					run([updateState, autoClean ? clean : null, draw], data);
				};
			}
		}, parent);
	};

	const updateSetting = (settingName: string, value: unknown) => {
		// @ts-ignore
		if (value === data.settings[settingName]) {
			return;
		}

		Object.assign(data.settings, { [settingName]: value });
		setLocalSetting(name, settingName, value);

		run([clean, defaultSetup, runSetup(setup, data), draw], data);
	};

	const pieza = {
		attach,
		updateSetting,
	};

	if (autoAttach && isClient) {
		attach(document.body);
	}

	piezas.set(name, pieza);

	return pieza;
};

const WEBGL = 'webgl';

export { useContext, useSettings, useSize, useState } from './hooks';
export { run, WEBGL, create, piezas, piezasData };

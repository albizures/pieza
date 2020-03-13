import p5 from 'p5';
import { Size, PiezaData, SettingsFactory, Setup, Draw, Update } from './types';
import { clean, isClient } from './utils';
import {
	setCurrentPiezaData,
	cleanCurrentPiezaData,
	useContext,
} from './hooks';

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
	draw?: Draw;
	update?: Update<S>;
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
const piezasData = new Map<string, PiezaData<any>>();

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

const run = <S>(fns: (Function | null | undefined)[], data: PiezaData<S>) => {
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

const runSetup = <S>(setup: Setup<S>, data: PiezaData<S>) => () => {
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

const attachFactory = <T, S>(
	data: PiezaData<S>,
	localSettings: object,
	settings?: SettingsFactory<T> | T,
) => async (parent: HTMLElement) => {
	const { sizeAndCenter, type, draw, setup, autoClean, update } = data;

	const { default: p5 } = await import('p5');
	new p5((sketch: p5) => {
		data.context = sketch;
		sketch.setup = () => {
			sketch.createCanvas(sizeAndCenter.width, sizeAndCenter.height, type);
			if (!draw) {
				sketch.noLoop();
			}

			data.settings = {
				...(isSettingsFactory(settings) ? settings(sketch) : settings),
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
			sketch.draw = () => {
				run([updateState, autoClean ? clean : null, draw], data);
			};
		}
	}, parent);
};

const updateSettingFactory = <S>(data: PiezaData<S>) => (
	settingName: string,
	value: unknown,
) => {
	const { setup, draw } = data;
	// @ts-ignore
	if (value === data.settings[settingName]) {
		return;
	}

	Object.assign(data.settings, { [settingName]: value });
	setLocalSetting(name, settingName, value);

	run([clean, defaultSetup, runSetup(setup, data), draw], data);
};

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
	const data: PiezaData<S> = {
		state: defaultState,
		name,
		draw,
		setup,
		update,
		autoClean,
		get context() {
			return context;
		},
		set context(value) {
			context = value;
		},
		sizeAndCenter: {
			...size,
			centerX: size.width / 2,
			centerY: size.height / 2,
		},
		settings: {},
	};

	piezasData.set(name, data);

	const pieza = {
		attach: attachFactory<T, S>(data, localSettings, settings),
		updateSetting: updateSettingFactory(data),
	};

	if (autoAttach && isClient) {
		pieza.attach(document.body);
	}

	piezas.set(name, pieza);

	return pieza;
};

const WEBGL = 'webgl';

export { run, WEBGL, create, piezas, piezasData };

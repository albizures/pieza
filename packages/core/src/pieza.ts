import {
	Size,
	Context,
	PiezaData,
	SettingsFactory,
	Setup,
	PiezaSize,
	PiezaConfig,
	Settings,
	ConfigSettingsValue,
} from './types';
import { parseSettings } from './settings';
import { clean, isClient, defaultSetup } from './utils';
import { getLocalSettings, setLocalSetting } from './localSettings';
import { run } from './utils/hooks';
import { createSettingsPanel } from './settingsPanel';
import { wrapEventHandlers, setEventHandlers } from './events';

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

const attachFactory = <T extends Settings, S>(
	config: PiezaConfig<T, S>,
	data: PiezaData<S>,
	localSettings: object,
	settings?: SettingsFactory<ConfigSettingsValue<T>> | ConfigSettingsValue<T>,
) => async (parent: HTMLElement) => {
	const { sizeAndCenter, type, draw, setup, autoClean, update } = data;

	const { default: p5 } = await import('p5');
	new p5((sketch: Context) => {
		data.context = sketch;

		setEventHandlers(config, sketch);

		sketch.setup = () => {
			sketch.createCanvas(sizeAndCenter.width, sizeAndCenter.height, type);
			if (!draw) {
				sketch.noLoop();
			}

			if (settings) {
				const { values, description } = parseSettings(settings, sketch);

				data.settingsDescription = description;
				data.settings = {
					...values,
					...localSettings,
				};
			}

			createSettingsPanel(data);

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

const create = <T extends Settings = {}, S = void>(
	config: PiezaConfig<T, S>,
) => {
	const {
		setup,
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
			attach: () => console.warn('not available in the server'),
			updateSetting: () => console.warn('not available in the server'),
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

	let context: Context;
	const data: PiezaData<S> = {
		state: defaultState,
		type,
		name,
		draw,
		setup,
		update,
		settingsDescription: {},
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

	wrapEventHandlers(config, data);

	piezasData.set(name, data);

	const pieza = {
		attach: attachFactory<T, S>(config, data, localSettings, settings),
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

import {
	Context,
	PiezaData,
	PiezaSize,
	PiezaConfig,
	ConfigSettings,
} from './types';
import { getSettings } from './settings';
import { clear, isClient, defaultSetup, runSetup, parseSize } from './utils';
import { setLocalSetting } from './localSettings';
import { run } from './utils/hooks';
import { wrapEventHandlers, setEventHandlers } from './events';

export interface Pieza {
	name: string;
	attach: (parent: HTMLElement) => Promise<void>;
	updateSetting: (settingName: string, value: any) => void;
}

const piezas = new Map<string, Pieza>();
const piezasData = new Map<string, PiezaData<any>>();

export type Piezas = typeof piezas;
export type PiezasData = typeof piezasData;

const defaultSize: PiezaSize = {
	height: 600,
	width: 600,
};

const addSettings = <T extends object, S>(
	data: PiezaData<S>,
	context: Context,
	settings?: ConfigSettings<T>,
) => {
	const { name } = data;
	if (settings) {
		const { values, description } = getSettings(name, settings, context);

		data.settingsDescription = description;
		data.settings = values;
	}
};

const addSetup = <S>(data: PiezaData<S>, context: Context) => {
	const { draw, measures, type, setup } = data;
	context.setup = () => {
		context.createCanvas(measures.width, measures.height, type);
		if (!draw) {
			context.noLoop();
		}

		data.measures = {
			get width() {
				return context.width;
			},
			get height() {
				return context.height;
			},
			get centerX() {
				return context.width / 2;
			},
			get centerY() {
				return context.height / 2;
			},
		};

		run([defaultSetup, runSetup(setup, data), draw], data);
	};
};

const addDraw = <S>(data: PiezaData<S>, context: Context) => {
	const { draw, autoClean, update } = data;

	if (!draw) {
		return;
	}

	const updateState = () => {
		if (typeof update === 'function') {
			const dataUpdate = update(data.state);

			if (dataUpdate) {
				Object.assign(data.state, dataUpdate);
			}
		}
	};

	context.draw = () => {
		run([updateState, autoClean ? clear : null, draw], data);
	};
};

const updateSettingFactory = <S, T extends object>(data: PiezaData<S, T>) => (
	settingName: string,
	value: unknown,
) => {
	const { setup, draw } = data;
	if (!data || !data.settings) {
		return;
	}

	if (!(settingName in data.settings)) {
		return;
	}

	Object.assign(data.settings, { [settingName]: value });
	setLocalSetting(name, settingName, value);

	run([clear, defaultSetup, runSetup(setup, data), draw], data);
};

const create = <T extends object = {}, S = void>(config: PiezaConfig<T, S>) => {
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
		settingsPanel = !__ELECTRON__,
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

	const size = parseSize(rawSize);

	let context: Context;
	const data: PiezaData<S, {}> = {
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

		// these number are temporal
		measures: {
			...size,
			centerX: size.width / 2,
			centerY: size.height / 2,
		},
		settings: {},
		settingsPanel,
	};

	wrapEventHandlers(config, data);

	piezasData.set(name, data);

	const updateSetting = updateSettingFactory(data);

	const setupPieza = (context: Context) => {
		data.context = context;

		setEventHandlers(config, context);

		addSettings(data, context, settings);

		addSetup(data, context);

		addDraw(data, context);

		if (
			data.settings &&
			Object.keys(data.settings).length > 0 &&
			settingsPanel
		) {
			import('./settingsPanel').then(({ createSettingsPanel }) => {
				createSettingsPanel(data, updateSetting);
			});
		}
	};

	const pieza = {
		name,
		attach: async (parent: HTMLElement) => {
			const { default: p5 } = await import('p5');
			new p5((context: Context) => setupPieza(context), parent);
		},
		updateSetting,
	};

	if (autoAttach && isClient) {
		pieza.attach(document.body);
	}

	piezas.set(name, pieza);

	return pieza;
};

const WEBGL = 'webgl';

export {
	run,
	WEBGL,
	create,
	piezas,
	piezasData,
	addDraw,
	addSetup,
	addSettings,
};

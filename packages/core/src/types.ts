import p5 from 'p5';

export type Context = p5;

export interface Size {
	width: number;
	height: number;
}

export type Setup<S> = () => S;
export type SettingsFactory<T> = (context: p5) => T;
export type Draw = () => void;
export type Update<S> = (state: S) => S;

export enum P5EventsNames {
	keyPressed = 'keyPressed',
	keyReleased = 'keyReleased',
	keyTyped = 'keyTyped',
	deviceMoved = 'deviceMoved',
	deviceTurned = 'deviceTurned',
	deviceShaken = 'deviceShaken',
	mouseMoved = 'mouseMoved',
	mouseDragged = 'mouseDragged',
	mousePressed = 'mousePressed',
	mouseReleased = 'mouseReleased',
	mouseClicked = 'mouseClicked',
	doubleClicked = 'doubleClicked',
	mouseWheel = 'mouseWheel',
	touchStarted = 'touchStarted',
	touchMoved = 'touchMoved',
	touchEnded = 'touchEnded',
	windowResized = 'windowResized',
}

export type P5EventHandler = () => boolean | void;
export type P5EventHandlers = Partial<Record<P5EventsNames, P5EventHandler>>;

export interface Recorder {
	mediaRecorder: MediaRecorder;
	recordedBlobs: Blob[];
	start: () => void;
	resume: () => void;
	pause: () => void;
	save: (name?: string) => void;
}

export type SettingsDescription<T> = {
	[K in keyof T]: DescribedSetting<T[K]>;
};

export interface ContextMeasures extends Size {
	centerX: number;
	centerY: number;
}

export interface PiezaData<S = unknown, T = unknown> extends P5EventHandlers {
	context: p5;
	recorder?: Recorder;
	measures: ContextMeasures;
	name: string;
	draw?: Draw;
	type?: p5.WEBGL | p5.P2D;
	setup: Setup<S>;
	update?: Update<S>;
	state: S;
	settingsDescription: SettingsDescription<T>;
	autoClean: boolean;
	settings?: T;
	settingsPanel: boolean;
}

export enum PrimitiveTypeSetting {
	Number = 'number',
	String = 'string',
	Boolean = 'boolean',
}

export const describedSetting = Symbol('describedSetting');

export type PrimitiveSetting = number | string | boolean;
export interface DescribedSetting<S> {
	type: PrimitiveTypeSetting;
	value: S;
	label: string;
	[describedSetting]: true;
}

export interface NumberSetting extends DescribedSetting<number> {
	slide: boolean;
	min: number;
	max: number;
	step?: number;
}

export interface StringSetting extends DescribedSetting<string> {}
export interface BooleanSetting extends DescribedSetting<boolean> {}

export type Setting =
	| NumberSetting
	| StringSetting
	| BooleanSetting
	| PrimitiveSetting;

// export type Settings = Record<string, PrimitiveSetting>;

export type PiezaSize = number | Size;

export type ConfigSettingsValue<S> = {
	[T in keyof S]: DescribedSetting<S[T]> | S[T];
};

export type ConfigSettings<T> =
	| SettingsFactory<ConfigSettingsValue<T>>
	| ConfigSettingsValue<T>;

export interface PiezaConfig<T extends object, S> extends P5EventHandlers {
	name: string;
	autoAttach?: boolean;
	autoClean?: boolean;
	type?: p5.WEBGL | p5.P2D;
	size?: PiezaSize;
	setup: Setup<S>;
	draw?: Draw;
	update?: Update<S>;
	state?: S;
	settingsPanel?: boolean;
	settings?: ConfigSettings<T>;
}

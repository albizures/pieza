import type p5 from 'p5';

export type { Vector } from 'p5';

export interface Size {
	width: number;
	height: number;
}

export type Setup<S> = () => void | S;
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

export interface PiezaData<S = unknown> extends P5EventHandlers {
	context: p5;
	recorder?: Recorder;
	sizeAndCenter: Size & { centerX: number; centerY: number };
	name: string;
	draw?: Draw;
	type?: p5.WEBGL | p5.P2D;
	setup: Setup<S>;
	update?: Update<S>;
	state: S;
	autoClean: boolean;
	settings?: unknown;
}

export type PiezaSize = number | Size;

export interface PiezaConfig<T, S> extends P5EventHandlers {
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


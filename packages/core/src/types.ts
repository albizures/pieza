import p5 from 'p5';

export { Vector } from 'p5';

export interface Size {
	width: number;
	height: number;
}

export type Setup<S> = () => void | S;
export type SettingsFactory<T> = (context: p5) => T;
export type Draw = () => void;
export type Update<S> = (state: S) => S;

export interface PiezaData<S = unknown> {
	context: p5;
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

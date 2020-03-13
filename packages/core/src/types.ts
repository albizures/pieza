import p5 from 'p5';

export { Vector } from 'p5';

export interface Size {
	width: number;
	height: number;
}

export interface PiezaData {
	context: p5;
	sizeAndCenter: Size & { centerX: number; centerY: number };
	name: string;
	state: unknown;
	settings?: unknown;
}

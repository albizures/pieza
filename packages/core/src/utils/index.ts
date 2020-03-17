import { Vector } from '../types';
import { useContext } from '../hooks';

const drawPoint = (point: Vector) => {
	const context = useContext();
	context.point(point.x, point.y, point.z);
};

const drawLine = (start: Vector, end: Vector) => {
	const context = useContext();
	context.line(start.x, start.y, start.z, end.x, end.y, end.z);
};

const defaultSetup = () => {
	const context = useContext();

	context.strokeWeight(2);
};

const clean = () => {
	const context = useContext();

	context.clear();
};

const background = (color: string) => {
	const context = useContext();

	context.background(color);
};

const debounce = (fn: Function, wait: number) => {
	let timer: number;
	return (...args: any[]) => {
		clearTimeout(timer);

		timer = window.setTimeout(() => {
			fn(...args);
		}, wait);
	};
};

const isClient = typeof window === 'object';

export {
	drawPoint,
	drawLine,
	clean,
	background,
	isClient,
	defaultSetup,
	debounce,
};

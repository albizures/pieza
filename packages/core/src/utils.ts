import { Vector } from './types';
import { useContext } from './hooks';

const drawPoint = (point: Vector) => {
	const context = useContext();
	context.point(point.x, point.y, point.z);
};

const drawLine = (start: Vector, end: Vector) => {
	const context = useContext();
	context.line(start.x, start.y, start.z, end.x, end.y, end.z);
};

const clean = () => {
	const context = useContext();

	context.clear();
};

const background = (color: string) => {
	const context = useContext();

	context.background(color);
};

const isClient = typeof window === 'object';

export { drawPoint, drawLine, clean, background, isClient };

import { Vector } from 'p5';
import { Setup, PiezaData, Size, PiezaSize } from '../types';
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

const clear = () => {
	const context = useContext();

	context.clear();
};

const background = (color: string) => {
	const context = useContext();

	context.background(color);
};

const isClient = typeof window === 'object';

const runSetup = <S>(setup: Setup<S>, data: PiezaData<S>) => () => {
	const state = setup();
	if (state) {
		data.state = state;
	}
};

const parseSize = (size: PiezaSize): Size => {
	if (typeof size === 'number') {
		return {
			width: size,
			height: size,
		};
	}

	return size;
};

export {
	parseSize,
	drawPoint,
	drawLine,
	clear,
	background,
	isClient,
	defaultSetup,
	runSetup,
};

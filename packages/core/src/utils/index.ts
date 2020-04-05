import { Setup, PiezaData, Size, PiezaSize } from '../types';
import { useContext, useMeasures } from '../hooks';

const defaultSetup = () => {
	const context = useContext();

	scaleSketch();
	context.strokeWeight(2);
};

const toPercentage = (value: number, max: number) => {
	return (value * 100) / max;
};

const resizeSketch = (width: number, height: number) => {
	const context = useContext();
	const { windowWidth, windowHeight } = context;

	const scale = getScale();
	const newWidth = scale * width;
	const newHeight = scale * height;
	const leftOffset = (windowWidth - newWidth) / 2;
	const topOffset = (windowHeight - newHeight) / 2;

	//@ts-ignore
	const canvas = context.canvas as HTMLCanvasElement;

	canvas.style.width = `${toPercentage(newWidth, windowWidth)}%`;
	canvas.style.height = `${toPercentage(newHeight, windowHeight)}%`;
	canvas.style.marginLeft = `${toPercentage(leftOffset, windowWidth)}%`;
	canvas.style.marginTop = `${toPercentage(topOffset, windowHeight)}%`;
};

const scaleSketch = () => {
	const { width, height } = useMeasures();
	resizeSketch(width, height);
};

const getScale = () => {
	const context = useContext();
	const { width, height } = useMeasures();
	if (context.windowHeight > context.windowWidth) {
		return context.windowWidth / width;
	}

	return context.windowHeight / height;
};

const clear = () => {
	const context = useContext();

	context.clear();
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
	clear,
	isClient,
	defaultSetup,
	runSetup,
	getScale,
	scaleSketch,
	resizeSketch,
};

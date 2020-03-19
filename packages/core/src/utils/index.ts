import { Setup, PiezaData, Size, PiezaSize } from '../types';
import { useContext } from '../hooks';

const defaultSetup = () => {
	const context = useContext();

	context.strokeWeight(2);
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

export { parseSize, clear, isClient, defaultSetup, runSetup };

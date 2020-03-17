import { PiezaData } from '../types';

let currentData: PiezaData<any> | null;

const setCurrentData = <S>(data: PiezaData<S>) => {
	currentData = data;
};

const cleanCurrentData = () => {
	currentData = null;
};

const getCurrentData = <S>(name: string): PiezaData<S> => {
	if (!currentData) {
		throw new Error(`${name} used outside of a pieza`);
	}

	return currentData;
};

type AnyFn = (...args: any) => any;

const singleRun = <S, F extends AnyFn>(
	fn: F | null | undefined,
	data: PiezaData<S>,
): ReturnType<F> | void => {
	setCurrentData(data);
	if (!fn) {
		cleanCurrentData();
		return;
	}
	try {
		return fn();
	} catch (error) {
		console.error(error);
	}
	cleanCurrentData();
};

/**
 * run all the given functions within a
 * pieza context and ignores their result
 */
const run = <S, F extends AnyFn>(
	fns: (F | null | undefined)[],
	data: PiezaData<S>,
) => {
	fns.forEach((fn) => {
		singleRun(fn, data);
	});
};

export {
	run,
	singleRun,
	setCurrentData,
	cleanCurrentData,
	getCurrentData,
	currentData,
};

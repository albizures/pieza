import { setCurrentPiezaData, cleanCurrentPiezaData } from '../hooks';
import { PiezaData } from '../types';

type AnyFn = (...args: any) => any;

const singleRun = <S, F extends AnyFn>(
	fn: F | null | undefined,
	data: PiezaData<S>,
): ReturnType<F> | void => {
	setCurrentPiezaData(data);
	if (!fn) {
		cleanCurrentPiezaData();
		return;
	}
	try {
		return fn();
	} catch (error) {
		console.error(error);
	}
	cleanCurrentPiezaData();
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

export { run, singleRun };

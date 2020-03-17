import { getCurrentData } from './utils/hooks';
import { createRecorder } from './utils/recorder';

const useSettings = <T>(): T => {
	return getCurrentData('useSettings').settings as T;
};

const useContext = () => {
	return getCurrentData('useContext').context;
};

type MutableState<S> = [S, (state: S) => void];

const useMutableState = <S>(): MutableState<S> => {
	const data = getCurrentData('useState');

	return [
		data.state as S,
		(state: S) => {
			data.state = Object.assign(data.state, state);
		},
	];
};

const useState = <S>() => {
	return getCurrentData('useState').state as S;
};

const useMeasures = () => {
	return getCurrentData('useSize').measures;
};

const useRecorder = () => {
	const data = getCurrentData('useRecorder');

	if (data.recorder) {
		return data.recorder;
	}

	// @ts-ignore
	const canvas = data.context.canvas;

	data.recorder = createRecorder(canvas, data.name);

	return data.recorder;
};

export {
	useMeasures,
	useState,
	useContext,
	useRecorder,
	useSettings,
	useMutableState,
};

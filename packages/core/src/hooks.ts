import { PiezaData } from './types';
import { createRecorder } from './utils/recorder';

let currentPiezaData: PiezaData<any> | null;

const setCurrentPiezaData = <S>(data: PiezaData<S>) => {
	currentPiezaData = data;
};

const cleanCurrentPiezaData = () => {
	currentPiezaData = null;
};

const checkCurrentPieza = <S>(name: string): PiezaData<S> => {
	if (!currentPiezaData) {
		throw new Error(`${name} used outside of a pieza`);
	}

	return currentPiezaData;
};

const useSettings = <T>(): T => {
	return checkCurrentPieza('useSettings').settings as T;
};

const useContext = () => {
	return checkCurrentPieza('useContext').context;
};

type MutableState<S> = [S, (state: S) => void];

const useMutableState = <S>(): MutableState<S> => {
	const data = checkCurrentPieza('useState');

	return [
		data.state as S,
		(state: S) => {
			data.state = Object.assign(data.state, state);
		},
	];
};

const useState = <S>() => {
	return checkCurrentPieza('useState').state as S;
};

const useSize = () => {
	return checkCurrentPieza('useSize').sizeAndCenter;
};

const useRecorder = () => {
	const data = checkCurrentPieza('useRecorder');

	if (data.recorder) {
		return data.recorder;
	}

	// @ts-ignore
	const canvas = data.context.canvas;

	data.recorder = createRecorder(canvas, data.name);

	return data.recorder;
};

export {
	useSize,
	useState,
	useContext,
	useRecorder,
	useSettings,
	setCurrentPiezaData,
	cleanCurrentPiezaData,
	useMutableState,
};

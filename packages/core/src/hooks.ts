import { PiezaData } from './types';

let currentPiezaData: PiezaData<any> | null;

const setCurrentPiezaData = <S>(data: PiezaData<S>) => {
	currentPiezaData = data;
};

const cleanCurrentPiezaData = () => {
	currentPiezaData = null;
};

const checkCurrentPieza = (name: string): PiezaData<any> => {
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

const useState = <S>() => {
	return checkCurrentPieza('useState').state as S;
};

const useSize = () => {
	return checkCurrentPieza('useSize').sizeAndCenter;
};

export {
	useSettings,
	useSize,
	useState,
	useContext,
	setCurrentPiezaData,
	cleanCurrentPiezaData,
};

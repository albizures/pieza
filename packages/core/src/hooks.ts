import { PiezaData } from './types';

let currentPiezaData: PiezaData;

const setCurrentPiezaData = (data: PiezaData) => {
	currentPiezaData = data;
};

const cleanCurrentPiezaData = () => {
	currentPiezaData = null;
};

const checkCurrentPieza = (name: string) => {
	if (!currentPiezaData) {
		throw new Error(`${name} used outside of a pieza`);
	}
};

const useSettings = <T>(): T => {
	checkCurrentPieza('useSettings');
	return currentPiezaData.settings as T;
};

const useContext = () => {
	checkCurrentPieza('useContext');
	return currentPiezaData.context;
};

const useState = <S>() => {
	checkCurrentPieza('useState');
	return currentPiezaData.state as S;
};

const useSize = () => {
	checkCurrentPieza('useSize');
	return currentPiezaData.sizeAndCenter;
};

export {
	useSettings,
	useSize,
	useState,
	useContext,
	setCurrentPiezaData,
	cleanCurrentPiezaData,
};

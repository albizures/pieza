import { PiezaData, Context, ConfigSettingsValue } from '../../types';

const createData = (data = {}): PiezaData => {
	//@ts-ignore
	return data;
};

const createContext = (context = {}): Context => {
	//@ts-ignore
	return context;
};

const createSettings = <T>(settings = {}): ConfigSettingsValue<T> => {
	//@ts-ignore
	return settings;
};

export { createData, createContext, createSettings };

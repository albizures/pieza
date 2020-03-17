import { isClient } from './utils';
const getLocalSettings = <T extends object>(name: string): T => {
	if (!isClient) {
		return {} as T;
	}

	const rawSetting = localStorage.getItem(`${name}-pieza-settings`);

	if (rawSetting) {
		try {
			return JSON.parse(rawSetting) as T;
		} catch (error) {
			return {} as T;
		}
	}
	return {} as T;
};

const setLocalSetting = (name: string, settingName: string, value: unknown) => {
	const localSettings = getLocalSettings(name);
	if (!isClient) {
		return;
	}
	localStorage.setItem(
		`${name}-pieza-settings`,
		JSON.stringify({
			...localSettings,
			[settingName]: value,
		}),
	);
};

export { setLocalSetting, getLocalSettings };

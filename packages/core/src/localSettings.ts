import { isClient } from './utils';
const getLocalSettings = <T extends object>(name: string) => {
	if (!isClient) {
		return {};
	}

	const rawSetting = localStorage.getItem(`${name}-pieza-settings`);

	if (rawSetting) {
		try {
			return JSON.parse(rawSetting) as T;
		} catch (error) {
			return {};
		}
	}
	return {};
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

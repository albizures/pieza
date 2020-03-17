import { getLocalSettings, setLocalSetting } from '../localSettings';

test('getLocalSettings', () => {
	jest.spyOn(localStorage, 'getItem');

	const name = 'test';
	const a = getLocalSettings(name);

	expect(localStorage.getItem).toHaveBeenCalledWith(`${name}-pieza-settings`);
});

test('setLocalSetting', () => {
	jest.spyOn(localStorage, 'setItem');

	const name = 'test';
	setLocalSetting(name, 'value', 10);

	expect(localStorage.setItem).toHaveBeenCalledWith(
		`${name}-pieza-settings`,
		JSON.stringify({
			value: 10,
		}),
	);
});

// @pieza-name: Using the settings
import {
	create,
	useContext,
	PiezaSettings,
	useSettings,
	StringSetting,
	NumberSetting,
} from '@pieza/core';

interface Settings extends PiezaSettings {
	value: number;
	text: string;
}

export default create<Settings>({
	name: 'Using the settings',
	setup() {
		const { value } = useSettings<Settings>();
		const context = useContext();

		context.circle(value, value, 50);
	},
	settings: {
		value: NumberSetting({
			value: 100,
			label: 'Value',
		}),
		text: StringSetting({
			value: 'Hello',
			label: 'Text',
		}),
	},
});

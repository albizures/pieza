// @pieza-name: Using the settings
import {
	create,
	useContext,
	PiezaSettings,
	useSettings,
	BooleanSetting,
	StringSetting,
	NumberSetting,
} from '@pieza/core';

interface Settings extends PiezaSettings {
	value: number;
	text: string;
	size: number;
	isDoubleSize: boolean;
}

export default create<Settings>({
	name: 'Using the settings',
	setup() {
		const { value, size, isDoubleSize, text } = useSettings<Settings>();
		const context = useContext();
		context.circle(value, value, isDoubleSize ? size * 2 : size);
		context.textSize(30);
		context.text(text, 50, 50);
	},
	settings: {
		size: NumberSetting({
			label: 'Size',
			slide: true,
			value: 50,
			min: 10,
			max: 100,
			step: 10,
		}),
		isDoubleSize: BooleanSetting({
			label: 'is double size?',
			value: true,
		}),
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

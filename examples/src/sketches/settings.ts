// @pieza-name: Using the settings
import {
	create,
	useContext,
	useSettings,
	BooleanValue,
	StringValue,
	NumberValue,
} from 'pieza';

interface Settings {
	value: number;
	text: string;
	size: number;
	test: {};
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
		test: {},
		size: NumberValue({
			label: 'Size',
			slide: true,
			value: 50,
			min: 10,
			max: 100,
			step: 10,
		}),
		isDoubleSize: BooleanValue({
			label: 'is double size?',
			value: true,
		}),
		value: NumberValue({
			value: 100,
			label: 'Value',
		}),
		text: StringValue({
			value: 'Hello',
			label: 'Text',
		}),
	},
});

// @pieza-name: Recording example
import { create, useContext, useRecorder, useState } from 'pieza';

type Change = 1 | -1;

interface State {
	value: number;
	change: Change;
}

export default create<null, State>({
	name: 'Recording example',
	autoClean: true,
	setup() {
		const context = useContext();
		const recorder = useRecorder();
		context.background('black');

		recorder.start();

		context.mouseClicked = () => {
			recorder.save();
		};

		return {
			value: 1,
			change: 1,
		};
	},
	update(state: State) {
		const { value, change: currentChange } = state;
		let change: Change = currentChange;
		if (value > 300) {
			change = -1;
		} else if (value < 0) {
			change = 1;
		}

		return {
			value: value + change,
			change,
		};
	},
	draw() {
		const context = useContext();
		const { value } = useState<State>();
		context.background('black');
		context.circle(value, value, value);
	},
});

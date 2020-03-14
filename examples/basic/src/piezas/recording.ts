import { create, useContext, useRecorder } from '@pieza/core';

let value = 1;
let change = 1;

export default create({
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
	},
	draw() {
		const context = useContext();
		context.background('black');
		context.circle(value, value, value);

		if (value > 300) {
			change = -1;
		} else if (value < 0) {
			change = 1;
		}

		value = value + change;
	},
});

// @pieza-name: My title
import { create, useContext } from '@pieza/core';

let x = 0;
let y = 0;

export default create({
	name: 'My title',
	autoClean: true,
	setup() {},
	draw() {
		const context = useContext();
		context.circle(x, y, 40);
	},
	mouseMoved() {
		const context = useContext();
		x = context.mouseX;
		y = context.mouseY;
	},
});

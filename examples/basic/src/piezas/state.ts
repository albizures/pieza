// @pieza-name: Using state
import { create, useContext, useMutableState, useState } from '@pieza/core';

interface State {
	x: number;
	y: number;
}

export default create<null, State>({
	name: 'Using state',
	autoClean: true,
	setup() {
		return {
			x: 0,
			y: 0,
		};
	},
	draw() {
		const context = useContext();
		const { x, y } = useState<State>();
		context.circle(x, y, 40);
	},
	mouseMoved() {
		const context = useContext();
		const [, setState] = useMutableState();
		setState({
			x: context.mouseX,
			y: context.mouseY,
		});
	},
});

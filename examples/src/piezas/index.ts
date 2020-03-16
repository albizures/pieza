// @pieza-name: Pieza examples
import { create, useContext } from '@pieza/core';

export default create({
	name: 'Pieza examples',
	setup() {
		const context = useContext();
		context.circle(100, 100, 50);
	},
});

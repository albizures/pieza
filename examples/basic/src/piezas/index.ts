import { create, useContext } from '@pieza/core';

export default create({
	name: 'My title',
	setup() {
		const context = useContext();
		context.circle(100, 100, 50);
	},
});

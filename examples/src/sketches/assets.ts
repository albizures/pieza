import { create, useContext, Image } from 'pieza';

let image: Image;
export default create({
	name: 'Using Assets',
	preload() {
		const context = useContext();
		image = context.loadImage('/octocat.png');
	},
	setup() {
		const context = useContext();
		context.image(image, 0, 0);
	},
});

const wait = (time: number) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});

const sketchWidth = Number(process.env.PIEZA_WIDTH);
const sketchHeight = Number(process.env.PIEZA_HEIGHT);

const getSize = (max: number) => {
	const scale = max / Math.max(sketchWidth, sketchHeight);
	const width = sketchWidth * scale;
	const height = sketchHeight * scale;

	return {
		width,
		height,
	};
};
export { wait, getSize };

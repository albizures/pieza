import execa from 'execa';

const isYarnAvailable = async () => {
	try {
		await execa('yarn', ['--version']);
		return true;
	} catch (e) {
		return false;
	}
};

export { isYarnAvailable };

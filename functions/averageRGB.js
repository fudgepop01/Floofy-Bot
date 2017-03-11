const request = require('request-promise');
const Canvas = require('canvas');


function rgb2hex(r, g, b) {
	r = parseInt(r).toString(16);
	g = parseInt(g).toString(16);
	b = parseInt(b).toString(16);

	let hex = [r, g, b];
	hex = `#${hex.map(val => { if (val.length === 1) val = `0${val}`; return val; }).join('')}`;

	return hex;
}

// http://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript
module.exports = async (url) => {
	var blockSize = 5,
		defaultRGB = { r: 0, g: 0, b: 0 };

	let canvas = new Canvas(100, 100);
	let ctx = canvas.getContext('2d');

	let data, width, height,
		i = -4,
		length,
		rgb = { r: 0, g: 0, b: 0 },
		count = 0;

	if (!ctx) {
		return defaultRGB;
	}

	height = canvas.height;
	width = canvas.width;

	const avatar = new Canvas.Image();
	ctx.globalAlpha = 0.8;
	const avatarRes = await request.defaults({ encoding: null })(url);
	avatar.src = avatarRes;
		let x = 0; let y = 0; let w = 100; let h = 100; // eslint-disable-line
	ctx.rect(x, y, w, h);
	ctx.stroke();
	ctx.fillStyle = 'white';
		avatarRes ? ctx.drawImage(avatar, x, y, w, h) : ctx.fillRect(x, y, w, h); // eslint-disable-line

	try {
		data = ctx.getImageData(0, 0, width, height);
	} catch (err) {
		throw new Error(err);
	}

	length = data.data.length;

	while ((i += blockSize * 4) < length) {
		++count;
		rgb.r += data.data[i];
		rgb.g += data.data[i + 1];
		rgb.b += data.data[i + 2];
	}
	rgb.r /= (width * height) / blockSize;
	rgb.g /= (width * height) / blockSize;
	rgb.b /= (width * height) / blockSize;
	let hex = rgb2hex(rgb.r, rgb.g, rgb.b);
	return hex;
};

const { URL } = require('url');
const winston = require('../structures/Logger.js');
const path = require('path');

module.exports = (message) => {
	let attachmentImage = null;
	const extensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);
	const linkRegex = /https?:\/\/(?:\w+\.)?[\w-]+\.[\w]{2,3}(?:\/[\w-_\.]+)+\.(?:png|jpg|jpeg|gif|webp)/; // eslint-disable-line no-useless-escape
	if (message.attachments.some(attachment => {
		try {
			const url = new URL(attachment.url);
			const ext = path.extname(url.pathname);
			return extensions.has(ext);
		} catch (err) {
			if (err.message !== 'Invalid URL') winston.error(err);
			return false;
		}
	})) attachmentImage = message.attachments.first().url;

	if (!attachmentImage) {
		const linkMatch = message.content.match(linkRegex);
		if (linkMatch) {
			try {
				const url = new URL(linkMatch[0]);
				const ext = path.extname(url.pathname);
				if (extensions.has(ext)) attachmentImage = linkMatch[0]; // eslint-disable-line max-depth
			} catch (err) {
				attachmentImage = null;
				if (err.message === 'Invalid URL') winston.info('No valid image link.'); // eslint-disable-line max-depth
				else winston.error(err);
			}
		}
	}
	return attachmentImage ? attachmentImage.toString() : null;
};

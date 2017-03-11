module.exports = (message) => {
	if (message.attachments && message.attachments.size > 0) return message.attachments.some(attachment => attachment.url.match(/\.(png|jpg|jpeg|gif|webp)$/));
	return false;
};

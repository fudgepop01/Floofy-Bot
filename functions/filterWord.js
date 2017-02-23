module.exports = (word) => {
	word = word.toLowerCase();
	return word.replace(/[!l1i]/g, 'i')
	.replace(/3/g, 'e')
	.replace(/4@/g, 'a')
	.replace(/[5$]/g, 's')
	.replace(/7/g, 't')
	.replace(/0/g, 'o')
	.replace(/#/g, 'h')
	.replace(/z/g, 's');
};

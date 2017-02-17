module.exports = (filteredWords, str) => {
	return filteredWords ? filteredWords.every(word => str.includes(word)) : false;
};

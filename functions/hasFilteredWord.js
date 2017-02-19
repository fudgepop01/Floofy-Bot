module.exports = (filteredWords, str) => {
	return filteredWords ? filteredWords.some(word => str.includes(word)) : false;
};

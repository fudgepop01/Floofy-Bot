module.exports = (filteredWords, str) => {
	for (let i = 0; i < filteredWords.length; i++) { if (str.indexOf(filteredWords[i]) !== -1) return true; }
	return false;
};

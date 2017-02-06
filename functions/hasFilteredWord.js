module.exports = (filteredWords, str) => {
	if (!filteredWords) return false;
	for (let i = 0; i < filteredWords.length; i++) { if (str.indexOf(filteredWords[i]) !== -1) return true; }
	return false;
};

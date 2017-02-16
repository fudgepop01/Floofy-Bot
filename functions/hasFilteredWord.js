module.exports = (filteredWords, str) => {
	if (!filteredWords) return false;
	for (let i = 0; i < filteredWords.length; i++) if (str.includes(filteredWords[i])) return true;
	return false;
};

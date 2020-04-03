const decipher = (string, shift) => {
	let deciphered = "";

	for (let i = 0; i < string.length; i++) {
		const value = string[i].charCodeAt();
		if (value >= 97 && value <= 122) {
			const index = (value - 97 - shift) % 26;
			if (index < 0) deciphered += String.fromCharCode(123 + index);
			else deciphered += String.fromCharCode(index + 97);
		} else {
			deciphered += String.fromCharCode(value);
		}
	}

	return deciphered;
};

module.exports = decipher;

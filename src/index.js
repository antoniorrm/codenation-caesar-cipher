const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");
const FormData = require("form-data");

const decifra = (string, shift) => {
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

const token = "a22076f1b51ff46e0f4f30c649ee3a954986b950";
axios
	.get(
		`https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${token}`
	)
	.then(ret => {
		const message = ret.data;

		message.decifrado = decifra(message.cifrado, message.numero_casas);
		message.resumo_criptografico = crypto
			.createHash("sha1")
			.update(message.decifrado)
			.digest("hex");

		fs.writeFileSync("answer.json", JSON.stringify(message));
		console.log(message);

		const answer = new FormData();
		answer.append("answer", fs.createReadStream("answer.json"));

		return axios.post(
			`https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${message.token}`,
			answer,
			{ headers: answer.getHeaders() }
		);
	})
	.then(_ => {
		console.log("Operação realizado com sucesso");
	})
	.catch(err => {
		console.log(err);
	});

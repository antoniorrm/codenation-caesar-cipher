const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");
const FormData = require("form-data");
const decipher = require("./decipher");

const token = "a22076f1b51ff46e0f4f30c649ee3a954986b950";
axios
	.get(
		`https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${token}`
	)
	.then(response => {
		const messageData = response.data;
		console.log(messageData);

		messageData.decifrado = decipher(
			messageData.cifrado,
			messageData.numero_casas
		);
		messageData.resumo_criptografico = crypto
			.createHash("sha1")
			.update(messageData.decifrado)
			.digest("hex");
		console.log(messageData);
		fs.writeFileSync("answer.json", JSON.stringify(messageData));

		const answer = new FormData();
		answer.append("answer", fs.createReadStream("answer.json"));
		const result = axios.post(
			`https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${messageData.token}`,
			answer,
			{ headers: answer.getHeaders() }
		);

		return result;
	})
	.then(_ => {
		console.log("Operação realizado com sucesso");
	})
	.catch(err => {
		console.log(err);
	});

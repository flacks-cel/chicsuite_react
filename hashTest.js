const bcrypt = require('bcrypt');

// Gerar o hash da senha "admin123"
const password = "admin123";
const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);

console.log("Hash gerado:", hash);

// Comparar o hash gerado com o hash salvo
const savedHash = "$2b$10$D1H5Q7AZ.e8V12ggzpG5UOXuwp/XHucnXbGiPe9Z3ToUeFq/MfgeC";  // Exemplo de hash salvo

const match = bcrypt.compareSync(password, savedHash);
console.log("As senhas são iguais?", match);  // Retorna true se o hash gerar o mesmo valor da senha salva

const bcrypt = require('bcrypt');

// Senha que você quer hashificar
const password = 'admin123';
const saltRounds = 10;  // Nível de segurança

// Gerar o hash
const hash = bcrypt.hashSync(password, saltRounds);

console.log("Novo hash gerado: ", hash);  // Exibe o hash gerado

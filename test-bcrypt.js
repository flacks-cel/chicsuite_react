const bcrypt = require("bcrypt");

const senhaDigitada = "admin123"; // Senha que está tentando logar
const hashBanco = "$2a$10$N7RbF0MR9h4mOmxV54GAx.tCYUDcNxzh7mwpxS.qEHhYV3j5EPF7y"; // O hash do banco

bcrypt.compare(senhaDigitada, hashBanco, (err, resultado) => {
    if (err) {
        console.error("Erro ao comparar:", err);
    } else {
        console.log("Senha está correta?", resultado);
    }
});

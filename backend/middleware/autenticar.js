const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            mensagem: "Acesso não autorizado. Faça login."
        });
    }

    try {

        const dados = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = dados;

        next();

    } catch (erro) {

        return res.status(401).json({
            mensagem: "Token inválido ou expirado. Faça login novamente."
        });
    }
}

module.exports = autenticar;
const jwt = require("jsonwebtoken");
const { idValido } = require("../repos/usuarios");
const { senhaJwt } = require("../dadosSensiveis");

const validarLogin = async (req, res, next) => {
  const tokenBruto = req.headers;
  const { authorization } = tokenBruto;
  if (!authorization) {
    // se nao passar o token
    return res.status(401).json({ mensagem: "Usuário não logado" });
  }
  const token = authorization.split(" ")[1];
  try {
    const { id } = jwt.verify(token, senhaJwt);
    const { rows, rowCount } = await idValido(id);
    if (rowCount === 0) {
      return res.status(401).json({ mensagem: "Usuário inválido" });
    }

    req.usuario = rows[0];

    next();
  } catch (error) {
    return res.status(500).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
  }
};

module.exports = validarLogin;

const express = require("express");
const {
  cadastrarUsuario,
  logarUsuario,
  obterUsuario,
  atualizarUsuario,
  listarCategoria,
} = require("./controladores/usuarios/usuarios");
const {
  listarTransacoes,
  listarTransacao,
  cadastrarTransacao,
  atualizarTransacao,
  deletarTransacao,
  extratoTransacao,
} = require("./controladores/transacoes/transacoes");
const validarLogin = require("./intermediarios/autenticacao");

const rotas = express();

rotas.post("/usuarios", cadastrarUsuario);
rotas.post("/login", logarUsuario);

rotas.use(validarLogin);

rotas.get("/usuario", obterUsuario);
rotas.put("/usuario", atualizarUsuario);

rotas.get("/categoria", listarCategoria);
rotas.get("/transacao/extratos", extratoTransacao);
rotas.get("/transacao", listarTransacoes);
rotas.get("/transacao/:id", listarTransacao);
rotas.post("/transacao", cadastrarTransacao);
rotas.put("/transacao/:idTransacao", atualizarTransacao);
rotas.delete("/transacao/:id", deletarTransacao);


module.exports = rotas;

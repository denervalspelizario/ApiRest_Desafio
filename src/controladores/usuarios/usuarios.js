const jwt = require("jsonwebtoken");
const criptografarSenha = require("../../utils/criptografarSenha");
const compararSenhas = require("../../utils/compararSenhaJwt");
const { cadastroUsuario, emailValido, atualizarUsuarioRepos } = require("../../repos/usuarios");
const { listaCategoria } = require("../../repos/categoria");

const { senhaJwt } = require("../../dadosSensiveis");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !senha || !email) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
  }
  try {
    const emailDuplicado = await emailValido(email)
    if(emailDuplicado){
      return res.status(400).json({ mensagem: "Email já cadastrado" });
    }
    const senhaCriptografada = await criptografarSenha(senha);
    const dadosDoUsuario = { nome, email, senhaCriptografada };
    const { rows: usuariosCadastrados } = await cadastroUsuario(dadosDoUsuario);
    const usuarioCadastrado = usuariosCadastrados[0];
    delete usuarioCadastrado.senha;
    return res.status(201).json(usuarioCadastrado);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro no servidor." });
  }
};

const logarUsuario = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
  }

  try {
    const { rows, rowCount } = await emailValido(email);
    if (rowCount === 0) {
      return res.status(400).json({ mensagem: "Email inválido" });
    }

    const { senha: senhaUsuario, ...usuario } = rows[0];
    const senhaValidada = await compararSenhas(senha, senhaUsuario);
    if (!senhaValidada) {
      return res.status(400).json({ mensagem: "Senha inválida" });
    }
    const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: "8h" });

    return res.status(200).json({
      usuario: usuario,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const obterUsuario = async (req, res) => {
  const { id, nome, email } = req.usuario;

  return res.status(200).json({ id: id, nome: nome, email: email });
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !senha || !email) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
  }
  const { id } = req.usuario;
  try {
    const { rowCount } = await emailValido(email);
    if (rowCount === 1) {
      return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." });
    }
    const senhaCriptografada = await criptografarSenha(senha);
    const dadosDoUsuario = { nome, email, senhaCriptografada, id };
    const usuarioAtualizado = await atualizarUsuarioRepos(dadosDoUsuario);
    if (!usuarioAtualizado) {
      return res.status(400).json({ mensagem: "Usuario não atualizado." });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro no servidor." });
  }
};

const listarCategoria = async (req, res) => {
  try {
    const { rows } = await listaCategoria();
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarUsuario,
  logarUsuario,
  obterUsuario,
  atualizarUsuario,
  listarCategoria
};

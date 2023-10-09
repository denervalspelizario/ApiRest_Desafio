const {
  listaTransacao,
  cadastrarTransacaoRepos,
  detalharTransacao,
  idTransacaoValido,
  atualizarTransacaoRepos,
  deletaTransacaoRepos,
  selecionaTransacaoRepos,
  somaTransacao
} = require("../../repos/transacao");
const { categoriaValida } = require("../../repos/categoria");




const listarTransacoes = async (req, res) => {
  const { id } = req.usuario;
  try {
    const { rows } = await listaTransacao(id);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro no servidor." });
  }
};

const listarTransacao = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await detalharTransacao(id);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro no servidor." });
  }
};

const cadastrarTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id } = req.usuario;

  try {
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }
    const { rowCount } = await categoriaValida(categoria_id);
    if (rowCount === 0) {
      return res.status(400).json({ mensagem: "A categoria informada não existe." });
    }
    if (tipo !== "entrada" && tipo !== "saida") {
      return res.status(400).json({ mensagem: "O tipo informado não existe." });
    }
    const dadosTransacao = { descricao, valor, data, categoria_id, id, tipo };

    const transacao = await cadastrarTransacaoRepos(dadosTransacao);
    if (!transacao) {
      return res.status(400).json({ mensagem: "Transação não realizada." });
    }
    return res.status(200).json({ transacao });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro no servidor." });
  }
};

const atualizarTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id } = req.usuario;
  const { idTransacao } = req.params;

  if (!descricao || !valor || !data || !categoria_id || !tipo) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
  }
  if (tipo !== "saida" && tipo !== "entrada") {
    return res.status(400).json({ mensagem: "Campo tipo com valor inválido" });
  }

  try {
    const validaIdTransacao = await idTransacaoValido(idTransacao);
    if (validaIdTransacao.rowCount === 0) {
      return res.status(400).json({ mensagem: "Id de transação inválido" });
    }
    const validaCategoria = await categoriaValida(categoria_id);
    if (validaCategoria.rowCount === 0) {
      return res.status(400).json({ mensagem: "A categoria informada não existe." });
    }
    const dadosDaTransacao = { descricao, valor, data, categoria_id, id, tipo, idTransacao };
    const transacaoAtualizado = await atualizarTransacaoRepos(dadosDaTransacao);
    if (!transacaoAtualizado) {
      return res.status(400).json({ mensagem: "Transação não atualizado." });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

const deletarTransacao = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: "Campo id de transação é obrigatório" });
  }

  try {
    const validaIdTransacao = await idTransacaoValido(id);
    if (validaIdTransacao.rowCount === 0) {
      return res.status(400).json({ mensagem: "Id de transação inválido" });
    }
    await deletaTransacaoRepos(id);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

const extratoTransacao = async (req, res) => {
  const { id } = req.usuario;

  try {
    const { rows } = await selecionaTransacaoRepos(id);
    const { somaEntrada: entrada, somaSaida: saida } = somaTransacao(rows);
    return res.status(200).json({ entrada, saida });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }

};

module.exports = {
  
  listarTransacoes,
  listarTransacao,
  cadastrarTransacao,
  atualizarTransacao,
  deletarTransacao,
  extratoTransacao,
};

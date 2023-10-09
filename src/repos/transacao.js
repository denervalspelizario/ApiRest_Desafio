const conexaoComOBanco = require("../configuracoes/conexao");

const listaTransacao = (id) => {
  const dadosTransacao = conexaoComOBanco.query(
    `SELECT T.id, T.tipo, T.descricao, T.valor, T.data_cadastro as data, 
    T.usuario_id, T.categoria_id, C.descricao as categoria_nome
    FROM TRANSACOES T
    JOIN CATEGORIAS C ON T.categoria_id = C.id
    WHERE T.usuario_id = $1;`,
    [id]
  );
  return dadosTransacao;
};

const detalharTransacao = (id) => {
  const dadosTransacao = conexaoComOBanco.query(
    `SELECT T.id, T.tipo, T.descricao, T.valor, T.data_cadastro as data, 
    T.usuario_id, T.categoria_id, C.descricao as categoria_nome
    FROM TRANSACOES T
    JOIN CATEGORIAS C ON T.categoria_id = C.id
    WHERE T.id = $1;`,
    [id]
  );
  return dadosTransacao;
};

const cadastrarTransacaoRepos = async ({ descricao, valor, data, categoria_id, id, tipo }) => {
  const cadastro = await conexaoComOBanco.query(
    `INSERT INTO transacoes (descricao, valor, data_cadastro, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [descricao, valor, data, categoria_id, id, tipo]
  );
  return cadastro.rows[0];
};

const idTransacaoValido = (id) => {
  const idEncontrado = conexaoComOBanco.query(
    `
      SELECT * FROM 
          transacoes
      WHERE
          id = $1;
  `,
    [id]
  );
  return idEncontrado;
};

const atualizarTransacaoRepos = async ({ descricao, valor, data, categoria_id, id, tipo, idTransacao }) => {
  const { rows } = await conexaoComOBanco.query(
    `UPDATE transacoes SET  descricao = $1, valor = $2, data_cadastro = $3, categoria_id = $4, usuario_id = $5, tipo = $6 WHERE id = $7 RETURNING *`,
    [descricao, valor, data, categoria_id, id, tipo, idTransacao]
  );
  return rows[0];
};

const deletaTransacaoRepos = async (id) => {
  const dadosDeletados = await conexaoComOBanco.query(`delete from transacoes where id = $1`, [id]);
  return dadosDeletados;
};

const selecionaTransacaoRepos = async (id) => {
  const dadosExtrato = await conexaoComOBanco.query(
    `SELECT tipo, valor FROM transacoes WHERE usuario_id = $1
  `,
    [id]
  );
  return dadosExtrato;
};

const somaTransacao = (array) => {
  let somaEntrada = 0;
  let somaSaida = 0;

  array.forEach((item) => {
    if (item.tipo === "entrada") {
      somaEntrada += item.valor;
    }

    if (item.tipo === "saida") {
      somaSaida += item.valor;
    }
  });

  return { somaEntrada, somaSaida };
};

module.exports = {
  listaTransacao,
  cadastrarTransacaoRepos,
  detalharTransacao,
  idTransacaoValido,
  atualizarTransacaoRepos,
  deletaTransacaoRepos,
  selecionaTransacaoRepos,
  somaTransacao,
};
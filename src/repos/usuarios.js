const conexaoComOBanco = require("../configuracoes/conexao");

const cadastroUsuario = (dadosDoUsuario) => {
  const { nome, email, senhaCriptografada } = dadosDoUsuario;
  const usuarioCadastrado = conexaoComOBanco.query(
    `
        INSERT INTO
	        usuarios (nome, email, senha)
        VALUES
	        ($1, $2, $3)
        RETURNING *
    `,
    [nome, email, senhaCriptografada]
  );
  return usuarioCadastrado;
};

const emailValido = (email) => {
  const emailEncontrado = conexaoComOBanco.query(
    `
      SELECT
          id, nome, email, senha
      FROM 
          usuarios
      WHERE
          email = $1;
  `,
    [email]
  );
  return emailEncontrado;
};

const idValido = (id) => {
  const idEncontrado = conexaoComOBanco.query(
    `
      SELECT * FROM 
          usuarios
      WHERE
          id = $1;
  `,
    [id]
  );
  return idEncontrado;
};

const atualizarUsuarioRepos = async ({ nome, email, senhaCriptografada, id }) => {
  const { rows } = await conexaoComOBanco.query(`UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *`, [
    nome,
    email,
    senhaCriptografada,
    Number(id),
  ]);
  return rows[0];
};

module.exports = {
  cadastroUsuario,
  emailValido,
  idValido,
  atualizarUsuarioRepos,
};

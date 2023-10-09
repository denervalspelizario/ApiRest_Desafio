const conexaoComOBanco = require("../configuracoes/conexao");

const listaCategoria = () => {
  const dadosCategoria = conexaoComOBanco.query(`SELECT * FROM CATEGORIAS`);
  return dadosCategoria;
};

const categoriaValida = (categoria_id) => {
  const categoriaEncontrada = conexaoComOBanco.query(
    `
      SELECT * FROM 
          categorias
      WHERE
          id = $1;
  `,
    [categoria_id]
  );
  return categoriaEncontrada;
};

module.exports = {
  listaCategoria,
  categoriaValida,
};

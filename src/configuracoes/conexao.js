const { Pool } = require("pg");
const { userBd, hostBd, databaseBd, passwordBd, portBd } = require("../dadosSensiveis");

const conexaoComOBanco = new Pool({
  user: userBd,
  host: hostBd,
  database: databaseBd,
  password: passwordBd,
  port: portBd,
});

module.exports = conexaoComOBanco;

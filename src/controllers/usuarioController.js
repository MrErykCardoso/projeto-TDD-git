import { pool } from "../database/database.js";
import bcrypt from "bcrypt";

export default {
  /**
   *
   * @param {import ("express").Request} req
   * @param {import ("express").Response} res
   */

  create: async function (req, res) {
    try {
      const body = req.body;

      if (!body || !body.name || !body.email || !body.senha || !body.dataNas) {
        return res.status(400).json({
          menssage:
            "400 - Bad Request: \ncampos obrigatórios estão incorretos.\n",
        });
      }

      const hashPassword = await bcrypt.hash(body.senha, 10);

      const dbRes = await pool.query(
        `INSERT INTO usuario ("name_usu","email_usu","senha_usu","data_nasc") VALUES ($1,$2,$3,$4) RETURNING *`,
        [body.name, body.email, hashPassword, body.dataNas]
      );
      const result = dbRes.rows[0];

      if (result) {
        return res
          .status(200)
          .json({ menssage: `200 - Sucess! - Body: \n${result}\n` });
      } else {
        return res.status(500).json({
          menssagem: `500 - Internal server error - Body: \n${result}\n`,
        });
      }
    } catch (error) {
      return res.status(500).json(`catch Error:\n\n${error}\n\n`);
    }
  },

  /**
   *
   * @param {import ("express").Request} req
   * @param {import ("express").Response} res
   */

  login: async function (req, res) {
    try {
      const body = req.body;

      if (!body || !body.email || !body.senha) {
        return res.status(400).json({
          menssage:
            "400 - Bad request: \nCampos de usuário ou senha estão incompletos\n",
        });
      }

      const dbRes = await pool.query(
        'SELECT * FROM  "usuario" WHERE email_usu = $1;',
        [body.email]
      );

      if (dbRes.rows.length == 0) {
        return res
          .status(404)
          .json({ menssage: "404 - Not Found: Usuário não encontrado!" });
      }

      const password = dbRes.rows[0].senha_usu;
      const passTest = await bcrypt.compare(body.senha, password);

      if (!passTest) {
        return res
          .status(401)
          .json({ menssage: "401 - Unauthorized: Senha incorreta!" });
      }

      return res
        .status(200)
        .json({ menssage: "200 - Sucess: Usuário logado com sucesso!" });
    } catch (error) {
      return res.status(500).json(`catch Error:\n\n${error}\n\n`);
    }
  },

  /**
   *
   * @param {import ("express").Request} req
   * @param {import ("express").Response} res
   */

  updatePassword: async function (req, res) {
    try {
      const body = req.body;

      if (!body || !body.novaSenha) {
        return res.status(400).json({
          menssage: "400 - Bad Request: Campos obrigatórios não preenchidos.",
        });
      }

      const hashPassword = await bcrypt.hash(body.novaSenha, 10);

      await pool.query(
        'UPDATE "usuario" SET senha_usu = $1 WHERE email_usu = $2;',
        [hashPassword, body.email]
      );

      return res
        .status(200)
        .json({ menssage: "200 - Sucess: Senha atualizada!" });
    } catch (error) {
      return res.status(500).json(`catch Error:\n\n${error}\n\n`);
    }
  },
  /**
   *
   * @param {import ("express").Request} req
   * @param {import ("express").Response} res
   */

  showProfile: async function (req, res) {
    try {
      const body = req.body;

      const dbRes = await pool.query(
        "SELECT * FROM usuario WHERE name_usu = $1;",
        [body.name]
      );
      if (dbRes.rows.length == 0) {
        return res
          .status(400)
          .json({ menssage: "400 - Bad request: nome não encontrado." });
      } else {
        console.log(JSON.stringify(dbRes.rows[0]));
        return res.status(200).json(JSON.stringify(dbRes.rows[0]));
      }
    } catch (error) {
      if (error instanceof AggregateError) {
        error.errors.forEach((err) => {
          console.error("Error: \n", err);
        });
      } else {
        console.error("Erro: \n", error);
      }
      return res.status(500).json(`Catch Error: \n${error}\n`);
    }
  },
};

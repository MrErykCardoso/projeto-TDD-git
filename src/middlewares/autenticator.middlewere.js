import bcrypt from "bcrypt";
import { pool } from "../database/database.js";

export default {
  /**
   *
   * @param {import ("express").Request} req
   * @param {import ("express").Response} res
   * @param {import ("express").NextFunction} next
   */

  auth: async function (req, res, next) {
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

      return next();
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

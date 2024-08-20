import supertest from "supertest";
import app from "../src/index.js";
import { pool } from "../src/database/database.js";

describe("POST usuario/novaConta : create", () => {
  const body = {
    name: "test",
    email: "t@t.com",
    senha: "test",
    dataNas: "2000-05-19",
    novaSenha: "123",
  };

  afterAll(async () => {
    await pool.query('DELETE FROM "usuario" WHERE name_usu = $1', [body.name]);
  });

  it("Error 400 create: deve dar erro se o body estiver incompleto", async () => {
    const bodyError400 = {
      name: "",
      email: "",
      senha: "",
      dataNas: "",
    };

    await supertest(app)
      .post("/usuario/novaConta")
      .send(bodyError400)
      .expect((res) => {
        const { status, body } = res;
        if (status != 400) {
          throw new Error(
            `Status deveria ser 400, mas retorna ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Pass 200 create: O usuario deve ser criado", async () => {
    await supertest(app)
      .post("/usuario/novaConta")
      .send(body)
      .expect((res) => {
        const { status, body } = res;
        if (status != 200) {
          throw new Error(
            `Status deveria ser 200, mas retorna ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Error 400 login: login deve falhar se o body estiver incompleto", async () => {
    const bodyError400 = {
      email: "",
      senha: "",
    };

    await supertest(app)
      .post("/usuario/login")
      .send(bodyError400)
      .expect((res) => {
        const { status, body } = res;
        if (status != 400) {
          throw new Error(
            `Status deveria ser 400, mas recebe ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Error 404 login: o login deve falhar se o usuário não for encontrado nod BD.", async () => {
    const bodyError404 = {
      email: "FP0mmiMDDq5YxavcDO6a@FP0mmiMDDq5YxavcDO6a.com",
      senha: "FP0mmiMDDq5YxavcDO6aFP0mmiMDDq5YxavcDO6awrongPassword",
    };

    await supertest(app)
      .post("/usuario/login")
      .send(bodyError404)
      .expect((res) => {
        const { status, body } = res;

        if (status != 404) {
          throw new Error(
            `Status deveria ser 404, mas recebe ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Error 401 login: o login deve falhar se a senha for incorreta", async () => {
    const bodyError401 = {
      email: body.email,
      senha: "FP0mmiMDDq5YxavcDO6a",
    };

    await supertest(app)
      .post("/usuario/login")
      .send(bodyError401)
      .expect((res) => {
        const { status, body } = res;

        if (status != 401) {
          throw new Error(
            `Status deveria ser 401, mas retorna ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Pass 200 login: O usuario deve conseguir fazer login a partir de um email e senha já cadastrados", async () => {
    await supertest(app)
      .post("/usuario/login")
      .send(body)
      .expect((res) => {
        const { status, body } = res;
        if (status != 200) {
          throw new Error(
            `Status deveria ser 200, mas retorna ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Error 400 auth_login: login da autenticação deve falhar se o body estiver incompleto", async () => {
    const bodyError400 = {
      email: "",
      senha: "",
    };

    await supertest(app)
      .patch("/usuario/novaSenha")
      .send(bodyError400)
      .expect((res) => {
        const { status, body } = res;
        if (status != 400) {
          throw new Error(
            `Status deveria ser 400, mas recebe ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Error 404 auth_login: o login da autenticação deve falhar se o usuário não for encontrado nod BD.", async () => {
    const bodyError404 = {
      email: "FP0mmiMDDq5YxavcDO6a@FP0mmiMDDq5YxavcDO6a.com",
      senha: "FP0mmiMDDq5YxavcDO6aFP0mmiMDDq5YxavcDO6awrongPassword",
    };

    await supertest(app)
      .patch("/usuario/novaSenha")
      .send(bodyError404)
      .expect((res) => {
        const { status, body } = res;

        if (status != 404) {
          throw new Error(
            `Status deveria ser 404, mas recebe ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Error 401 auth_login: o login da autenticação deve falhar se a senha for incorreta", async () => {
    const bodyError401 = {
      email: body.email,
      senha: "FP0mmiMDDq5YxavcDO6a",
    };

    await supertest(app)
      .patch("/usuario/novaSenha")
      .send(bodyError401)
      .expect((res) => {
        const { status, body } = res;

        if (status != 401) {
          throw new Error(
            `Status deveria ser 401, mas retorna ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Error 400 updatePassword: a atualização de senha deve falhar se a nova senha não for inserida", async () => {
    const bodyError400 = {
      email: "t@t.com",
      senha: "test",
      novaSenha: "",
    };

    await supertest(app)
      .patch("/usuario/novaSenha")
      .send(bodyError400)
      .expect((res) => {
        const { status, body } = res;
        if (status != 400) {
          throw new Error(
            `Status deveria ser 400, mas recebe ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Pass 200 updatePassword: o usuario deve ser autenticado e atualizar a senha", async () => {
    await supertest(app)
      .patch("/usuario/novaSenha")
      .send(body)
      .expect((res) => {
        const { status, body } = res;

        if (status != 200) {
          throw new Error(
            `Status deveria ser 200, mas recebe ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });

  it("Pass 200 showProfile: os dados do usuario devem ser informados com sucesso", async () => {
    const bodyGet = {
      name: body.name,
    };

    await supertest(app)
      .post("/usuario/mostrarPerfil")
      .send(bodyGet)
      .expect((res) => {
        const { status, body } = res;

        if (status != 200) {
          throw new Error(
            `Status deveria ser 200, mas recebe ${status}. Body: \n${JSON.stringify(
              body
            )}\n`
          );
        }
      });
  });
});

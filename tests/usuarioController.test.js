import supertest from "supertest";
import app from "../src/index.js";

describe("POST usuario/novaConta : create", () => {
  it("Pass 200: O usuario deve ser criado", async () => {
    const body = {
      name: "marcelo",
      email: "m@m.com",
      senha: "123",
      dataNas: "2000-05-19",
    };

    await supertest(app)
      .post("/usuario/novaConta")
      .send(body)
      .expect((res) => {
        const { status, body } = res;
        if (status == 200) {
          throw new Error(
            `Status deveria ser 200, mas retorna ${status}. Body: ${JSON.stringify(
              body
            )}`
          );
        }
      });
  });
});

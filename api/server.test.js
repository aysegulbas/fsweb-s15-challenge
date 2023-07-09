// testleri buraya yazın
const request = require("supertest");
const server = require("../api/server");
const db = require("../data/dbConfig");
beforeAll(async () => {
  await db.migrate.rollback(); //temizlesin
  await db.migrate.latest(); //son halini getir
});
test("[0] sanity check", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});
describe("AUTH", () => {
  test("[1] register", async () => {
    const payload = { username: "ayse", password: "1234" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("id", 1);
  });
  test("[2] register failure", async () => {
    const payload = { username: "ayse", password: "12345" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("message", "User zaten var");
  });
  test("[3] login", async () => {
    //loginde en önemli test token
    const payload = { username: "ayse", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("message", "ayse geri geldi");
  });
  test("[4] login failure", async () => {
    //loginde en önemli test token
    const payload = { username: "mahmut", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).toHaveProperty("message", "user tanımlı değil");
  });
});
describe("BİLMECELER", () => {
  //restrict yazdığı için token zorunlu
  test("[5] get bilmeceler", async () => {
    const res = await request(server).get("/api/bilmeceler");
    expect(res.body).toHaveProperty("message", "token gereklidir");
  });
  test("[6] get bilmeceler", async () => {
    const payload = { username: "ayse", password: "1234" };
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(payload);
    const res = await request(server)
      .get("/api/bilmeceler")
      .set("Authorization", loginRes.body.token);
    expect(res.body).toHaveLength(3);
  });
  test("[7] post bilmeceler", async () => {
    const payload = { username: "ayse", password: "1234" };
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(payload);
      const bilmecePayload={bilmece:"test"}
    const res = await request(server)
      .post("/api/bilmeceler")
      .set("Authorization", loginRes.body.token).send(bilmecePayload);
    expect(res.body).toHaveProperty("bilmece","test");
  });
});

import request from "supertest";
import app from "../../src/app";

describe("MiniService", () => {
  test("endPointsList", (done) => {
    request(app).post("/").expect("Content-Type", /json/).expect(200, done);
  });

  describe("getOrders", () => {
    test("unauthorized", (done) => {
      request(app)
        .post("/order/list")
        .expect("Content-Type", /json/)
        .expect(401, done);
    });
  });
});

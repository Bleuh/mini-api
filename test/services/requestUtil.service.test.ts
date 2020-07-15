import RequestUtil from "../../src/services/requestUtil.service";

describe("Test RequestUtil", () => {
  describe("checkFields", () => {
    test("default", () => {
      const { ok, extra, miss } = RequestUtil.checkFields(["field"], ["field"]);
      expect(ok).toStrictEqual(true);
      expect(extra).toStrictEqual([]);
      expect(miss).toStrictEqual([]);
    });
    test("extra field", () => {
      const { ok, extra, miss } = RequestUtil.checkFields(
        ["field"],
        ["field", "extra"]
      );
      expect(ok).toStrictEqual(false);
      expect(extra).toStrictEqual(["extra"]);
      expect(miss).toStrictEqual([]);
    });
    test("missing field", () => {
      const { ok, extra, miss } = RequestUtil.checkFields(
        ["field", "miss"],
        ["field"]
      );
      expect(ok).toStrictEqual(false);
      expect(extra).toStrictEqual([]);
      expect(miss).toStrictEqual(["miss"]);
    });
  });
  describe("apiSuccessResponse", () => {
    test("with data", () => {
      const response = RequestUtil.apiSuccessResponse("message", {
        data: "data",
      });
      expect(response).toStrictEqual({
        message: "message",
        error: null,
        data: {
          data: "data",
        },
      });
    });
    test("without data", () => {
      const response = RequestUtil.apiSuccessResponse("message");
      expect(response).toStrictEqual({
        message: "message",
        error: null,
      });
    });
  });
  describe("apiErrorResponse", () => {
    test("default", () => {
      const response = RequestUtil.apiErrorResponse("message");
      expect(response).toStrictEqual({
        message: "message",
        error: "An error has occurred",
      });
    });
    test("with a specific error", () => {
      const response = RequestUtil.apiErrorResponse("message", "Error 1234");
      expect(response).toStrictEqual({
        message: "message",
        error: "Error 1234",
      });
    });
  });
  describe("apiFieldsErrorReponse", () => {
    test("default", () => {
      const response = RequestUtil.apiFieldsErrorReponse(['miss'], ['extra']);
      expect(response).toStrictEqual({
        message: "Missing parameters",
        error: "An error has occurred",
        miss: ['miss'],
        extra: ['extra']
      });
    });
  });
});

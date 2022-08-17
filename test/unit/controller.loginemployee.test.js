let controller = require("../../controller/employee.controller");
const model = require("../../model/employee.model");
const bcrypt = require("bcrypt");
const httpMock = require("node-mocks-http");
const jwt = require("jsonwebtoken");
const mockEmployee = require("../mockdata/employeeReqPayload.json");

model.create = jest.fn();
model.findOne = jest.fn();
bcrypt.compare = jest.fn();
jwt.sign = jest.fn();
let req, res, next;

beforeEach(() => {
  model.create.mockClear();
  model.findOne.mockClear();
  bcrypt.compare.mockClear();
  jwt.sign.mockClear();
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = null;
  // if you set req.body =mockEmployee,  it fails as reference value is getting changed
  req.body = { ...mockEmployee };
});
describe("controller.loginEmployee", () => {
  test("loginEmployee function is defined", () => {
    expect(typeof controller.loginEmployee).toBe("function");
  });

  test("login from a valid employee", async () => {
    model.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockReturnValue("fakejwttoken");
    await controller.loginEmployee(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(mockEmployee);
    expect(res._getHeaders()["auth-token"]).toStrictEqual("fakejwttoken");
  });

  //added extra test for stryker mutation
  test("login from a valid employee but wrong password", async () => {
    model.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockReturnValue(false);
    await controller.loginEmployee(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getData()).toStrictEqual(
      "you provided an invalid password , please try again"
    );
  });

  test("login from a valid employee but jwt sign fails", async () => {
    model.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockRejectedValue("fake jwt sign exception");
    await controller.loginEmployee(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual("fake jwt sign exception");
    expect(res._getHeaders()["auth-token"]).toBeUndefined;
  });

  test("login from a employee when password validation fails bcrpyt exception", async () => {
    model.findOne.mockReturnValue(mockEmployee);
    bcrypt.compare.mockRejectedValue("fake password validation exception");
    await controller.loginEmployee(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual(
      "fake password validation exception"
    );
    expect(res._getHeaders()["auth-token"]).toBeUndefined;
  });

  test("login from a employee when not registered already with provided email", async () => {
    model.findOne.mockReturnValue(null);
    await controller.loginEmployee(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual(
      "Email you provided doesnt exist in our database"
    );
  });
});

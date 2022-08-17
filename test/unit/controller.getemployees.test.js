const controller = require('../../controller/employee.controller');
const model = require('../../model/employee.model');
const httpMock = require('node-mocks-http');

const mockEmployeeList = require('../mockdata/employees.json')

model.find = jest.fn();
let req , res, next;

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
});

afterEach(()=>{
    model.find.mockClear();
});

describe("controller.getAllEmployees",()=>{
    test("getAllEmployees function is defined", ()=> {
        expect(typeof controller.getAllEmployees).toBe('function')
    });

    test("return all employees", async() => {
        model.find.mockReturnValue(mockEmployeeList);
        await controller.getAllEmployees(req, res, next);
        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toStrictEqual(mockEmployeeList);
    });

    test("return 404 when db is empty", async() => {
        model.find.mockReturnValue(null);
        await controller.getAllEmployees(req, res, next);
        expect(res.statusCode).toEqual(404);
        expect(res._isEndCalled()).toBeTruthy()
    });

    test("return 500 when find throw an exception ", async() => {
        model.find.mockRejectedValue("error");
        await controller.getAllEmployees(req, res, next);
        expect(res.statusCode).toEqual(500);
        expect(res._getJSONData()).toStrictEqual("error")
    });


});
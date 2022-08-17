const controller = require('../../controller/employee.controller');
const model = require('../../model/employee.model');
const httpMock = require('node-mocks-http');
const mockEmployeeList = require('../mockdata/employees.json');
model.findById = jest.fn();
let req, res, next;

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
})

afterEach(()=>{
    model.findById.mockClear();
});

describe("controller.getEmployeeById", ()=>{
    test("getEmployeeById function is defined", ()=>{
        expect(typeof controller.getEmployeeById).toBe('function')
    });

    test("return an employee by id", async ()=>{
        req.params.employee_id = mockEmployeeList[0]._id;
        model.findById.mockReturnValue(mockEmployeeList[0]);
        await controller.getEmployeeById(req,res,next);
        expect(model.findById).toHaveBeenCalledWith(req.params.employee_id);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockEmployeeList[0]);
    })
    test("return 404 when id not found", async()=>{
        req.params.employee_id = mockEmployeeList[0]._id;
        model.findById.mockReturnValue(null);
        await controller.getEmployeeById(req,res,next);
        expect(model.findById).toHaveBeenCalledWith(req.params.employee_id);
        expect(res.statusCode).toBe(404)
    })
    test("return 500 when model.findbyid throws exception", async()=>{
        req.params.employee_id = mockEmployeeList[0]._id;
        model.findById.mockRejectedValue("fake exception from findbyid");
        await controller.getEmployeeById(req,res,next);
        expect(model.findById).toHaveBeenCalledWith(req.params.employee_id);
        expect(res.statusCode).toBe(500);
        expect(res._getData()).toStrictEqual("fake exception from findbyid");
    })

})

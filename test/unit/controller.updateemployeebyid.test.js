const controller = require('../../controller/employee.controller');
const model = require('../../model/employee.model');
const httpMock = require('node-mocks-http');

const mockEmployee= require('../mockdata/employees.json')

model.findByIdAndUpdate = jest.fn();
let req , res, next;

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
})
describe("controller.findByIdAndUpdate",()=>{
    test("findByIdAndUpdate function is defined", ()=> {
        expect(typeof controller.updateEmployeeById).toBe('function')
    }); 

    test("update an exisitng employee with phone number", async ()=>{
        let toUpdate = {...mockEmployee[0], phone:"0878667"};
        req.params.employee_id = mockEmployee[0]._id;
        req.body = {...toUpdate};
        model.findByIdAndUpdate.mockReturnValue(toUpdate);
        await controller.updateEmployeeById(req, res, next);
        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
            req.params.employee_id,
            req.body,
            { 
                useFindAndModify:false
            }
        );
        expect(res.statusCode).toEqual(201);
        expect(res._getJSONData()).toStrictEqual(toUpdate);
    });
    test("return 400 when id not found", async ()=>{
        model.findByIdAndUpdate.mockReturnValue(null);
        await controller.updateEmployeeById(req, res, next);
        expect(res.statusCode).toEqual(400);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toBeNull;

    });
    test("return 500 when findByIdAndUpdate raise exception", async ()=>{
        model.findByIdAndUpdate.mockRejectedValue("fake error");
        await controller.updateEmployeeById(req, res, next);
        expect(res.statusCode).toEqual(500);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual("fake error");

    })
});
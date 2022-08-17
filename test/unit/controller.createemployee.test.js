let controller = require('../../controller/employee.controller');
const model = require('../../model/employee.model');
const bcrypt = require('bcrypt');
const httpMock = require('node-mocks-http');
const mockEmployee = require('../mockdata/employeeReqPayload.json')

model.create = jest.fn();
model.findOne = jest.fn();
bcrypt.hash = jest.fn();
bcrypt.genSalt = jest.fn()
let req , res, next;

beforeEach(()=>{
    model.create.mockClear();
    model.findOne.mockClear();
    bcrypt.hash.mockClear();
    bcrypt.genSalt.mockClear();
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
    // if you set req.body =  . it fails as reference value is getting changed
    req.body = {...mockEmployee}
})
describe("controller.createEmployee",()=>{
    test("createEmployee function is defined", ()=> {
        expect(typeof controller.createEmployee).toBe('function')
    });

    test("create a valid employee" , async()=>{
        model.create.mockReturnValue(mockEmployee);
        model.findOne.mockReturnValue(false);
        bcrypt.hash.mockReturnValue("fakehashstring");
        bcrypt.genSalt.mockReturnValue(10);
        await controller.createEmployee(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual(mockEmployee);
        expect(model.create).toBeCalledWith({...mockEmployee,password: "fakehashstring"});
        
    });

    test("create employee which already exists", async ()=>{
        model.create.mockReturnValue(mockEmployee);
        model.findOne.mockReturnValue(true);
        await controller.createEmployee(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual('Email you provided already exist in our database');

    })

    test("create a valid employee , but password hashing failed", async()=>{
        model.create.mockReturnValue(mockEmployee);
        model.findOne.mockReturnValue(false);
        bcrypt.genSalt.mockReturnValue("DUMMY");
        bcrypt.hash.mockRejectedValue("hashing failed");
        await controller.createEmployee(req, res, next);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("hashing failed");
    })

});
const request = require("supertest");
const app = require("../../app");
const mongodb = require("../../mongodb/mongodb.utils");
const mockEmployeeRequest = require("../mockdata/employeeReqPayload.json");
const contactUrl = "/api/contacts";

describe("Positive scenarios ->validate " + contactUrl, () => {
  beforeAll(async () => {
    await mongodb.connect();
    await mongodb.dropCollection("myemployee_" + process.env.NODE_ENV);
  });

  afterAll(async () => {
    await mongodb.disconnect();
  });

  test("POST " + contactUrl, async () => {
    const response = await request(app)
      .post(contactUrl)
      .send(mockEmployeeRequest);
    console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("name", mockEmployeeRequest.name);
    expect(response.body).toHaveProperty("email", mockEmployeeRequest.email);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("created_date");
    expect(Object.keys(response.body).length).toEqual(6);
  });

  test("GET " + contactUrl + " Get all employees", (done) => {
    request(app)
      .get(contactUrl)
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body.length).toBeGreaterThan(0);
        // jest wont exit if done() is not called
        done();
      });
  });

  test("GET " + contactUrl + " Get Employee by ID", async () => {
    const responseOfCreate = await request(app).post(contactUrl).send({
      name: "Sera",
      email: "Sera@gmail.com",
      password: "ttt123567$",
    });
    expect(responseOfCreate.statusCode).toBe(201);
    console.log(responseOfCreate.body._id);
    const responseOfGet = await request(app).get(
      contactUrl + "/" + responseOfCreate.body._id
    );
    console.log(responseOfGet.body);
    expect(responseOfGet.statusCode).toBe(200);
    expect(responseOfGet.body._id).toStrictEqual(responseOfCreate.body._id);
  });

  test("DELETE " + contactUrl + " Employee by ID", async () => {
    const responseOfCreate = await request(app).post(contactUrl).send({
      name: "Sera1",
      email: "Sera1@gmail.com",
      password: "ttt123567$",
    });
    expect(responseOfCreate.statusCode).toBe(201);
    const responseOfDelete = await request(app)
      .delete(contactUrl + "/" + responseOfCreate.body._id)
      .send({ employee_id: responseOfCreate.body._id });
    expect(responseOfDelete.statusCode).toBe(200);
    console.log(responseOfDelete.body);
    const responseOfGet = await request(app).get(
      contactUrl + "/" + responseOfCreate.body._id
    );
    expect(responseOfGet.statusCode).toBe(404);

    //again a delete call should fail
    let responseOfDelete1 = await request(app)
      .delete(contactUrl + "/" + responseOfCreate.body._id)
      .send({ employee_id: responseOfCreate.body._id });
    expect(responseOfDelete1.statusCode).toBe(404);
    console.log(responseOfDelete1.body);
  });

  test("PUT " + contactUrl + " Update Employee by ID", async () => {
    const responseOfCreate = await request(app)
      .post(contactUrl)
      // .set({ "auth-token": "testToken" })
      .send({
        name: "Sera2",
        email: "Sera2@gmail.com",
        password: "ttt123567$",
        gender: "male",
      });
    expect(responseOfCreate.statusCode).toBe(201);
    expect(responseOfCreate.body).toHaveProperty("gender", "male");
    console.log("does token exist:", responseOfCreate.headers);
    // console.log('response:', responseOfCreate);
    request.agent()
    const responseOfUpdate = await request(app)
      .put(contactUrl + "/" + responseOfCreate.body._id)
      .send({ gender: "female" });
    expect(responseOfUpdate.statusCode).toBe(201);
    const responseOfGet = await request(app).get(
      contactUrl + "/" + responseOfCreate.body._id
    );
    console.log(responseOfGet.statusCode, responseOfGet.body);
    expect(responseOfGet.statusCode).toBe(200);
    expect(responseOfGet.body).toHaveProperty("name", "Sera2");
    expect(responseOfGet.body).toHaveProperty("email", "Sera2@gmail.com");
    expect(responseOfGet.body).toHaveProperty("_id", responseOfCreate.body._id);
    expect(responseOfGet.body).toHaveProperty("gender", "female");
    expect(responseOfGet.body).toHaveProperty("created_date");
    expect(Object.keys(responseOfGet.body).length).toEqual(7);
  });

  test("POST " + contactUrl + "/login " + "Employee Login ", async () => {
    const responseOfCreate = await request(app).post(contactUrl).send({
      name: "Sera3",
      email: "Sera3@gmail.com",
      password: "ttt123567$",
      gender: "male",
    });
    expect(responseOfCreate.statusCode).toBe(201);

    const responseOfLogin = await request(app)
      .post(contactUrl + "/login")
      .send({
        name: "Sera3",
        email: "Sera3@gmail.com",
        password: "ttt123567$",
        gender: "male",
      });
    expect(responseOfLogin.statusCode).toBe(201);
    console.log(responseOfLogin.statusCode, responseOfLogin.body);
    expect(responseOfLogin.header["auth-token"]).toBeTruthy;
  });
});

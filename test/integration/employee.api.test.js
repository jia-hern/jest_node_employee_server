const request = require("supertest");
const app = require("../../app");
const mongodb = require("../../mongodb/mongodb.utils");
const endpointUrl = "/api";

describe("Validate " + endpointUrl, () => {
  test("Get / ", async () => {
    const response = await request(app).get("/");
    expect(response.body).toEqual("hello from employee app");
    expect(response.statusCode).toBe(200);
  });

  test("Get " + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);
    console.log(response.body);
    expect(response.body).toStrictEqual({
      status: "API is working",
      message:
        "Hi, Welcome to the employe api router , here we define all functions",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "API is working");
    expect(response.body).toMatchObject({
      status: "API is working",
      message:
        "Hi, Welcome to the employe api router , here we define all functions",
    });
    expect(JSON.stringify(response.body)).toEqual(
      JSON.stringify({
        status: "API is working",
        message:
          "Hi, Welcome to the employe api router , here we define all functions",
      })
    );
  });
});

const controller = require("../controller/employee.controller");
let router = require("express").Router();
const { verifytoken } = require("../routes/jwt-token-verify");

router.get("/", (req, res) => {
  res.json({
    status: "API is working",
    message:
      "Hi, Welcome to the employe api router , here we define all functions",
  });
});

router.post("/contacts", controller.createEmployee);
//in the videos i have wrongly put two time getAllEmployees
//router.get('/contacts', controller.getAllEmployees);
router.get("/contacts", controller.getAllEmployees);
router.get("/contacts/:employee_id", controller.getEmployeeById);
router.put(
  "/contacts/:employee_id",
  // umcomment to protect this route
  // verifytoken,
  controller.updateEmployeeById
);
router.delete("/contacts/:employee_id", controller.deleteEmployeeById);
router.post("/contacts/login", controller.loginEmployee);

module.exports = router;

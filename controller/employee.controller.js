const employeeModel = require("../model/employee.model");
const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const schema = joi.object({
  name: joi.string().required(),
  email: joi.string().required().email(),
  password: joi.string().min(6).max(12).required(),
  gender: joi.string(),
  phone: joi.string(),
});

exports.createEmployee = async (req, res, next) => {
  try {
    // console.log("create employee called");
    const joiCheck = await schema.validate(req.body);
    // console.log("validation result", joiCheck);
    if (joiCheck.error) return res.status(400).json(joiCheck.error);
    const doEmailExist = await employeeModel.findOne({ email: req.body.email });
    // console.log("doEmailExist :", doEmailExist)
    if (doEmailExist) {
      return res
        .status(400)
        .json("Email you provided already exist in our database");
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(encryptedPassword);
    req.body.password = encryptedPassword;
    const newEmployee = await employeeModel.create(req.body);
    console.log(newEmployee);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    const allEmployees = await employeeModel.find({});
    if (allEmployees && allEmployees.length > 0) {
      res.status(200).json(allEmployees);
    } else {
      res.status(404).json();
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeModel.findById(req.params.employee_id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

//using callback
// exports.getEmployeeById = function (req, res, next) {
//     try {

//         employeeModel.findById(req.params.employee_id, function (err, employee) {
//             console.log('inside callback')
//             if (err)
//                 return res.send(err);
//             res.status(200).json(employee);
//         });
//     }
//     catch {
//         res.status(500).send(err);
//     }
// };

exports.updateEmployeeById = async (req, res, next) => {
  try {
    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      req.params.employee_id,
      req.body,
      {
        useFindAndModify: false,
      }
    );
    if (updatedEmployee) {
      res.status(201).json(updatedEmployee);
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.deleteEmployeeById = async (req, res, next) => {
  try {
    const deleted = await employeeModel.findByIdAndDelete(
      req.params.employee_id
    );
    if (deleted) {
      res.status(200).json(deleted);
    } else {
      //   console.log("User Not Found");
      res.status(404).json("User Not Found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// exports.deleteEmployeeById = async (req, res , next) =>{
//     employeeModel.findByIdAndDelete(req.params.employee_id)
//     .then(result => {
//         if (result) {
//             res.status(200).json(result);
//         }
//         else{
//             console.log('User Not Found');
//             res.status(404).json('User Not Found');
//         }
//     })
//     .catch(err=>{
//         res.status(500).send(err);
//     })
// }

exports.loginEmployee = async (req, res, next) => {
  try {
    const joiCheck = await schema.validate(req.body);
    // console.log("validation result", joiCheck.error);
    if (joiCheck.error) return res.status(400).json(joiCheck.error);
    const employee = await employeeModel.findOne({ email: req.body.email });
    console.log(employee);
    if (!employee) {
      return res
        .status(400)
        .json("Email you provided doesnt exist in our database");
    }
    const validatePassword = await bcrypt.compare(
      req.body.password,
      employee.password
    );
    // console.log("Password Validation: ", validatePassword);
    if (!validatePassword)
      return res
        .status(400)
        .send("you provided an invalid password , please try again");
    const jwtToken = await jwt.sign(
      {
        data: employee,
      },
      process.env.JWT_TOKEN_KEY,
      { expiresIn: "1h" }
    );
    console.log(jwtToken);
    res.header("auth-token", jwtToken);
    res.status(201).json(employee);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const express = require("express");
const db = require("../db");
const crypto = require("crypto-js");
const mailer = require("../mailer");
const jwt = require("jsonwebtoken");
const config = require("../config");
const utils = require("../utils");

const router = express.Router();

router.patch("/user/status/:id", (request, response) => {
  const { id } = request.params;
  const { status } = request.body;
  const statement = `update user set status=${status} where id = ${id}`;
  db.execute(statement, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.get("/user/verify/:id", (request, response) => {
  const { id } = request.params;
  const statement = `update user set status=1 where id = ${id}`;
  db.execute(statement, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.get("/user/profile", (request, response) => {
  const statement = `select firstName,lastName,email,phone from user where id='${request.id}'`;
  db.execute(statement, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.post("/user/signup", (request, response) => {
  const { firstName, lastName, email, password } = request.body;
  //   const statement = `insert into user(firstName,lastName,email,password)values(
  //     '${firstName}','${lastName}','${email}','${password}'
  // )`;

  //encrypt the password
  const encryptedPassword = "" + crypto.SHA256(password);

  //byddefault every user will be non-verfied
  const statement = `insert into user(firstName,lastName,email,password,status)values(
    '${firstName}','${lastName}','${email}','${encryptedPassword}',0
)`;

  db.execute(statement, (error, data) => {
    //result
    const result = utils.createResult(error, data);

    if (!error) {
      // mailer.sendEmail(
      //   "signup.html",
      //   "welcome to EcommerceMail application",
      //   email,
      //   (error, info) => {
      //     response.send(result);
      //   }
      // );
    } else {
      response.send(result);
    }
  });
});

router.post("/user/signin", (request, response) => {
  const { email, password } = request.body;
  //encrypt the password
  const encryptedPassword = "" + crypto.SHA256(password);
  const statement = `select id,firstName,lastName,email,phone ,status from user where 
  email='${email}' and password='${encryptedPassword}' `;
  db.execute(statement, (error, users) => {
    const result = {
      status: "",
      data: "",
    };
    if (error != null) {
      //error while executing statement
      result["status"] = "error";
      result["error"] = error;
    } else {
      if (users.length == 0) {
        //user does not exits
        result["status"] = "error";
        result["error"] = "User does not exist";
      } else {
        const user = users[0];

        //check the user status
        //0:non-verified,1:actuve,2:suspended
        if (user["status"] == 0) {
          result["status"] = "error";
          result["error"] =
            "You have not verified your account yet.Please verify your account.";
        } else if (user["status"] == 2) {
          result["status"] = "error";
          result["error"] =
            "Your account is suspended,please contact administrator ";
        } else {
          const payload = { id: user["id"] };
          const token = jwt.sign(payload, config.secret);

          result["status"] = "success";
          result["data"] = {
            // id: user["id"],   --->can't send id due to security reason hence we sent token
            token: token,
            firstName: user["firstName"],
            lastName: user["lastName"],
            email: user["email"],
            phone: user["phone"],
          };
        }
      }
      response.send(result);
    }
  });
});

module.exports = router;

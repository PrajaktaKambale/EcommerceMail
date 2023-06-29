const express = require("express");
const db = require("../db");
const crypto = require("crypto-js");
const mailer = require("../mailer");
const jwt = require("jsonwebtoken");
const config = require("../config");

const router = express.Router();

router.get("/user/profile", (request, response) => {
  //get the token sent by client
  const token = request.headers["token"];

  try {
    //verify if the token is original or intact
    const payload = jwt.verify(token, config.secret);

    //if the token is valid grab user id
    const id = payload["id"];

    const statement = `select id,firstName,lastName,email,phone from user where id=${id}`;
    db.execute(statement, (error, data) => {
      const result = {
        status: "",
      };
      if (error) {
        result["status"] = "error";
        result["error"] = error;
      } else {
        result["status"] = "success";
        result["data"] = data;
      }
      response.send(result);
    });
  } catch (e) {
    response.send({
      status: "error",
      error: "Unauthorized Access",
    });
  }
});

router.post("/user/signup", (request, response) => {
  const { firstName, lastName, email, password } = request.body;
  //   const statement = `insert into user(firstName,lastName,email,password)values(
  //     '${firstName}','${lastName}','${email}','${password}'
  // )`;

  //encrypt the password
  const encryptedPassword = "" + crypto.SHA256(password);
  const statement = `insert into user(firstName,lastName,email,password)values(
    '${firstName}','${lastName}','${email}','${encryptedPassword}'
)`;

  db.execute(statement, (error, data) => {
    //result
    const result = {
      status: "",
    };

    if (error != null) {
      //if error present
      // console.log(`error:${error}`);
      // response.send("error");
      result["status"] = "error";
      result["error"] = error;
    } else {
      //there is no error
      // console.log(data);
      // response.send("okay");
      result["status"] = "success";
      result["data"] = data;
      mailer.sendEmail(
        "signup.html",
        "welcome to EcommerceMail application",
        email,
        (error, info) => {
          response.send(result);
        }
      );
    }
  });
});

router.post("/user/signin", (request, response) => {
  const { email, password } = request.body;
  //encrypt the password
  const encryptedPassword = "" + crypto.SHA256(password);
  const statement = `select id,firstName,lastName,email,phone from user where 
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
      response.send(result);
    }
  });
});

module.exports = router;

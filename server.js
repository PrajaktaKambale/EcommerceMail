const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const config = require("./config");

//list of routers
const routerUser = require("./routes/user");

const app = express();
app.use(bodyParser.json());

app.use((request, response, next) => {
  //get the token from headers
  const token = request.headers["token"];
  console.log(token);
  try {
    //verify if the token is original or intact
    const payload = jwt.verify(token, config.secret);

    //get id from the token
    //add the user id in the request object so that it can be used in any other API s
    request.userId = payload["id"];

    //call the next handler
    next();
  } catch (ex) {
    response.send({
      status: "error",
      error: "Unauthorized Access",
    });
  }
});
//add routers
app.use(routerUser);

app.get("/", (request, response) => {
  response.send("welcome to ecommerceMail application");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("server started on port 3000");
});

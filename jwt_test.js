const jwt = require("jsonwebtoken");
const secret = "123412341234";

function function1() {
  const data = { id: 1 };

  const token = jwt.sign(data, secret);
  console.log(token);
}
//function1();

//client
function server() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg4MDM1NzY4fQ.gvgj47f-LhvGa9L9Et_LMsPYmo5py7vfThu6z5oNkGI";
  const data = jwt.verify(token, secret);
  console.log(data);
}
server();

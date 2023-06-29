const nodemailer = require("nodemailer");
const fs = require("fs");
const { send } = require("process");

function sendEmail(template, subject, email, callback) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "monamona210897@gmail.com",
      pass: "Mona@1234",
    },
  });

  const contents = "" + fs.readFileSync("./emailTemplates/" + template);
  console.log(contents);

  const mailOptions = {
    from: "monamona210897@gmail.com",
    to: email,
    subject: subject,
    html: contents,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    console.log(error);
    console.log(info);
    callback(error, info);
  });
}
module.exports = {
  sendEmail: sendEmail,
};

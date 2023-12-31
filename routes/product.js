const express = require("express");
const db = require("../db");
const utils = require("../utils");

const router = express.Router();

router.get("/product", (request, response) => {
  const statement = `select id, title, description, price from product`;
  db.execute(statement, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.post("/product", (request, response) => {
  const { title, description, price, category, company } = request.body;
  const statement = `insert into product (title, description, price, category, company) values 
        ('${title}','${description}', '${price}', '${category}', '${company}')`;
  db.execute(statement, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.put("/product/:id", (request, response) => {
  const { id } = request.params;
  const { title, description, price, category, company } = request.body;
  const statement = `update product set 
        title = '${title}',
        description = '${description}',
        price = '${price}', 
        category = ${category}, 
        company = ${company}
    where id = ${id}`;
  db.execute(statement, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.delete("/product/:id", (request, response) => {
  const { id } = request.params;

  const statement = `delete from product where id = ${id}`;
  db.execute(statement, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

module.exports = router;

const Sequilize = require("sequelize");

const sequelize = new Sequilize("todo", "root", "abdou1331", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

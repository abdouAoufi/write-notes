const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Note = sequelize.define("note", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  content: { type: DataTypes.STRING },
});

module.exports = Note ;
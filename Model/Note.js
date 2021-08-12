const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Note = sequelize.define("note", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.STRING, allowNull: false },
  imagePath: { type: DataTypes.STRING },
});

module.exports = Note;

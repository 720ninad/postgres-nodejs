// user-model.js
import { DataTypes } from "sequelize";

export const createProductModel = async (sequelize) => {
  const Product = sequelize.define("products", {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    productSerialNumber: {
      type: DataTypes.NUMBER,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  return Product;
};

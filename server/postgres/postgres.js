import { Sequelize } from "sequelize";
import { createUsersModel } from "../model/user-schema.js";
const sequelize = new Sequelize("testingdb", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});

let EmployeesModel = null;
let UsersModel = null;
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    UsersModel = await createUsersModel(sequelize);
    await sequelize.sync();
    console.log("Database Sync");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connection, EmployeesModel, UsersModel };

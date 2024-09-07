import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsersModel } from "../postgres/postgres.js";

export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingAdmin = await UsersModel.findOne({
      where: { role: "admin" },
    });

    if (existingAdmin && role === "admin") {
      return res.status(400).json({ error: `Admin already exists` });
    }
    const existingUser = await UsersModel.findOne({ where: { email } });
    if (existingUser) {
      const roleType =
        existingUser.role === "user"
          ? "User"
          : existingUser.role === "admin"
          ? "Admin"
          : "";
      return res.status(400).json({ error: `${roleType} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UsersModel.create({
      username,
      email,
      password: hashedPassword,
      role: role,
    });

    return res
      .status(201)
      .json({ message: `${role} registered successfully`, user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UsersModel.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  return res.status(200).json({ message: "Logout successful" });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UsersModel.findAll();
    if (users.length === 0) {
      return res.status(200).json({ error: "No Errors" });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const userEmail = req.params.userEmail;
  try {
    console.log("req.user:------- ", req.user);
    if (req.user.role === "admin") {
      const user = await UsersModel.findOne({
        where: {
          email: userEmail,
        },
      });
      if (user) {
        await UsersModel.update(req.body, {
          where: {
            email: userEmail,
          },
        });
        return res.status(200).json({ message: "User Updated successfully" });
      } else {
        return res.status(200).json({ message: "User Does Not Exists" });
      }
    } else {
      return res
        .status(200)
        .json({ message: "Access Denied ! You are not admin" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateNameOfUser = async (req, res) => {
  const userEmail = req.params.userEmail;
  const { username } = req.body;
  try {
    if (req.user.role === "admin") {
      const user = await UsersModel.findOne({
        where: {
          email: userEmail,
        },
      });
      if (user) {
        await UsersModel.update(
          {
            username: username,
          },
          {
            where: {
              email: userEmail,
            },
          }
        );
        return res
          .status(200)
          .json({ message: "user Name Updated successfully" });
      } else {
        return res.status(200).json({ message: "User Does Not Exists" });
      }
    } else {
      return res
        .status(200)
        .json({ message: "Access Denied ! You are not admin" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const userEmail = req.params.userEmail;
  try {
    if (req.user.role === "admin") {
      const user = await UsersModel.findOne({
        where: {
          email: userEmail,
        },
      });
      if (user) {
        await UsersModel.destroy({
          where: {
            email: userEmail,
          },
        });
        return res.status(200).json({ message: "User Deleted successfully" });
      } else {
        return res.status(200).json({ message: "User Does Not Exists" });
      }
    } else {
      return res
        .status(200)
        .json({ message: "Access Denied ! You are not admin" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { db } from "./db.js";
import { auth } from "./auth.js";

const app = express();
const PORT = 8080;
const TOKEN_KEY = "secret";

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to App1!");
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = {
      id: db.length + 1,
      username: username,
      password: password,
    };
    console.log(newUser);

    const token = jwt.sign(
      { username: newUser.username, password: newUser.password },
      TOKEN_KEY,
      {
        expiresIn: "15m",
      }
    );

    newUser.token = token;
    db.push(newUser);
    res.status(201).json({ message: "User Added", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Registration Unsuccessful" });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);
  try {
    const user = db.find((user) => user.username === username);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.password === password) {
      const token = jwt.sign(
        { username: user.username, password: user.password },
        TOKEN_KEY,
        {
          expiresIn: "15m",
        }
      );

      user.token = token;
      res.status(200).json({ message: "Login Successful", user: user });
      return;
    } else {
      res.status(400).json({ message: "Incorrect Password" });
    }
    // console.log(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

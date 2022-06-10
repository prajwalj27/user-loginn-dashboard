import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { JSEncrypt } from "nodejs-jsencrypt";

import { dbUsers } from "./db.js";
import { auth } from "./auth.js";

const app = express();
const PORT = 8080;
const TOKEN_KEY = "secret";

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to App1!");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const newUser = {
      id: dbUsers.length + 1,
      username: username,
      password: password,
    };
    // console.log(newUser);

    const token = jwt.sign(
      { username: newUser.username, password: newUser.password },
      TOKEN_KEY,
      {
        expiresIn: "15m",
      }
    );

    newUser.token = token;

    dbUsers.push(newUser);
    res.status(201).json({ message: "User Added", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/login1", (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);
  try {
    const user = dbUsers.find((user) => user.username === username);

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
      res.status(200).json({ message: "Login Successful", token: token });
      return;
    } else {
      res.status(400).json({ message: "Incorrect Password" });
    }
    // console.log(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/redirect-login/*", (req, res) => {
  var privateKey = `
    -----BEGIN RSA PRIVATE KEY-----
    MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
    WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
    aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
    AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
    xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
    m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
    8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
    z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
    rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
    V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
    aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
    psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
    uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
    -----END RSA PRIVATE KEY-----`;

  try {
    //decrypt the data from the URL
    const encryptedData = req.query.data;

    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    const uncrypted = decrypt.decrypt(encryptedData);

    // Login the user into the App1 Dashboard
    const decryptedData = JSON.parse(uncrypted);
    console.log("Decrypted Data: ", decryptedData);

    const user = dbUsers.find(
      (user) => user.username === decryptedData.username
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.password === decryptedData.password) {
      const token = jwt.sign(
        { username: user.username, password: user.password },
        TOKEN_KEY,
        {
          expiresIn: "10m",
        }
      );

      user.token = token;
      res
        .status(200)
        .json({
          message: "Login Successful",
          user: user,
          decryptedData: decryptedData,
        });
      return;
    }
    // res.send(uncrypted);
  } catch (err) {
    console.log(err);
  }
});

app.get("/secret-route", auth, (req, res, next) => {
  // console.log(req);
  res.json({ message: "verified" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

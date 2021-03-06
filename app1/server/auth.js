import jwt from "jsonwebtoken";

// const config = process.env;
const TOKEN_KEY = "secret";


export const auth = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    // req.user = decoded;
  } catch (err) {
    console.log(err)
    return res.status(401).send(err);
  }
  return next();
};


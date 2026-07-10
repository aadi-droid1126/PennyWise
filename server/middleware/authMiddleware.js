const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "You must enter the sewer first. 🎈" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Invalid token. IT does not recognize you." });
  }
};

module.exports = { protect };

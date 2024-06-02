const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers["authorization"]) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Split the authorization header and retrieve the token
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token not provided in Authorization header",
      });
    }

    // Verify the token
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authentication failed",
        });
      } else {
        // If token is valid, set userId in request body and proceed
        req.body.userId = decode.userId;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Internal server error",
    });
  }
};

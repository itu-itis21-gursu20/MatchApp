const jwt = require("jsonwebtoken");

const verifyTokenAndAuthorization = (req, res, next) => { // sadece paramsta kendi idsi olanlar için verify yapar

  const authHeader = req.headers.token;
  console.log("authHeader", authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("token", token);

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      console.log("req", req);
      req.user = user;
      console.log("req.user", req.user);
      console.log("req.params", req.params);


      if(Object.keys(req.params).length !== 0){
        if (req.user.id === req.params.id) {
          next();
        } else {
          res.status(403).json("You are not allowed to do that! verifytokenandauthorization");
        }
      }
      next();
    });

  } else {
    return res.status(401).json("You are not authenticated! verifytokenandauthorization");
  }
};

const verifyTokenAndAuthorizationForFollowing = (req, res, next) => { // sadece paramsta kendi idsi olanlar için verify yapar
  const authHeader = req.headers.token;
  console.log("authHeader", authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("token", token);

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      console.log("req", req);
      req.user = user;
      console.log("req.user", req.user);
      console.log("req.params", req.params);


      if(Object.keys(req.params).length !== 0){
        if (req.user.id !== req.params.id) {
          next();
        } else {
          res.status(403).json("You are not allowed to do that! verifytokenandauthorization");
        }
      }
    });

  } else {
    return res.status(401).json("You are not authenticated! verifytokenandauthorization");
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");

      req.user = user;

      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not allowed to do that! verifytokenandadmin");
      }
    });

  } else {
    return res.status(401).json("You are not authenticated! verifytokenandadmin");
  }
};

module.exports = {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorizationForFollowing
}
const jwt = require("jsonwebtoken");

const verifyTokenAndAuthorization = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      
      req.user = user;


      if (req.user.id === req.params.id || req.user.isAdmin || req.user.id !== req.params.id) { // follow ve unfollow için 3.şartı ekkedim
        next();
      } else {
        res.status(403).json("You are not allowed to do that! verifytokenandauthorization");
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
  verifyTokenAndAdmin
}





// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   //console.log("verifyToken");
//   const authHeader = req.headers.token;
// console.log("authHeader", authHeader);
//   if (authHeader) {

//     const token = authHeader.split(" ")[1];

//     jwt.verify(token, process.env.JWT_SEC, (err, user) => {
//       if (err) res.status(403).json("Token is not valid!");
//       req.user = user;
//       console.log("req.user",req.user);
//       next();
//     });

//   } else {
//     return res.status(401).json("You are not authenticated!");
//   }
// };

// const verifyTokenAndAuthorization = (req, res, next) => {
//   console.log("verifyTokenAndAuthorization");
//   verifyToken(req, res, () => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       res.status(403).json("You are not allowed to do that! verifytokenandauthorization");
//     }
//   });

// };

// const verifyTokenAndAdmin = (req, res, next) => {
//   //console.log("verifyTokenAndAdmin");
//   verifyToken(req, res, () => {
//     if (req.user.isAdmin) {
//       next();
//     } else {
//       res.status(403).json("You are not allowed to do that! verifytokenandaadmin");
//     }
//   });

// };


// module.exports = {
//   verifyToken,
//   verifyTokenAndAuthorization,
//   verifyTokenAndAdmin
// }
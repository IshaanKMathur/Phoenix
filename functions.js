const jwt = require('jsonwebtoken');

function checkJWT(req,res,next){
const token=req.cookies['auth-token'];
if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
jwt.verify(token,process.env.TOKEN_SECRET , function(err, decoded) {
if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
req.username=decoded._id;
});
next();
};

module.exports={
    checkJWT
}
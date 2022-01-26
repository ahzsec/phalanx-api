const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const auth = async (r,s,next) => {
    try {
        const token = r.header('Authorization').replace('Bearer ','');
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findOne({_id: decode._id, 'tokens.token': token});
        if (!user) {
            throw new Error();
        }
        r.token = token;
        r.user = user;
        next();
    } catch (e) {
        s.status(401).send({error: "not authorized"})
    }
};

module.exports = auth;
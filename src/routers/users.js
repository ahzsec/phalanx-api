const app = require("express");
const router = new app.Router();
const Users = require("../models/users");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const randtoken = require('rand-token');
const { sendVerificationEmail, sendDeletedEmail} = require("../emails/accounts");

const upload = multer({
    limits: {
       fileSize: 1000000
    },
    fileFilter(r,file,cb){
       if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           s.status(401).send({error: 'file extension must be jpg/jpeg/png'});
           return;
       }
       cb(undefined,true);
    }
});

router.post('/signup', auth, async (r,s) => {
    if (r.user.admin !== 0){
        s.status(401).send({error: "not authorized"});
        return;
    }
    const user = new Users(r.body);
    try {
        user.verify = await randtoken.generate(300);
        await user.save();
        sendVerificationEmail(user.email,user.verify);
        s.status(201).send({
            "_id": user._id,
            "username": user.username,
            "email": user.email,
            "admin": user.admin})
    } catch (e) {
        s.status(400).send(e);
    }
});

router.post('/verify', async (r,s) => {
    const user = await Users.findOne({'verify': r.query.tkn});
    if (!user){
        s.status(401).send({error: "not authorized"});
        return;
    }
    const body = Object.keys(r.body);
    const allowUpdates = ['password'];
    const isValid = body.every((update) => allowUpdates.includes(update));
    if (!isValid){
        s.status(400).send({error: "invalid updates"});
        return;
    }
    try {
        body.forEach((key) => user[key] = r.body[key]);
        user.verify = undefined;
        const token = await user.generateAuthToken();
        await user.save();
        s.send({token})
    } catch (e) {
        s.status(500).send()
    }
});

router.post('/login', async (r,s) => {
    try {
        const user = await Users.findByCredentials(r.body.email,r.body.password);
        const token = await user.generateAuthToken();
        s.send({token});
    } catch (e) {
        s.status(500).send()
    }
});

router.get('/logout', auth, async (r,s) => {
    try {
        if (r.query.t == "full"){
            r.user.tokens = []
        } else {
            r.user.tokens = r.user.tokens.filter((token) => {
                return token.token !== r.token
            });
        }
        await r.user.save();
        s.send()
    } catch (e) {
        s.status(500).send()
    }
});

router.get('/users', auth, async (r,s) => {
    if (r.user.admin !== 0){
        s.status(401).send({error: "not authorized"});
        return;
    }
    try {
        const users = await Users.find({});
        s.send(users)
    } catch (e) {
        s.status(500).send()
    }
});

router.get('/profile', auth, async (r,s) => {
    const user = r.user;
    try {
        const userObject = await user.toObject();
        delete userObject.avatar;
        delete userObject.admin;
        delete userObject.createdAt;
        delete userObject.updatedAt;
        delete userObject._id;
        delete userObject.__v;
        delete userObject.password;
        s.send(userObject);
    } catch (e) {
        s.status(500).send()
    }
});

router.put('/profile', auth, async (r,s) => {
    const body = Object.keys(r.body);
    const allowUpdates = ['username','email','password'];
    const isValid = body.every((update) => allowUpdates.includes(update));
    if (!isValid){
        s.status(400).send({error: "invalid updates"});
        return;
    }
    try {
        body.forEach((key) => r.user[key] = r.body[key]);
        await r.user.save();
        s.send({msg: "profile updated"})
    } catch (e) {
        s.status(500).send()
    }
});

router.post('/profile/avatar', auth, upload.single('avatar'), async (r,s) => {
    const buffer = await sharp(r.file.buffer).resize({width:250,height:250}).png().toBuffer();
    r.user.avatar = buffer;
    await r.user.save();
    s.send({msg: "avatar added"})
}, (e,r,s,next) => {
    s.status(500).send()
});

router.delete('/profile/avatar', auth, async (r,s) => {
    try {
        r.user.avatar = undefined;
        await r.user.save();
        s.send({msg: "avatar deleted"})
    } catch (e) {
        s.status(500).send()
    }
});

router.delete('/profile', auth, async (r,s) => {
    try {
        sendDeletedEmail(r.user.email);
        await r.user.remove();
        s.send({msg: "user deleted"})
    } catch (e) {
        s.status(500).send()
    }
});

module.exports = router;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Subs = require("./subs");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        maxLength: 20
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        maxLength: 200,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("please provide a valid email address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        maxLength: 15,
        default: "default-user",
        validate(value){
            if(value.toLowerCase().includes(this.username) || value.toLowerCase().includes(this.email.replace(/@(?=[a-z\d][^.]*\.)[a-z\d.-]*[^.]/,''))){
                throw new Error("password can't contain your username or your email address username")
            }
        }},
    admin: {
        type: Number,
        required: true,
        trim: true,
        maxLength: 1,
        default: 1,
        validate(value){
            if (value != 1 && value != 0){
                throw new Error("admin value should be 0 or 1")
            }
        }
    },
    verify: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
});

userSchema.virtual('Subs', {
    ref: 'Subs',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token
};

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await Users.findOne({email});
    if (!user){
        throw new Error("Invalid username or password")
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch){
        throw new Error("Invalid username or password")
    }
    return user;
};

userSchema.pre('save', async function (next){
    const user = this;
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;
    await Subs.deleteMany({owner: user._id});
    next();
});

const Users = mongoose.model("Users",userSchema);

module.exports = Users;
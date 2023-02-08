const mongoose = require("mongoose");

const subsSchema = mongoose.Schema({
    domain: {
        type: String,
        required: true,
        lowercase: true
    },
    subdomains: {
        type: Array,
        required: true,
        lowercase: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subs'
    }
},{
    timestamps: true
});

const Subs = mongoose.model("Subs", subsSchema);

module.exports = Subs;
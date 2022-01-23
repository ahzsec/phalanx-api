const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = (email,token) => {
    sgMail.send({
        to: email,
        from: 'ahmedelsir6@gmail.com',
        subject: "Verify your email address",
        text: `Thanks for signing up for Phalanx! We're excited to have you as an early user.\n\nhttps://phalanx.herokuapp.com/verfiy?tkn=${token}\n\nThanks,\nThe Phalanx Team`
    }).then(() => {
        console.log('message sent')
    }).catch((e) => {
        console.log()
    });
};

const sendDeletedEmail = (email) => {
    sgMail.send({
        to: email,
        from: 'ahmedelsir6@gmail.com',
        subject: "Your account has been deleted",
        text: `Your account has been deleted from our service.\nYou would't be able to sign in again.\n\nThe Phalanx Team`
    }).then(() => {
        console.log('message sent')
    }).catch((e) => {
        console.log()
    });
};

module.exports = {
    sendVerificationEmail,
    sendDeletedEmail
};
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

templates = {
    verify_your_email_address: "d-68b4297aab244d8bb1abbb755fc781d9"
};

const sendVerificationEmail = (email,token) => {
    sgMail.send({
        to: email,
        from: 'example@example.com',
        subject: "Verify your email address",
        templateId: templates.verify_your_email_address,
        dynamic_template_data: {
            email_verification_url:  token
        }
    }).then(() => {
        console.log('message sent')
    }).catch((e) => {
        console.log(e)
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
        console.log(e)
    });
};

module.exports = {
    sendVerificationEmail,
    sendDeletedEmail
};
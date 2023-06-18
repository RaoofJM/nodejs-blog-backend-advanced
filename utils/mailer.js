const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
  host: "",
  port: 465,
  secure: true,
  auth: {
    user: "",
    pass: "",
  },
  tlss: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = async (email, fullname, subject, message) => {
  try {
    const transporter = nodeMailer.createTransport(transporterDetails);
    await transporter.sendMail({
      from: "",
      to: email,
      subject: subject,
      html: `<h1> Hello ${fullname} </h1>
               <p> ${message} </p>`,
    });

    return true;
  } catch (err) {
    return false;
  }
};

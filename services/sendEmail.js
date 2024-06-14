
const nodemailer = require("nodemailer")

module.exports = async (to,subject,html)=>{
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "raju.poriya@cmarix.com",
          pass: "raju&&0986"
        },
      });
      
      let mailOptions = {
        to: to,
        subject: subject,
        html: html
        // attachments: [
        //   {
        //     filename: `${name}.pdf`,
        //     path: path.join(__dirname, `../../src/assets/books/${name}.pdf`),
        //     contentType: 'application/pdf',
        //   },
        // ],
      };
      
      await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log("<<<err>>>", err);
        } else {
          console.log("<<<responce>>>", info);
        }
      });
}
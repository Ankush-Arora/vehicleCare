const nodeMailer=require("nodemailer");

const sendEmail= async (options)=>{

    const transporter=nodeMailer.createTransport({
            service:process.env.SMPT_SERVICE,
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            logger:true,
            debug:true,
            secureConnection:false,
            auth:{
                user:process.env.SMPT_MAIL,
                pass:process.env.SMPT_PASSWORD,
            },
            tls:{
                rejectUnauthorized:true
            }
    });
    // console.log(process.env.SMPT_MAIL);
    // console.log(options.message);
    const mailOptions={
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    
    await transporter.sendMail(mailOptions);
    // console.log('testing in sendEmail');
}

module.exports=sendEmail
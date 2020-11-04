import chalk from 'chalk';
import nodemailer from 'nodemailer';
const transport = nodemailer.createTransport({
        
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL, // generated ethereal user
      pass: process.env.USER_PASSWOR_EMAIL, // generated ethereal password
    },
});


transport.verify().then(() => {
        console.log('======================NODEMAILER CONFIG===================');
        console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
        console.log(`MESSAGE: ${chalk.greenBright('MAILER CONNECT!!')}`);

}).catch(error => {
  console.log('======================NODEMAILER CONFIG===================');
  console.log(`STATUS: ${chalk.greenBright('OFFLINE')}`);
  console.log(`MESSAGE: ${chalk.greenBright(error)}`);

});

export default transport;
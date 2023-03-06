import nodemailer from 'nodemailer'
import {logInfo} from './Logger.js'
import dotenv from 'dotenv';
dotenv.config();
//const Mailgen = require('mailgen')



const mailToDev = async () => {
const config = {
    service: 'gmail',
    port: 587,
    auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_EMAIL
    }
};

    let message = {
        from: `George <${process.env.USER_EMAIL}>`,
        to: "jorgevalle@outlook.com.ar",
        subject: "¡¡¡aviso de nuevo usuario!!!",
        html: "<b>se ha generado un nuevo usuario</b>"
    }



    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail(message)
    logInfo.info(info);

        

}


export {mailToDev}



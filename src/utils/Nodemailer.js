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

const mailToUser = async (order) => {
    const config = {
        service: 'gmail',
        port: 587,
        auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL
        }
    };
    
    let htmlMsg =``

    for (let i = 0; i < order.products.length; i++) {
        const product = order.products[i];
        const html = `
            <ul>
                <li><b>ID:</b> ${product._id}</li>
                <li><b>Categoría:</b> ${product.category}</li>
                <li><b>Nombre:</b> ${product.name}</li>
                <li><b>Precio:</b> ${product.price}</li>
                <li><b>Cantidad:</b> ${product.quantity}</li>
                
            </ul>`;
            htmlMsg += html;
        }


        let message = {
            from: `Azur Store <${process.env.USER_EMAIL}>`,
            to: `${order.email}`,
            subject: `¡Su pedido de Azur Store!`,
            html: `
                <b>Datos del comprador</b>
            <hr>
            <ul>
                <li><b>Nombre de Usuario:</b> ${order.email} </li>
                <li><b>Teléfono:</b> ${order.phone}</li>
                
            </ul>
            
                <b>Datos del Pedido número: ${order.numOrder}</b>
            <hr>
                ${htmlMsg}
            <hr>
            <ul>
                <li><b>Fecha y Hora:</b> ${order.timestamp}</li>
                <li><b>Dirección de entrega:</b> ${order.address}</li>
            </ul>`
        }
    
        
    
    
        const transporter = nodemailer.createTransport(config);
    
        const info = await transporter.sendMail(message)
        logInfo.info(info);
    }


export {mailToDev,mailToUser}



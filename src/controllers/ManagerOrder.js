import '../loaders/connection.js';
import OrderModel from '../models/OrderModel.js';
import CartModel from '../models/CartModel.js';
import { mailToUser} from '../utils/Nodemailer.js';
import {logInfo, logger, errorLogger} from '../utils/Logger.js'

class Order{

    async createOrder(req, res) {
        try{

            const { id_user } = req.params
            
            const orders = await OrderModel.find({})
            let addNumOrder=0;
            if(!orders[0]){
                addNumOrder=1;
            }else{
                addNumOrder= orders.length+1
            }
            const cart = await CartModel.findOne({idUser:id_user})

            const addProducts = cart.products

            const AddEmail = cart.email

            const addAddress= cart.address

            const addTotalItems = cart.totalItems

            const addTotalPrice = cart.totalPrice

            const AddUserId = cart.idUser

            const AddPhone = cart.phone

            const NewOrder = await OrderModel.create({numOrder:addNumOrder,products:addProducts,email:AddEmail,address:addAddress,totalItems:addTotalItems,totalPrice:addTotalPrice,userId:AddUserId,phone:AddPhone})
            //send order by email whit nodemailer
            mailToUser(NewOrder)
            
            //file
            logger.info(`New Order ${addNumOrder} of user: ${addAddress} generated`)
            
            //delete cart
            const cartDeleted = await CartModel.findOneAndDelete({idUser:id_user})
            //console
            logInfo.info(`cart deleted: ${cartDeleted.idUser} `)

            return res.status(200).json({message: "Order generated: ", data:NewOrder})
        }catch(err){
            errorLogger.error(`order not generated: ${err}`)
            return res.status(400).json({message: `order not generated: ${err}`})
        }
    }

    async getOrder(req, res) {
        try{

            const { num_order } = req.params

            const order = await OrderModel.findOne({numOrder:num_order})

            return res.status(200).json({message: "Order found: ", data:order})
        }catch(err){
            errorLogger.error(`order not found : ${err}`)
            return res.status(400).json({message: `order not found: ${err}`})
        }
    }

    async getOrdersByUser(req, res) {
        try{
            const { id_user } = req.params

            const orders = await OrderModel.find({userId:id_user})

            return res.status(200).json({message: "Orders of User: ", data:orders})
        }catch(err){
            errorLogger.error(` User's orders not found : ${err}`)
            return res.status(400).json({message: `User's orders not found : ${err}`})
        }
    }

}

export default new Order();
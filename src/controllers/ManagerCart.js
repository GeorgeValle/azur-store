import '../loaders/connection.js';
import CartModel from '../models/CartModel.js';
import book from './ManagerBook.js';
import {logInfo,errorLogger} from '../utils/Logger.js';
import {userModel} from '../models/Users.js';
import ProductModel from '../models/ProductModel.js';
class Cart{


    #createCart= async (id_user)=>{
        // const { id_user } = req.params
        try{
            const user = await userModel.findById(id_user)
            if(!user){errorLogger.error("NO found user for function createCart")}
            
            let addressUser = user.address
            let emailUser = user.username
            let phoneUser = user.phone
            const cart = await CartModel.find({idUser:id_user})
            if(!cart[0]){
                
                await CartModel.create({idUser:id_user,address:addressUser,email:emailUser,phone:phoneUser})
                
                logInfo.info(`Cart of ${user.name} create`)
                
            }
        }catch(err){
            errorLogger.error(`cart not created ${err}`)
            res.render('errors',{message:err,route: "session/purchase",zone:"compras"})
            
        }
    }

    #renderPurchase = async (res,user) =>{
    let products = await book.getAllP()
        //flag the admin access
        let access = false
        if(user.admin==true){ access = true }
        
        //cast object id in string
        let myObjectId =user._id
        //add value in each product
        for (let i = 0; i < products.length; i++) {
            products[i].userId = myObjectId.toString()
        }

        res.render('purchase',{
            user: user.name, avatar: user.avatar, admin:access, products: products, message:"Item agregado" 
            })

        }

    //create one cart whit a Id_user from params
    createOneCart= async (req, res)=>{
            const { id_user } = req.params
            
                try{
                    const user = await userModel.findById(id_user)
                    if(!user){errorLogger.error("NO found user for function createCart")}
                    let addressUser = user.address
                    let emailUser = user.username
                    let phoneUser = user.phone
                    const cart = await CartModel.findOne({idUser:id_user})
                    if(!cart[0]){
                        const newCart = await CartModel.create({idUser:id_user,address:addressUser,email:emailUser,phone:phoneUser})
                        logInfo.info(`Cart of ${user.name} create`)
                    return res.status(200).json( {data: newCart});    
                    }
                }catch(err){
                    errorLogger.error(`cart not created ${err}`)
                    return res.status(400).json( {message: `cart not created ${err}`});
                }
            }
    

    //obtain a cart whit the id_user
    getById = async (req,res) => {
        //Validations
        try {
            
            const { id_user } = req.params
            //Validations
            if (!id_user) return res.status(400).json( {message: "Id required"});

            const cart = await CartModel.find({idUser:id_user})
            if(!cart) return res.status(404).json({ message: 'Cart does not exits'})
            return res.status(200).json(cart)
        } catch(err) {
            errorLogger.error(`error to obtain a Cart, getById: ${err}`);
            return res.status(404).json({ message: 'cart does not exits'});
        }
    }
    //obtain one cart whit an id_user 
    getByIdUser= async (id_user) => {
        //Validations
        try {

            const cart = await CartModel.findOne({idUser:id_user})
            
                return cart
            //}
        } catch(err) {
            errorLogger.error(`error to obtain a Cart, getByIdUser: ${err}`);
        }
    }


    //get a item of a cart from thunder client
    getItemById = async (req,res) => {
        try {
            
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json( {message: "Id required"});
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: "Product ID required"});
            let seeProduct = await CartModel.findOne({ idUser: id})
            let items = seeProduct.products
            let item = {}
            for (let i = 0; i < items.length; i++) {
                if(items[i]._id == id_prod){
                    item=items[i]
                }
            }
            if(!item){return res.status(200).json({message:"ok",data:item})}
        }catch(err){
            errorLogger.error(`no se encontró item ${err}`)
            res.status(400).json( {message: `no se encontró item ${err}`});
        }

    }

    //add a product in a cart from thunder client
    updateById= async (req, res) => {

        try {
            
            const { id_user } = req.params
            if (!id_user) return res.status(400).json( {message: "Id required"});
            await this.#createCart(id_user)
            
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: " Product ID required"});

            let newProduct = await ProductModel.findOne({id:id_prod})

            const cart = await CartModel.findOne({idUser:id_user});

            //flag for know if the product is inside of cart
            let inside = false

            for (const prod of cart.products) {
                if(prod._id == id_prod) {

                    inside = true;
                    cart.totalItems += 1;
                    cart.totalPrice += prod.price;
                    prod.quantity += 1;
                    cart.save()
                    logInfo.info(`added in cart again:  ruta /carts/id_user/products/id_prod`)
                    return res.status(200).json({message: "Product added: ", data:newProduct})
                }
            }

            if(inside==false){
            
            cart.totalPrice +=newProduct.price
            cart.totalItems +=1
            newProduct.quantity+=1
            newProduct.userId=id_user
            //cart.products.push(newProduct)
            cart.save()
            await CartModel.findOneAndUpdate( {idUser:id_user},
                {$push: {
                        'products':newProduct,
                        },
                })
            logInfo.info(`added to cart:  ruta /carts/id_user/products/id_prod`)
            }
            
            return res.status(200).json({message: "Product added: ", data:newProduct})
            
        } catch(err) {
            errorLogger.error("error to add item, function updateById")
            return res.status(400).json({message: "Product not added"})
        }
    }


    //add a product in a cart from frontend
    updateByIdFront= async (req, res) => {

        try {
            
            const { id_user } = req.params
            if (!id_user) return res.status(400).json( {message: "Id required"});
            await this.#createCart(id_user)
            
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: " Product ID required"});

            let newProduct = await ProductModel.findOne({id:id_prod})

            const cart = await CartModel.findOne({idUser:id_user});

            //flag for know if the product is inside of cart
            let inside = false

            for (const prod of cart.products) {
                if(prod._id == id_prod) {

                    inside = true;
                    cart.totalItems += 1
                    cart.totalPrice += prod.price
                    prod.quantity += 1

                    
                    cart.save()
                    logInfo.info(`added in cart again:  ruta /carts/id_user/products/id_prod`)                   
                    
                }
            }

            if(inside==false){
            
            cart.totalPrice +=newProduct.price
            cart.totalItems +=1
            newProduct.quantity+=1
            newProduct.userId=id_user
            //cart.products.push(newProduct)
            cart.save()
            await CartModel.findOneAndUpdate( {idUser:id_user},
                {$push: {
                        'products':newProduct,
                        },
                })
            logInfo.info(`added to cart:  ruta /carts/id_user/products/id_prod`)
            }
        } catch(err) {
            errorLogger.error("error to add item, function updateByIdFront")
            return res.render('errors',{message:err,route: "session/purchase",zone:"compras"})
        }
    }

    //delete a product from a cart from thunder client
    deleteById =async (req,res)=> {
        try{
            const { id } = req.params;
            if (!id) return res.status(400).json( {message: "Id required"});
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: "Product Id required"});
            const deleted = await CartModel.updateOne({idUser: id}, {$pull: {products: id_prod }})
            await deleted.save();
            return res.status(200).json({ message: 'Product deleted!', data: deleted})
            }catch(err) {
                    return res.status(404).json({ message: `Failed to delete product: ${err}`})
            }
    }
    
    //delete a product from a cart from Frontend
    deleteByIdFront =async (req,res)=> {
        try{
            const { id } = req.params;
            if (!id) return res.status(400).json( {message: "Id required"});
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: "Product Id required"});
            const deleted = await CartModel.updateOne({idUser: id}, {$pull: {products: id_prod }})
            await deleted.save();
            logInfo.info(`Product deleted  ruta /carts/id_user/products/id_prod`)
            }catch(err) {
                    errorLogger.error("error to delete item, function deleteByIdFront")
            }
    }


    //delete a cart from thunder client
    deleteCart = async (req,res) => {
        try {
            const { id_user } = req.params
            if (!id_user) return res.status(400).json( {message: "Cart Id required"});
            const cartDeleted = await CartModel.findOneAndDelete({idUser:id_user})
            if (!cartDeleted) return res.status(404).json({ message: 'Cart does not exists'})
            return res.status(200).json({ message: 'Cart deleted!', data: cartDeleted})
        }catch(err){return res.status(404).json({ message: 'Failed to delete cart'})}
    }

    //delete cart from Frontend
    deleteCartFront = async (req,res) => {
        try {
            const { id } = req.params
            if (!id) return res.status(400).json( {message: "Cart Id required"});
            const cartDeleted = await CartModel.findByIdAndDelete(id)
            if (!cartDeleted) return res.status(404).json({ message: 'Cart does not exists'})
            logInfo.info(`cart deleted  ruta /carts/delete/:id`)
            return res.status(200).json({ message: 'Cart deleted!', data: cartDeleted})
        }catch(err){
            errorLogger.error("Failed to delete cart, route /carts/delete/:id")
        }
    }

    //obtain a list of carts from thunder client
    async getAll(req , res) {

        const carts = await CartModel.find()
        
        return res.status(200).json({message: "all carts: ", data:carts})
    }

        //obtain a list of carts
    async getAllCarts(req , res) {

        const carts = await CartModel.find()
        return carts
    }

}

export default new Cart();
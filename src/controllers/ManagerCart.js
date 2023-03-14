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
            const cart = await CartModel.find({idBD:id_user})
            if(!cart[0]){
                
                await CartModel.create({idBD:id_user,address:addressUser,email:emailUser})
                
                logInfo.info(`Cart of ${user.name} create`)
                
            }
        }catch(err){
            errorLogger.error(`cart not created ${err}`)
            res.render('errors',{message:err,route: "session/purchase",zone:"compras"})
            
        }
    }

    // #getProduct = async id_prod => {
        
    //     try{
    //     let productArray = await ProductModel.findOne({id:id_prod});
    //     let product = productArray[0];
    //     return product;
    //     }catch(err){
    //         errorLogger.error(`product not found ${err}`)
    //         res.render('errors',{message:err,route: "session/purchase",zone:"compras"})
            
    //     }
    // }

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


    //receive a id of product
    // saveData= async (req, res) => {
    //     //validations
    //     try{
    //         let carts = await CartModel.find()
    //         if(!carts){
    //         const createdCart = await CartModel.create({});
    //         if(!createdCart)return res.status(404).json({ message: 'Cart does not created'})
        
    //         return res.status(200).json({message: "Cart created", data: createdCart})
    //         }
    //     }catch(err){
    //         console.log(err)
    //         return{status:400, message: "error cart not created"}
    //     }
    // }
    
    //create one cart whit a Id_user from params
    createOneCart= async (req, res)=>{
        try{
            const { id_user } = req.params
            await this.#createCart(id_user)
        }catch(err){
            errorLogger.error("error to create Cart, function createOneCart")
            res.render('errors',{message:err,route: "session/purchase",zone:"/compras"})
        }
    }

    //obtain a cart whit the id_user
    getById = async (req,res) => {
        //Validations
        try {
            
            const { id_user } = req.params
            //Validations
            if (!id_user) return res.status(400).json( {message: "Id required"});

            const cart = await CartModel.find({idBD:id_user})
            if(!cart) return res.status(404).json({ message: 'Cart does not exits'})
            return res.status(200).json(cart)
        } catch(err) {
            errorLogger.error(`error to obtain a Cart, getById: ${err}`);
            return res.status(404).json({ message: 'cart does not exits'});
        }
    }
    //obtain one cart whit an id_user
    getByIdUser= async (id_user, req, res) => {
        //Validations
        try {
            
            //const { id_user } = req.params
            //Validations
            //if (!id_user) return res.status(400).json( {message: "Id required"});

            const carts = await CartModel.find()
            const cart =  carts.filter(cart=>cart.idBD==id_user)
            console.log(`get cart: ${cart}`)
            // if(!cart[0]){
            // logInfo.info('Cart does not exits')
            // return cart[0]
            // }else{
                return cart
            //}
        } catch(err) {
            errorLogger.error(`error to obtain a Cart, getByIdUser: ${err}`);
            //return res.status(404).json({ message: 'cart does not exits'});
        }
    }



    getItemById = async (req,res) => {

        try {
            
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json( {message: "Id required"});
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: "Product ID required"});
            let seeProduct = await CartModel.findOne({ id: id})
            let item = seeProduct.products.find(id_prod)
            if(!item){return res.status(200).json({message:"ok",data:item})}
        }catch(err){
            errorLogger.error(`no se encontró item ${err}`)

        }

    }

    //add a product in a cart 
    updateById= async (req, res) => {

        try {
            
            const { id_user } = req.params
            if (!id_user) return res.status(400).json( {message: "Id required"});
            await this.#createCart(id_user)
            
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: " Product ID required"});

            //let newProduct= await book.getBook(id_prod);

            //let newProduct= await this.#getProduct(id_prod)
            //let newProduct= await ProductModel.findById(id_prod);
            let newProduct = await ProductModel.findOne({id:id_prod})
            //console.log(`Np: ${newProduct}`)
            //ToDo: add minus stock


            //const thisUser = await userModel.findById(id_user);
            //const updated = await CartModel.find({ user: thisUser }).populate("products",{_id:1});

            const cart = await CartModel.findOne({idDB:id_user});
            //console.log(cart.products)

            //const cart = cartArray[0]
            //flag for know if the product is inside of cart
            let inside = false

            for (const prod of cart.products) {
                if(prod.id == id_prod) {

                    console.log("entró")
                    inside = true;
                    cart.totalItems += 1//parseInt(prod.cantidad);
                    cart.totalPrice += prod.price
                    prod.quantity += 1

                    
                    cart.save()
                    logInfo.info(`added in cart again: ${prod.name}  ruta /carts/id_user/products/id_prod`)
                    //return res.render('purchase',{message: `Se agregó el producto al carrito`})
                    return this.#renderPurchase(req.user)
                    
                }
            }

            if(inside==false){

            cart.totalPrice +=newProduct.price
            cart.totalItems +=1
            newProduct.quantity+=1
            newProduct.userId=id_user
            //cart.products.push(newProduct)
            await cart.save()
            await CartModel.findOneAndUpdate( {idDB:id_user},
                {$push: {
                        'products':newProduct,
                        },
                })
            logInfo.info(`added to cart: ${newProduct.name}  ruta /carts/id_user/products/id_prod`)
            }
            //return this.#renderPurchase(res,req.user)
            return res.status(200)
            //return res.redirect('/purchase',{message: `Se agregó el producto al carrito`})
        } catch(err) {
            errorLogger.error("error to add item, function updateById")
            return res.render('errors',{message:err,route: "session/purchase",zone:"compras"})
            
        }
    }

    //delete a product from a cart

    deleteById =async (req,res)=> {
        try{
            const { id } = req.params;
            if (!id) return res.status(400).json( {message: "Id required"});
            const { id_prod } = req.params;
            if (!id_prod) return res.status(400).json( {message: "Product Id required"});
            const deleted = await CartModel.updateOne({idBd: id}, {$pull: {products: id_prod }})
            await deleted.save();
            // let arrayProducts = await CartModel.find({idBD:id})
            // let products= arrayProducts.products
            // let update= products.filter(product =>product.idBD === id_prod)
            //let cart = await CartModel.findOneAndUpdate({user:id}, { $set:{product: update}}, {new: true}, {

            //});



            return res.status(200).json({ message: 'Product deleted!', data: deleted})
            }catch(err) {
                    console.log(err);
                    return res.status(404).json({ message: 'Failed to delete product'})
            }
    }
    // deleteById = async (req,res) => {
    //     try {
    //         const { id } = req.params;
    //         if (!id) return res.status(400).json( {message: "Id required"});
    //         const { id_prod } = req.params;
    //         if (!id_prod) return res.status(400).json( {message: "Product Id required"});

    //         const deleted = await CartModel.findByIdAndUpdate(id,
    //             {$pull: {
    //                     products:{_id:id_prod}
    //                     }
    //             },
    //             { safe: true }
    //         );

    //         return res.status(200).json({ message: 'Product deleted!', data: deleted})
    //     } catch(err) {
    //         console.log(err);
    //         return res.status(404).json({ message: 'Failed to delete product'})
    //     }
    // }

    //delete a cart
    deleteCart = async (req,res) => {
        try {
            const { id } = req.params
            if (!id) return res.status(400).json( {message: "Cart Id required"});
            const cartDeleted = await CartModel.findByIdAndDelete(id)
            if (!cartDeleted) return res.status(404).json({ message: 'Cart does not exists'})
            return res.status(200).json({ message: 'Cart deleted!', data: cartDeleted})
        }catch(err){return res.status(404).json({ message: 'Failed to delete cart'})}
    }

    async getAll(req , res) {

        const carts = await CartModel.find()
        
        return res.status(200).json({data:carts})
    }

    async getAllCarts(req , res) {

        const carts = await CartModel.find()
        return carts
        //return res.status(200).json({data:carts})
    }

    
}

export default new Cart();
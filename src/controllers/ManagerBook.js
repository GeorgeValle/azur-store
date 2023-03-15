import '../loaders/connection.js';
import ProductModel from '../models/ProductModel.js'
import {logInfo, errorLogger} from '../utils/Logger.js'


//create the new class Book
class Book{
    //IIEF
    
    validationsProduct(product){
        if(!product.name||!product.price||!product.stock||!product.description||!product.code||!product.thumbnail||!product.category) return{status:400, message: "all data fields is required"};
    }

    //save a product from thunder client
    async saveData(req, res) {
        try{    
                const product = await ProductModel.create(req.body)
                logInfo.info(`Product created: ${req.body.name}  route /products/new`)

                return res.status(200).json({message:"Product created", data:product})
            }catch(err){
                return res.status(400).json({message: err, route: "session/inputProduct", zone: "Load of products"})
            }
        }
    

        //save a product from Frontend
    async saveDataFront(req, res) {
    try{    
            await ProductModel.create(req.body)
            logInfo.info(`Product created: ${req.body.name}  route /products`)
            return res.render('input-product',{user: req.user.name, message: "producto creado"})
            
        }catch(err){
            
            return res.render('errors',{message: err, route: "session/inputProduct", zone: "Carga de productos"})
            
        }
    }

        //get all from thunder client
    async getAll(req , res) {
        try{
        const products = await ProductModel.find()
        return res.status(200).json({message: "list of products:", data:products})
        }catch(err){
            return res.status(404).json({message: "products not found"})
        }
    }

    //Function: obtain an array of products
    async getAllP(req , res) {

        try{
        const products = await ProductModel.find()
        return products
        }
        catch(err){res.send({message:err})}
    }

    // get a product from thunder client
    async getById(req, res) {
        
        try {
            const { id } = req.params
            //Validations
            if (!id) return res.status(400).json({message: "Id required"});

            const product= await ProductModel.findById(id)
            if (!product) return res.status(404).json({ message: 'Product does not exist'})
            return res.status(200).json(product)
        } catch(err) {
            return res.status(404).json({ message: 'Product does not exist'})
        }

    }

    //this function give a product book
    getBook= async (id_product) => {
        
        if (!id_product) return {message: "Id required"};
        try{
            const product= await ProductModel.findById(id_product)
            if (!product) return { message: 'Product does not exist'}
                return product;
        }catch (err){
            errorLogger.error(`error in obtain a book: ${err}`)
        }
    }
    
    //update from thunder client
    updateById= async (req , res) => {
        try {
            const { id } = req.params
            //Validations
            this.validationsProduct(req.body);
            if (!id) return res.status(400).json( {message: "Id required"});
            await ProductModel.findByIdAndUpdate(id, req.body)
            return res.status(200).json({ message: 'Product updated!'})
        } catch(err) {
            return res.status(404).json({ message: 'Failed to update product'})
        }
    }
    //delete one by Id From thunder client
    deleteById = async (req,res) => {
        try {
            const { id } = req.params
            if (!id) return res.status(400).json( {message: "Id required"});
            const productDeleted = await ProductModel.findByIdAndDelete(id)
            if (!productDeleted) return res.status(404).json({ message: 'Product does not exists'})
            return res.status(200).json({ message: 'Product deleted!'})
        }catch(err){return res.status(404).json({ message: 'Failed to delete product'})}
    }

}
export default new Book();
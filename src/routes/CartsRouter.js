import {Router} from 'express';

const routes= Router();

import cart from '../controllers/ManagerCart.js';
//********************************************** */

//create a new instance of the managerCart from thunder client, 
routes.post('/:id_user',cart.createOneCart)

//push a product in a cart and create cart if not exist from frontend
routes.get('/:id_user/products/:id_prod', cart.updateByIdFront)

//push a product in a cart and create cart if not exist from thunder client
routes.put('/:id_user/products/:id_prod', cart.updateById)

//get a Cart by identifier from thunder client
routes.get('/user/:id_user', cart.getById)

//get a item of a cart from thunder client
routes.get('/user/:id_user/products/:id_prod', cart.getItemById)

//get a product of the cart from thunder client
routes.get('/', cart.getAll)

//delete a Cart by identifier
routes.delete('/:id_user', cart.deleteCart)

//delete one cart by user ID from frontend
routes.get('/delete/:id', cart.deleteCartFront)

//delete product by identifier from thunder client
routes.delete('/:id/products/:id_prod', cart.deleteById)

//delete product by identifier from the frontend
routes.get('/delete/:id/products/:id_prod', cart.deleteByIdFront)

const cartRouter = routes
export {cartRouter}
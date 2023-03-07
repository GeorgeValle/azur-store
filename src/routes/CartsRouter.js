import {Router} from 'express';


const routes= Router();

//********************************************** */
//below, you can configure the type of storage

import cart from '../controllers/ManagerCart.js';
// import cart from'../controllers/ManagerBookFire.js';
//dynamic import:
//const book = await import('../controllers/ManagerBook.js');
//book.default();


//create a new instance of the managerCart, Important!: only put id of product book
routes.post('/', cart.saveData)

//insert a new product in a cart
routes.put('/:id/productos/:id_prod', cart.updateById)

//get a Cart by identifier
routes.get('/:id', cart.getById)

//get a list of carts
routes.get('/', cart.getAll)

//delete a Cart by identifier
routes.delete('/:id', cart.deleteCart)

//delete product by identifier
routes.delete('/:id/productos/:id_prod', cart.deleteById)

const cartRouter = routes
export {cartRouter}
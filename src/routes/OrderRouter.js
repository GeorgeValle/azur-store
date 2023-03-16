import {Router} from 'express';

const routes= Router();

import order from '../controllers/ManagerOrder.js';

//create a new order whit the data of a cart from Thunder client
routes.post('/:id_user', order.createOrder)

//get an order by number of order
routes.get('/:num_order', order.getOrder)

//get many orders by id_user
routes.get('/:id_user', order.getOrdersByUser)


const orderRouter = routes
export {orderRouter}
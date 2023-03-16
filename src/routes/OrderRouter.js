import {Router} from 'express';

const routes= Router();

import order from '../controllers/ManagerOrder.js';

//create a new order whit the data of a cart from Thunder client
routes.post('/:id_user', order.createOrder)

const orderRouter = routes
export {orderRouter}
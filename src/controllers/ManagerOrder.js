import '../loaders/connection.js';
import OrderModel from '../models/OrderModel.js';
import CartModel from '../models/CartModel.js';
import { mailToUser } from '../utils/Nodemailer.js';
import { logInfo, logger, errorLogger } from '../utils/Logger.js';

class Order {
    #normalizeProducts(products = []) {
        return (products || []).flat(Infinity).filter(
            (product) => product && typeof product === 'object' && !Array.isArray(product)
        );
    }

    #recalculateTotals(products = []) {
        const normalizedProducts = this.#normalizeProducts(products);

        const totalItems = normalizedProducts.reduce((acc, product) => {
            return acc + Number(product.quantity || 0);
        }, 0);

        const totalPrice = normalizedProducts.reduce((acc, product) => {
            return acc + Number(product.price || 0) * Number(product.quantity || 0);
        }, 0);

        return {
            products: normalizedProducts,
            totalItems,
            totalPrice,
        };
    }

    async #getNextOrderNumber() {
        const lastOrder = await OrderModel.findOne().sort({ numOrder: -1 });

        if (!lastOrder) {
            return 1;
        }

        return Number(lastOrder.numOrder || 0) + 1;
    }

    createOrder = async (req, res) => {
        try {
            const { id_user } = req.params;

            if (!id_user) {
                return res.status(400).json({
                    message: 'No se pudo procesar la orden.',
                });
            }

            const cart = await CartModel.findOne({ idUser: id_user });

            if (!cart) {
                return res.status(404).json({
                    message: 'No se encontró el carrito.',
                });
            }

            const { products, totalItems, totalPrice } = this.#recalculateTotals(cart.products);

            if (!products.length) {
                return res.status(400).json({
                    message: 'El carrito está vacío.',
                });
            }

            const nextOrderNumber = await this.#getNextOrderNumber();

            const newOrder = await OrderModel.create({
                numOrder: nextOrderNumber,
                products,
                email: cart.email,
                address: cart.address,
                totalItems,
                totalPrice,
                userId: cart.idUser,
                phone: cart.phone,
                state: 'generated',
            });

            let emailSent = false;

            try {
                await mailToUser(newOrder);
                emailSent = true;
            } catch (mailError) {
                errorLogger.error(`mail error in createOrder: ${mailError?.stack || mailError}`);
            }

            logger.info(`New Order ${nextOrderNumber} of user: ${cart.address} generated`);

            const cartDeleted = await CartModel.findOneAndDelete({ idUser: id_user });

            if (cartDeleted) {
                logInfo.info(`cart deleted: ${cartDeleted.idUser}`);
            }

            return res.status(200).json({
                message: emailSent
                    ? 'Orden generada correctamente.'
                    : 'Orden generada correctamente. El correo no pudo enviarse.',
                data: newOrder,
            });
        } catch (err) {
            errorLogger.error(`order createOrder failed: ${err?.stack || err}`);

            return res.status(500).json({
                message: 'No se pudo procesar la orden. Intentá nuevamente.',
            });
        }
    };

    getOrder = async (req, res) => {
        try {
            const { num_order } = req.params;

            if (!num_order) {
                return res.status(400).json({
                    message: 'Número de orden inválido.',
                });
            }

            const order = await OrderModel.findOne({ numOrder: num_order });

            if (!order) {
                return res.status(404).json({
                    message: 'Orden no encontrada.',
                });
            }

            return res.status(200).json({
                message: 'Orden encontrada.',
                data: order,
            });
        } catch (err) {
            errorLogger.error(`getOrder failed: ${err?.stack || err}`);

            return res.status(500).json({
                message: 'No se pudo obtener la orden.',
            });
        }
    };

    getOrdersByUser = async (req, res) => {
        try {
            const { id_user } = req.params;

            if (!id_user) {
                return res.status(400).json({
                    message: 'Usuario inválido.',
                });
            }

            const orders = await OrderModel.find({ userId: id_user }).sort({ numOrder: -1 });

            return res.status(200).json({
                message: 'Órdenes del usuario.',
                data: orders,
            });
        } catch (err) {
            errorLogger.error(`getOrdersByUser failed: ${err?.stack || err}`);

            return res.status(500).json({
                message: 'No se pudieron obtener las órdenes.',
            });
        }
    };
}

export default new Order();
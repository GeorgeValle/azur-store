import '../loaders/connection.js';
import CartModel from '../models/CartModel.js';
import { logInfo, errorLogger } from '../utils/Logger.js';
import { userModel } from '../models/Users.js';
import ProductModel from '../models/ProductModel.js';

class Cart {
    #normalizeProducts(products = []) {
        return (products || []).flat(Infinity).filter(
            (product) => product && typeof product === 'object' && !Array.isArray(product)
        );
    }

    #recalculateCart(cart) {
        const normalizedProducts = this.#normalizeProducts(cart.products);

        cart.products = normalizedProducts;

        cart.totalItems = normalizedProducts.reduce((acc, product) => {
            return acc + Number(product.quantity || 0);
        }, 0);

        cart.totalPrice = normalizedProducts.reduce((acc, product) => {
            return acc + Number(product.price || 0) * Number(product.quantity || 0);
        }, 0);

        return cart;
    }

    async #createCart(id_user) {
        try {
            const user = await userModel.findById(id_user);

            if (!user) {
                throw new Error('User not found');
            }

            let cart = await CartModel.findOne({ idUser: id_user });

            if (!cart) {
                cart = await CartModel.create({
                    idUser: id_user,
                    address: user.address,
                    email: user.username,
                    phone: user.phone,
                    products: [],
                    totalItems: 0,
                    totalPrice: 0,
                });

                logInfo.info(`Cart of ${user.name} created`);
            }

            return cart;
        } catch (err) {
            errorLogger.error(`cart not created ${err}`);
            throw err;
        }
    }

    async #getCartOrCreate(id_user) {
        let cart = await CartModel.findOne({ idUser: id_user });

        if (!cart) {
            cart = await this.#createCart(id_user);
        }

        return cart;
    }

    #buildCartProduct(product, id_user) {
        return {
            _id: product._id,
            name: product.name,
            price: Number(product.price || 0),
            stock: Number(product.stock || 0),
            description: product.description || '',
            code: product.code,
            thumbnail: product.thumbnail || '',
            category: product.category || '',
            quantity: 1,
            userId: id_user,
        };
    }

    async #addProductToCart(id_user, id_prod) {
        const cart = await this.#getCartOrCreate(id_user);
        const product = await ProductModel.findById(id_prod);

        if (!product) {
            throw new Error('Product not found');
        }

        cart.products = this.#normalizeProducts(cart.products);

        const existingProduct = cart.products.find(
            (item) => String(item._id) === String(id_prod)
        );

        if (existingProduct) {
            existingProduct.quantity = Number(existingProduct.quantity || 0) + 1;
        } else {
            cart.products.push(this.#buildCartProduct(product, id_user));
        }

        this.#recalculateCart(cart);
        await cart.save();

        return cart;
    }

    async #removeProductFromCart(id_user, id_prod) {
        const cart = await CartModel.findOne({ idUser: id_user });

        if (!cart) {
            throw new Error('Cart does not exist');
        }

        cart.products = this.#normalizeProducts(cart.products);

        const nextProducts = cart.products.filter(
            (item) => String(item._id) !== String(id_prod)
        );

        cart.products = nextProducts;
        this.#recalculateCart(cart);
        await cart.save();

        return cart;
    }

    //create one cart with a id_user from params
    createOneCart = async (req, res) => {
        try {
            const { id_user } = req.params;

            if (!id_user) {
                return res.status(400).json({ message: 'Id required' });
            }

            const cart = await this.#getCartOrCreate(id_user);
            return res.status(200).json({ data: cart });
        } catch (err) {
            errorLogger.error(`cart not created ${err}`);
            return res.status(400).json({ message: `cart not created ${err}` });
        }
    };

    //obtain a cart with the id_user
    getById = async (req, res) => {
        try {
            const { id_user } = req.params;

            if (!id_user) {
                return res.status(400).json({ message: 'Id required' });
            }

            const cart = await CartModel.findOne({ idUser: id_user });

            if (!cart) {
                return res.status(404).json({ message: 'Cart does not exist' });
            }

            this.#recalculateCart(cart);

            return res.status(200).json({
                message: 'Cart found',
                data: cart,
            });
        } catch (err) {
            errorLogger.error(`error to obtain a Cart, getById: ${err}`);
            return res.status(404).json({ message: 'Cart does not exist' });
        }
    };

    //obtain one cart with an id_user
    getByIdUser = async (id_user) => {
        try {
            const cart = await CartModel.findOne({ idUser: id_user });

            if (!cart) {
                return null;
            }

            this.#recalculateCart(cart);
            return cart;
        } catch (err) {
            errorLogger.error(`error to obtain a Cart, getByIdUser: ${err}`);
            return null;
        }
    };

    //get an item of a cart from thunder client
    getItemById = async (req, res) => {
        try {
            const { id_user, id_prod } = req.params;

            if (!id_user) {
                return res.status(400).json({ message: 'Id required' });
            }

            if (!id_prod) {
                return res.status(400).json({ message: 'Product ID required' });
            }

            const cart = await CartModel.findOne({ idUser: id_user });

            if (!cart) {
                return res.status(404).json({ message: 'Cart does not exist' });
            }

            const products = this.#normalizeProducts(cart.products);

            const item = products.find(
                (product) => String(product._id) === String(id_prod)
            );

            if (!item) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            return res.status(200).json({ message: 'ok', data: item });
        } catch (err) {
            errorLogger.error(`no se encontró item ${err}`);
            return res.status(400).json({ message: `no se encontró item ${err}` });
        }
    };

    //add a product in a cart from thunder client
    updateById = async (req, res) => {
        try {
            const { id_user, id_prod } = req.params;

            if (!id_user) {
                return res.status(400).json({ message: 'Id required' });
            }

            if (!id_prod) {
                return res.status(400).json({ message: 'Product ID required' });
            }

            const cart = await this.#addProductToCart(id_user, id_prod);

            logInfo.info('added to cart: ruta /carts/id_user/products/id_prod');
            return res.status(200).json({
                message: 'Product added',
                data: cart,
            });
        } catch (err) {
            errorLogger.error(`error to add item, function updateById: ${err}`);
            return res.status(400).json({ message: 'Product not added' });
        }
    };

    //add a product in a cart from frontend legacy route
    updateByIdFront = async (req, res) => {
        try {
            const { id_user, id_prod } = req.params;

            if (!id_user) {
                return res.status(400).json({ message: 'Id required' });
            }

            if (!id_prod) {
                return res.status(400).json({ message: 'Product ID required' });
            }

            await this.#addProductToCart(id_user, id_prod);

            logInfo.info('added to cart: ruta /carts/id_user/products/id_prod');
            return res.redirect('/session/purchase?message=Item agregado');
        } catch (err) {
            errorLogger.error(`error to add item, function updateByIdFront: ${err}`);
            return res.render('errors', {
                message: err,
                route: 'session/purchase',
                zone: 'compras',
            });
        }
    };

    //delete a product from a cart from thunder client
    deleteById = async (req, res) => {
        try {
            const { id, id_prod } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'Id required' });
            }

            if (!id_prod) {
                return res.status(400).json({ message: 'Product Id required' });
            }

            const cart = await this.#removeProductFromCart(id, id_prod);

            return res.status(200).json({
                message: 'Product deleted!',
                data: cart,
            });
        } catch (err) {
            return res.status(404).json({
                message: `Failed to delete product: ${err.message || err}`,
            });
        }
    };

    //delete a product from a cart from frontend legacy route
    deleteByIdFront = async (req, res) => {
        try {
            const { id, id_prod } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'Id required' });
            }

            if (!id_prod) {
                return res.status(400).json({ message: 'Product Id required' });
            }

            await this.#removeProductFromCart(id, id_prod);

            logInfo.info('Product deleted ruta /carts/id_user/products/id_prod');
            return res.redirect('/session/cart');
        } catch (err) {
            errorLogger.error(`error to delete item, function deleteByIdFront: ${err}`);
            return res.redirect('/session/cart');
        }
    };

    //delete a cart from thunder client
    deleteCart = async (req, res) => {
        try {
            const { id_user } = req.params;

            if (!id_user) {
                return res.status(400).json({ message: 'Cart Id required' });
            }

            const cartDeleted = await CartModel.findOneAndDelete({ idUser: id_user });

            if (!cartDeleted) {
                return res.status(404).json({ message: 'Cart does not exist' });
            }

            return res.status(200).json({
                message: 'Cart deleted!',
                data: cartDeleted,
            });
        } catch (err) {
            return res.status(404).json({ message: 'Failed to delete cart' });
        }
    };

    //delete cart from Frontend legacy route
    deleteCartFront = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'Cart Id required' });
            }

            const cartDeleted = await CartModel.findByIdAndDelete(id);

            if (!cartDeleted) {
                return res.status(404).json({ message: 'Cart does not exist' });
            }

            logInfo.info('cart deleted ruta /carts/delete/:id');
            return res.status(200).json({
                message: 'Cart deleted!',
                data: cartDeleted,
            });
        } catch (err) {
            errorLogger.error('Failed to delete cart, route /carts/delete/:id');
            return res.status(500).json({ message: 'Failed to delete cart' });
        }
    };

    //obtain a list of carts from thunder client
    async getAll(req, res) {
        try {
            const carts = await CartModel.find();

            const normalizedCarts = carts.map((cart) => {
                this.#recalculateCart(cart);
                return cart;
            });

            return res.status(200).json({
                message: 'all carts:',
                data: normalizedCarts,
            });
        } catch (err) {
            errorLogger.error(`error to obtain carts: ${err}`);
            return res.status(500).json({ message: 'Failed to get carts' });
        }
    }

    //obtain a list of carts
    async getAllCarts() {
        try {
            const carts = await CartModel.find();

            return carts.map((cart) => {
                this.#recalculateCart(cart);
                return cart;
            });
        } catch (err) {
            errorLogger.error(`error to obtain carts: ${err}`);
            return [];
        }
    }
}

export default new Cart();
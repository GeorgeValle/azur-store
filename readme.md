# Azur Store

## `Introducción`

* Está store está orientada a la venta de libros físicos. 

* para instalar las liberias hay que clonar este proyecto desde el link: https://github.com/GeorgeValle/azur-store.git

* a continuación debe tener instalado NPM y Node JS. Luego, ejecutar desde la terminal del IDE npm i para que se instalen todas las dependencias y liberias.

## Listado de rutas para consultas

[nota] Hay rutas propias para el front y otras para utilizarlas con un cliente de consultas de APIs como thunder client o Postman.

### Rutas de products

* Con thunder client:

```javascript
//create a new instance of the product Book from thunder client
routes.post '/products/new'

//get all books thunder client
routes.get '/products/'

//get a book by identifier
routes.get '/products/:id'

// get for category
routes.get '/products/category/:category' 

//update by identifier from thunder client
routes.put '/products/:id'

//delete one by Id From thunder client
routes.delete '/products/:id'
```

* con el Front

```javascript
//create a new instance of the product Book from frontend
routes.post '/products/'
```
### Rutas de carts

* Con thunder client:

```javascript
//create a new instance of the managerCart from thunder client, 
routes.post '/carts/:id_user' 

//push a product in a cart and create cart if not exist from thunder client
routes.put '/carts/:id_user/products/:id_prod'

//get a Cart by identifier from thunder client
routes.get '/carts/user/:id_user'

//get a item of a cart from thunder client
routes.get '/carts/user/:id_user/products/:id_prod'

//obtain a list of carts from thunder client
routes.get '/carts/', 

//delete a Cart by identifier from thunder client
routes.delete '/carts/:id_user'

//delete product by identifier from thunder client
routes.delete '/carts/:id/products/:id_prod'

```

```javascript

//push a product in a cart and create cart if not exist from frontend
routes.get '/carts/:id_user/products/:id_prod'

//delete one cart by user ID from frontend
routes.get '/carts/delete/:id'

```
### Rutas de orders

* Con thunder client:

```javascript
// create a order whit id_user and delete these is cart
routes.post '/orders/:id_user'

//get an order by number of order
routes.get '/orders/:num_order'

//get many orders by id_user
routes.get '/orders/:id_user'
```

### Rutas de sesion

[nota] Estas rutas gestionan la navegación por el front

```javascript
// enter in view home or sesion purchase(page for buy) if is login
route.get '/session/'
    

//enter in view register
route.get '/session/register'
    

//create an user by form 
route.post '/session/register'

//enter in view login or redirect  to purchase if login
route.get '/session/login'
    

//login an user and redirect tu purchase
route.post '/session/login' 

// only an admin input products in this view
route.get '/session/inputProduct'
[nota]//for create an user admin just change the field admin to true in db User.

// enter en view logout and redirect to delete /session/logout
route.get '/session/logout'

//route for logout passport session
route.delete '/session/logout'

// fail login view
route.get '/failureLogin' 
    

// fail login view
route.post '/failureLogin' 
     

// fail signup view
route.get '/failureRegister' 
     

// fail signup view
route.post '/failureRegister' 
     

//enter in the view purchase or redirect to view login
route.get '/session/purchase'

//enter in the view cart
route.get '/session/cart' 
    






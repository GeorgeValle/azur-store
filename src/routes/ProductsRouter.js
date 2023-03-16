import {Router} from 'express';

const routes= Router();

//casting class book
import book from'../controllers/ManagerBook.js';


//let isAdmin=true;

//route the test server
routes.get('/health', (req, res) => {
    return res.status(200).json({ message: 'Server is on... '})
})

//create a new instance of the product Book from frontend
routes.post('/',book.saveDataFront)

//create a new instance of the product Book from thunder client
routes.post('/new',book.saveData)



//get all books thunder client
routes.get('/', book.getAll)

//get a book by identifier
routes.get('/:id', book.getById)

//update by identifier
routes.put('/:id', book.updateById)

//delete by identifier
routes.delete('/:id', book.deleteById)



const productRouter = routes;
export {productRouter};
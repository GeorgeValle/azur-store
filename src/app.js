//Dotenv config
import dotenv from 'dotenv';
dotenv.config();

//server Express
import express from 'express';

//import of passport
import passport from 'passport';
import { initializePassport } from "./strategies/local.js";

import session from 'express-session';
//import MongoStore
import './loaders/connection.js';
import MongoStore from 'connect-mongo';
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

//import handlebars
import { engine } from 'express-handlebars';

//import routes
import {productRouter} from './routes/ProductsRouter.js';
import {cartRouter} from './routes/CartsRouter.js';
import {sessionRouter} from './routes/SessionRouter.js';


//configuration of port whit fork o cluster mode
const PORT = parseInt(process.argv[2]) || 8080
const modoCluster = process.argv[3] == 'CLUSTER'

//configure express
//const app = express();
const app = express();

if (modoCluster && cluster.isPrimary) {
    const numCPUs = cpus().length

    console.log(`Número de procesadores: ${numCPUs}`)
    console.log(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
} else {
    //const app = express()



const server = app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`)
    console.log(`PID WORKER ${process.pid}`)
});

server.on('error', error => console.log(`error in server: ${error} `));

//middleware of json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Mongo configuration
app.use(session({
    store: MongoStore.create({ 
        mongoUrl: process.env.DB_ATLAS,
        mongoOptions: advancedOptions,
        dbName: 'passport-auth',
        collectionName: 'session',
        ttl: 1200
    }),
        key: 'user_sid',
        secret: 'library',
        resave:false,
        saveUninitialized: false,
        // cookie:{
        //     maxAge: 60000
        // }
}))


app.use('/content', express.static('./src/public'))

//handlebars configuration
//views client side
app.engine('handlebars', engine())
// app.set('views', './src/views')
app.set('views', './src/views') 
app.set('view engine', 'handlebars')




//passport initialization
// passport.use('register', registerStrategy)
// passport.use('login', loginStrategy)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.get('/', 
    (req, res) => res.redirect('/session')   
)

app.get('/home',(req, res)=>{
    if(req.isAuthenticated()){

        res.redirect('/session/purchase')

    }
    else{ res.redirect('/')}
})

    //routes to books and carts
app.use('/products',productRouter);
app.use('/carts',cartRouter);
app.use('/session',sessionRouter);

//for message in inexistent routes
app.use((req, res) => {
    res.status(404).send({error: -2, description: `route ${req.baseUrl}${req.url} method ${req.method} not implemented`});
});

app.use((error, req , res, next)=>{
	res.status(400).json({
		status: 'error',
		message: error.message
	})
})

}




export default app;
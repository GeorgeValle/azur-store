import passport from 'passport';
import local from 'passport-local';
import { userModel } from '../models/Users.js';
import { createHash, isValid } from '../utils/bcrypt.js';
import {createUserValidation} from '../utils/Validations.js';
import {logger, errorLogger} from '../utils/Logger.js';
import {mailToDev} from '../utils/Nodemailer.js';

const LocalStrategy = local.Strategy;

export const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true },
            async (req, username, password, done) => {
                try {
                    let user = await userModel.findOne({ username: username })
                    if (user){//error, data
                        errorLogger.error(`Ya existe el usuario: ${username}`) 
                        return done(null, false) 
                        }
                    const newUser = {
                        username,
                        password: createHash(password),
                        name: req.body.name,
                        address: req.body.address,
                        age: req.body.age,
                        phone: req.body.phone,
                        avatar: req.body.avatar
                    }
                    try{

                        
                        createUserValidation(newUser)
                    }
                    catch(err){
                        errorLogger.error(err)
                        return done(null,false)
                    }
                    try {
                        logger.info(`Se ha registrado el usuario ${newUser.username}`)
                        let result = await userModel.create(newUser)
                        mailToDev();
                        return done(null, result)
                    } catch (err) {
                        errorLogger.error(err)
                        done(err)
                    }
                } catch(err) {
                    errorLogger.error(err)
                    done(err)
                }
            }
        )
    )


    passport.use(
        'login',
        new LocalStrategy(
            async(username, password, done) => {
                try {
                    let user = await userModel.findOne({ username: username })
                    if (!user) {
                        errorLogger.error(`No se encontró al usuario ${username}`)
                        return done(null, false)
                    }
                    if (!isValid(user, password)){ 
                        errorLogger.error(`Password incorrecto `)
                        return done(null, false, {message: 'Wrong password'})
                    }
                    return done(null, user)
                } catch(err) {
                    errorLogger.error(err)
                    return done(err)
                }
            }
        )
    )

    //va a identificar por el id en la base de datos mongo, va a enlazar al usaurio con su id
    //este solo es data y guarda solo el id
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    //a traves de un id va a conectar y saber cual es el usuario,
    // este con el id, pueda consultar el resto de los datos que tiene la base de datos.
    passport.deserializeUser((id, done) => {
        userModel.findById(id, done)
    })

}

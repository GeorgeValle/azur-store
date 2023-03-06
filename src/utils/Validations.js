import * as yup from 'yup';


const createUserValidation = (data) => {
    const schema = yup.object().shape({
        // name: yup.string().min(5).matches(/^[a-z]+$/).required()
        username: yup
            .string('El campo email debe ser un string')
            .min(8, 'El campo email debe ser como mínimo de 5 caracteres de longitud')
            .email( 'El campo email debe tener el formato de Email: xxxx@xxxx.com')
            .required('El campo email es obligatorio'),
        password: yup
            .string('El campo password debe ser un String')
            .required('El campo password es obligatorio'),
            name: yup
            .string('El campo name debe ser un string')
            .required('El campo nombre es obligatorio'),
            //.matches(/^[a-z]+$/, 'Unicamente letras'),
        address: yup
            .string('El campo address debe ser un string'),
        age: yup
            .number('El campo age debe ser numérico')
            .required('El campo edad es obligatorio')
            .positive('solo números positivos')
            .integer('solo números enteros'),
        phone: yup
            .number('El campo age debe ser numérico')
            .min(7,'Mínimo 7 números')
            .positive('solo números positivos'),
            
        avatar: yup
            .string('El campo name debe ser un string')
                    
    })
    schema.validateSync(data)
}

export {
    createUserValidation,
}
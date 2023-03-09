
import axios from 'axios'
import {logger} from '../utils/Logger.js'

let productsForm = document.getElementById('productsForm');


const handleSubmit =  (evt, form, route) => {
    evt.preventDefault()
    let formData = new FormData(form)
    let obj = {}
    formData.forEach((value, key) => obj[key]=value)
    
    axios.post(route,obj )
        .then(response => response.json())
        .then(() => form.reset())
        .catch(err =>{logger
                    .error(`intento fallido de carga de producto: ${err.message}`)})
}

productsForm.addEventListener('submit', (e) => handleSubmit(e, e.target, '/products'))


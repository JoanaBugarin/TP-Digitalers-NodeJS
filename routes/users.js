const express = require('express')
const User = require('../models/user')
const storage = require('node-sessionstorage')
const router = express.Router()
//const hashmap = require('../tools/hashmap')

//Obtenemos nuevo usuario
router.get('/register', (req, res)=>{
    res.render('articles/register', {user: new User()})
})

//Registrar nuevo usuario
router.post('/', async(req, res, next)=>{
    req.user = new User()
    next()
},saveUserAndRedirect('register'))

//Guardar usuario y redireccionar
function saveUserAndRedirect(path){
    return async(req, res)=>{
        let user = req.user
        user.nickname = req.body.nickname
        user.password = req.body.password
        saveSessionData(user.nickname)
        try{
            user = await user.save()
            res.redirect(`/articles/dashboard`)
        }catch (e){
            res.render(`articles/${path}`)
        }
    }
}

function saveSessionData(nickname) {
    storage.setItem('nickname', nickname);
    console.log(storage.getItem('nickname'))
}


module.exports = router;
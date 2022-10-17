const express = require('express')
const User = require('../models/user')
const router = express.Router()

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
        saveSessionData(user.nickname, user.password)
        try{
            user = await user.save()
            res.redirect(`/articles/dashboard`)
        }catch (e){
            res.render(`articles/${path}`)
        }
    }
}

function saveSessionData(nickname, password) {
    sessionStorage.setItem('nickname', nickname);
    sessionStorage.setItem('password', password);
}


module.exports = router;
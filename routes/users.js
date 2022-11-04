const express = require('express')
const User = require('../models/user')
const storage = require('node-sessionstorage')
const router = express.Router()
const { check, validationResult } = require('express-validator');

//Obtenemos nuevo usuario
router.get('/register', (req, res)=>{
    res.render('articles/register', {user: new User()})
})

//Obtenemos usuario existente
router.get('/login', (req, res)=>{
    res.render('articles/login', {user: new User()})
})

//Iniciar sesión EN EDICIÓN
router.post('/login', [
        check('nickname')
        .exists()
        .isLength({min:2, max:20})
        .withMessage('El nickname debe contener al menos dos caracteres y veinte como máximo.'),
        check('password')
        .exists()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage('La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un caracter especial.')], 
        async(req, res, next)=>{
            const user = await User.findOne({ nickname: req.body.nickname, password: req.body.password });
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(req.body);
                const valores = req.body;
                const validaciones = errors.array();
                res.render('articles/login', {validaciones:validaciones, valores:valores});
            } 
            if (user == null) {   
                res.render('articles/login', {noMatch: 'Nickname y/o password incorrectos.'});
            } else {
                user.nickname = req.body.nickname
                user.password = req.body.password
                saveSessionData(user.nickname)
                res.redirect(`/articles/dashboard`)
            }
        })

//Desconectarse
router.get('/logout', (req, res)=>{
    storage.setItem('hasSession', 'false')
    res.redirect('/')
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
    storage.setItem('hasSession', 'true');
}


module.exports = router;
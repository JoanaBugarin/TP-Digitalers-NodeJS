const express = require('express')
const User = require('../models/user')
const storage = require('node-sessionstorage')
const router = express.Router()
//const hashmap = require('../tools/hashmap')

//Obtenemos nuevo usuario
router.get('/register', (req, res)=>{
    res.render('articles/register', {user: new User()})
})

//Obtenemos usuario existente
router.get('/login', (req, res)=>{
    res.render('articles/login', {user: new User()})
})

//Iniciar sesión EN EDICIÓN
router.post('/login', async(req, res, next)=>{
            const user = await User.findOne({ nickname: req.body.nickname, password: req.body.password });
            if (user == null) {   
                res.render('articles/login');
            } else {
                user.nickname = req.body.nickname
                user.password = req.body.password
                saveSessionData(user.nickname)
                res.redirect(`/articles/dashboard`)
            }
        })

//Mostrar gustos del usuario
router.get('/likes', async(req, res)=>{
    const online = storage.getItem('hasSession')
    if (online === 'true') {
        const username = storage.getItem('nickname')
        const user = await User.findOne({ nickname: username});
        res.render('articles/likes', {user: user, username: username});
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
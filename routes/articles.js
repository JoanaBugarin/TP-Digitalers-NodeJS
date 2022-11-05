const express = require('express')
const Article = require('../models/article')
const router = express.Router()
const storage = require('node-sessionstorage')

// Obtenemos Nuevo Articulo
router.get('/new', (req, res)=>{
    const online = storage.getItem('hasSession')
    if (online === 'true') {
        const username = storage.getItem('nickname')
        res.render('articles/new', {article: new Article(), username: username})
    } else {
        res.redirect('/')
    }
    
})

router.get('/dashboard', async(req, res)=> {
    const online = storage.getItem('hasSession')
    if (online === 'true') {
        const username = storage.getItem('nickname')
        const articles = await Article.find().sort({
            createdAt: "desc"
        });
        res.render('articles/dashboard', {articles: articles, username: username})
    } else {
        res.redirect('/')
    }
    
})

// Obtenemos el Articulo a editar
router.get('/edit/:id', async(req, res)=>{
    const online = storage.getItem('hasSession')
    if (online === 'true') {
        const username = storage.getItem('nickname')
        const article = await Article.findById(req.params.id)
        res.render('articles/edit', {article: article, username: username})
    } else {
        res.redirect('/')
    }
})

// Obtener el Articulo x Slug
router.get('/:slug', async(req, res)=>{
    const online = storage.getItem('hasSession')
    if (online === 'true') {
        const username = storage.getItem('nickname')
        const article = await Article.findOne({slug: req.params.slug})
        if(article== null)res.redirect('/')
        res.render('articles/show', {article: article, username: username})
    } else {
        res.redirect('/')
    }
})

// Crear Nuevo Articulo
router.post('/dashboard', async(req, res, next)=>{
    req.article = new Article()
    next()
},saveArticleAndRedirect('new'))

// Editar Articulo x ID
router.put('/:id', async(req, res, next)=>{
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

// Eliminar Articulo x ID
router.delete('/:id', async(req, res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/articles/dashboard')
})

router.post('/:id', async(req, res)=>{
    const online = storage.getItem('hasSession')
    if (online === 'true') {
        const username = storage.getItem('nickname')
        const article = await Article.findById(req.params.id)
        if(article == null)res.redirect('/')
        article.likes += 1;
        console.log(article.likes)
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }catch (e){
            const articles = await Article.find().sort({
                createdAt: "desc"
            });
            res.render(`articles/dashboard`, {article: article, username:username, articles: articles})
        }
    }
})


// Guardar Articulo y redirecciono
function saveArticleAndRedirect(path){
    return async(req, res)=>{
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.author = storage.getItem('nickname')
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }catch (e){
            res.render(`articles/${path}`, {article: article})
        }
    }
}


module.exports = router;
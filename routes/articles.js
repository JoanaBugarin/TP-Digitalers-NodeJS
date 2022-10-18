const express = require('express')
const Article = require('../models/article')
const router = express.Router()
const storage = require('node-sessionstorage')

// Obtenemos Nuevo Articulo
router.get('/new', (req, res)=>{
    res.render('articles/new', {article: new Article()})
})

router.get('/dashboard', async(req, res)=> {
    const username = storage.getItem('nickname')
    console.log(storage.getItem('nickname'))
    const articles = await Article.find().sort({
        createdAt: "desc"
    });
    res.render('articles/dashboard', {articles: articles, username: username})
    
})

// Obtenemos el Articulo a editar
router.get('/edit/:id', async(req, res)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article})
})

// Obtener el Articulo x Slug
router.get('/:slug', async(req, res)=>{
    const article = await Article.findOne({slug: req.params.slug})
    if(article== null)res.redirect('/')
    res.render('articles/show', {article: article})
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
    res.redirect('/')
})


// Guardar Articulo y redirecciono
function saveArticleAndRedirect(path){
    return async(req, res)=>{
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }catch (e){
            res.render(`articles/${path}`, {article: article})
        }
    }
}


module.exports = router;
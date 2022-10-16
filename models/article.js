const mongoose = require ('mongoose');
const { marked } = require('marked')
/*
SLUG= lo que viene desp de nuiestro dominio
ej: https://midominio.com/SLUG/ y se refiere
a una pag o publicación específica.
*/
const slugify = require('slugify')
/*
dompurify= desinfectar un fragmento de HTML,
eliminando cargas útiles XSS(cross site scripting)
*/
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
/* 
es un herramienta que nos permite recrear un DOM
dentro de un entorno en el que no contamos con un 
nevegador.
*/
const dompurify = createDOMPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        description: {
            type: String
        },
        markdown: {
            type: String,
            require: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        slug: {
            type: String,
            require: true,
            /* Construye indices únicos pero no
            es una validación */
            unique: true
        },
        sanitizedhtml: {
            type: String,
            require: true
        }
    },
    { versionKey: false }
)

// Middleware .pre()

articleSchema.pre('validate', function(next) {
    if (this.title){
        /*
        strict= elimina los caracteres especiales
        */
        this.slug = slugify(this.title, {lower: true, strict: true})
    }

    if (this.markdown){
        /*
        Lo que hacemos es convertir nuestro doc HTML y luego limpiar
        ese documento que le pasamos y se deshace de cualquier código 
        malisioso. 
        */
        this.sanitizedhtml = dompurify.sanitize(marked(this.markdown))
    }
    next();
});

module.exports = mongoose.model("Article", articleSchema)
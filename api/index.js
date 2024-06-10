import express from 'express'
import { config } from 'dotenv'
import fs from 'fs'
import swaggerUI from 'swagger-ui-express'

config() // carrega as variáveis do .env

const app = express()

// // Importa o módulo cors
import cors from 'cors'

const {PORT} = process.env
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

// //Import das rotas da aplicação
import RotasClinicas from './routes/clinica.js'
import RotasUsuarios from './routes/usuario.js'

// //Habilita o CORS Cross-Origin resource sharing
app.use(cors())

//Habilita o PARSE do JSON (conversão do arquivo)
app.use(express.json())

//Rota de conteúdo público
app.use('/', express.static('public'))

//Removendo o x-powered-by por segurança
app.disable('x-powered-by')

//Configurando o favicon
app.use('/favicon.ico', express.static('public/imagens/favicon.ico'))

//Rota default
app.get('/api', (req, res)=> {
    /* 
    * #swagger.tags = ['Default']
    * #swagger.summary = 'Rota default que retorna a versão da API'
    * #swagger.description = 'Endpoint que retorna a versão da API'    
    * #swagger.path = '/'
    * #swagger.method = 'GET'
    */
    res.status(200).json({
        message: 'API Projeto CalmaMente 100% funcional🚀',
        version: '1.4.2',
        doc: 'https://backend-rest-mongodb.vercel.app/api/doc'
    })
})

// //Rotas da API
app.use('/api/clinicas', RotasClinicas)
app.use('/api/usuarios', RotasUsuarios)

/* Rota da documentação Swagger */
app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./api/swagger/swagger_output.json')), {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL
}))

//Listen
app.listen(PORT, function(){
    console.log(`💻Servidor rodando na porta ${PORT}: http://localhost:${PORT}/`);
})

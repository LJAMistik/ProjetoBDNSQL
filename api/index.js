import express from 'express'
import {config} from 'dotenv'
config() // carrega as variáveis do .env

const app = express()

// // Importa o módulo cors
import cors from 'cors'

const {PORT} = process.env
// //Import das rotas da aplicação
import RotasClinicas from './routes/clinicas.js'

// //Habilita o CORS Cross-Origin resource sharing
app.use(cors())

//Habilita o PARSE do JSON (conversão do arquivo)
app.use(express.json())

//Rota de conteúdo público
app.use('/', express.static('public'))

//Removendo o x-powered-by por segurança
app.disable('x-powered-by')

//Configurando o favicon
app.use('/favicon.ico', express.static('public/images/favicon.ico'))

//Rota default
app.get('/api', (req, res)=> {
    res.status(200).json({
        message: 'API Projeto CalmaMente 100% funcional🚀',
        version: '1.0.0'
    })
})

// //Rotas da API
app.use('/api/clinicas', RotasClinicas)
//Listen
app.listen(PORT, function(){
    console.log(`💻Servidor rodando na porta ${PORT}`)
})

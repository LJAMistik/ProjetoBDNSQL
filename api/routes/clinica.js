import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'
import auth from '../middleware/auth.js'

const router = express.Router()

// Conectar ao banco de dados
const { db, ObjectId } = await connectToDatabase()
const nomeCollection = 'clinicas'

//############################################### VALIDAÇÕES DA CLINICA ##################################################
 
const validaClinicas = [
  check('nome')
    .notEmpty().trim().withMessage('O nome é obrigatório')
    .isLength({min:3}).withMessage('O nome é muito curto. Mínimo de 3 caracteres')  
    .isLength({max:200}).withMessage('O nome é muito longo. Máximo de 200 caracteres'),
  check('email')
    .notEmpty().trim().withMessage('O email é obrigatório')
    .isEmail().withMessage('Formato de email inválido'),
  check('data_cadastro')
    .notEmpty().withMessage('A data de cadastro é obrigatória')
    .toDate().withMessage('Formato de data inválido'),
  check('telefone')
    .notEmpty().trim().withMessage('O telefone é obrigatório')
    .isMobilePhone('pt-BR').withMessage('Formato de telefone inválido'),
  check('classificacao')
    .notEmpty().withMessage('A classificação é obrigatória')
    .isFloat({ min: 0, max: 10 }).withMessage('A classificação deve estar entre 0 e 10'),
  check('especialidades')
    .notEmpty().withMessage('As especialidades são obrigatórias')
    .isArray({ min: 1, max: 4 }).withMessage('Pelo menos uma especialidade deve ser selecionada, até no máximo 4'),
  check('endereco.cep')
    .isLength({min:9, max:9}).withMessage('O CEP informado é inválido') 
    .notEmpty().trim().withMessage('É obrigatório informar o CEP'),
  check('endereco.logradouro').notEmpty().withMessage('O Logradouro é obrigatório'),
  check('endereco.bairro').notEmpty().withMessage('O bairro é obrigatório'),
  check('endereco.cidade').notEmpty().withMessage('A cidade é obrigatória'),
  check('endereco.uf').isLength({min: 2, max:2}).withMessage('UF é inválida'),
  check('endereco.coordinates').isArray().withMessage('Coord. inválidas')
    .isFloat(),
  check('endereco.coordinates.*').isFloat().withMessage('Os valores das coordenadas devem ser números'),   
 ]


//##################################################### OPERAÇÕES DO POST #####################################################

/** POST /api/clinicas
 * Cria um nova clinica
 * Parâmetros: Objeto clínicas
 * Postman: http://localhost:4000/api/clinicas
*/

router.post('/', auth, validaClinicas, async(req, res) => {
  /**
 * #swagger.tags = ['Clínicas']
 * #swagger.summary = 'Cria uma nova clínica'
 * #swagger.description = 'Endpoint para criar uma nova clínica.'
 * #swagger.path = '/api/clinicas'
 * #swagger.method = 'POST'
  */
  try{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()})
    }
    const clinicas = await db.collection(nomeCollection).insertOne(req.body)
    res.status(201).json(clinicas)     
  } catch (err){
    res.status(500).json({message: `${err.message} Erro no Servidor`})
  }
})


//#################################################### OPERAÇÕES GET ###########################################################

/**
 * GET /api/clinicas
 * Lista todas clinicas
 * Parâmetros: limit, skip e order
*/

router.get('/', auth, async (req, res) => {
    /**
   * #swagger.tags = ['Clínicas']
   * #swagger.summary = 'Obtém a lista de clínicas'
   * #swagger.description = 'Endpoint para obter a lista de todas as clínicas disponíveis.'
   * #swagger.path = '/api/clinicas'
   * #swagger.method = 'GET'
   */
  const { limit, skip, order } = req.query
  try {
    const docs = []
    await db.collection(nomeCollection)
      .find()
      .limit(parseInt(limit) || 10)
      .skip(parseInt(skip) || 0)
      .sort({ [order]: 1 })
      .forEach((doc) => {
        docs.push(doc)
      })
    res.status(200).json(docs)
  } catch (err) {
    res.status(500).json(
      {
        message: 'Erro ao obter a listagem das clínicas',
        error: `${err.message}`
      })
  }
})

/**
 * GET /api/clinicas/id/:id
 * Lista as clinicas pelo id
 * Parâmetros: id
 * Postman: http://localhost:4000/api/clinicas/id/665732f64102325c983f4149
*/

router.get('/id/:id', auth, async (req, res) => {
  /**
 * #swagger.tags = ['Clínicas']
 * #swagger.summary = 'Obtém uma clínica pelo ID'
 * #swagger.description = 'Endpoint para obter os detalhes de uma clínica específica com base no ID fornecido.'
 * #swagger.path = '/api/clinicas/id/{id}'
 * #swagger.method = 'GET'
 */
  try {
    const docs = []
    await db.collection(nomeCollection)
      .find({ '_id': { $eq: new ObjectId(req.params.id) } }, {})
      .forEach((doc) => {
        docs.push(doc)
      })
    res.status(200).json(docs)
  } catch (err) {
    res.status(500).json({
      errors: [{
        value: `${err.message}`,
        msg: 'Erro ao obter a clínica pelo ID',
        param: '/id/:id'
      }]
    })
  }
})

/**
 * GET /api/clinicas/nome/:filtro
 * Lista as clínicas pelo nome
 * Parâmetros: filtro
 * Postman: http://localhost:4000/api/clinicas/nome/:filtro
 *  - em value: Clinica de Teste 123
*/

router.get('/nome/:filtro', auth, async (req, res) => {
    /**
   * #swagger.tags = ['Clínicas']
   * #swagger.summary = 'Obtém uma clínica pelo nome'
   * #swagger.description = 'Endpoint para obter os detalhes de uma clínica específica com base no nome fornecido.'
   * #swagger.path = '/api/clinicas/nome/{filtro}'
   * #swagger.method = 'GET'
   */
  try {
    const filtro = req.params.filtro.toString()
    const docs = []
    await db.collection(nomeCollection)
      .find({
        $or: [
            { 'nome': { $regex: filtro, $options: 'i' } }
        ]
      })
      .forEach((doc) => {
        docs.push(doc)
      })
    res.status(200).json(docs)
  } catch (err) {
    res.status(500).json({
      errors: [{
        value: `${err.message}`,
        msg: 'Erro ao obter a clínica pelo nome',
        param: '/razao/:filtro'
      }]
    })
  }
})

/**
 * GET /api/clinicas/especialidade/:especialidade
 * Lista as clinicas pela especialidade
 * Parâmetros: especialidade
 * Postman: http://localhost:4000/api/clinicas/especialidades/1/uf/SP
*/

router.get('/especialidades/:especialidade/uf/:uf', auth, async (req, res) => {
    /**
   * #swagger.tags = ['Clínicas']
   * #swagger.summary = 'Obtém clínicas por especialidade e UF'
   * #swagger.description = 'Endpoint para obter uma lista de clínicas com base na especialidade e UF fornecidas.'
   * #swagger.path = '/api/clinicas/especialidades/{especialidade}/uf/{uf}'
   * #swagger.method = 'GET'
   */
  try {
    const docs = []
    await db.collection(nomeCollection)
      .find({ 
        'especialidades': { $in: [req.params.especialidade.trim()] },
        'endereco.uf': req.params.uf.trim(),
        $or: [ 
          { 'classificacao': { $gte: 3 } }, 
          { 'telefone': { $ne: null } } 
        ]
      })
      .forEach((doc) => {
        docs.push(doc)
      })
    res.status(200).json(docs)
  } catch (err) {
    res.status(500).json({
      errors: [{
        value: `${err.message}`,
        msg: 'Erro ao obter as clínicas pela especialidade e UF',
        param: '/especialidades/:especialidade/uf/:uf'
      }]
    })
  }
})


//#################################################### OPERAÇÕES DO UPDATE #####################################################

/**
 * PUT /api/clinicas/:id
 * Altera uma clínica pelo _id
 * Parâmetros: Objeto clínica
 * Postman: http://localhost:4000/api/clinicas/
 *  - no body:
 * {
 *  "nome": "Qualquer"
 *  }
 */

router.put('/:id', auth, validaClinicas, async (req, res) => {
  /**
 * #swagger.tags = ['Clínicas']
 * #swagger.summary = 'Atualiza uma clínica'
 * #swagger.description = 'Endpoint para atualizar uma clínica existente.'
 * #swagger.path = '/api/clinicas/{id}'
 * #swagger.method = 'PUT'
 */
  const idDocumento = req.params.id // Obter o _id do parâmetro da URL
  delete req.body._id // Remover o _id do corpo da requisição
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const clinica = await db.collection(nomeCollection)
      .updateOne({ '_id': { $eq: new ObjectId(idDocumento) } },
                 { $set: req.body })
    res.status(202).json(clinica)         
  } catch (err) {
    res.status(500).json({ errors: err.message })
  }
})


//#################################################### OPERAÇÕES DO DELETE #####################################################

/**
 * DELETE /api/clinicas/:id
 * Remove a clínica pelo id
 * Parâmetros: id
 * Postman: http://localhost:4000/api/clinicas/6655f46f67c5f2d1607cda19
 * isso irá apagar a Clinica de Teste 2
 */

router.delete('/:id', auth, async(req, res) => {
  /**
 * #swagger.tags = ['Clínicas']
 * #swagger.summary = 'Exclui uma clínica'
 * #swagger.description = 'Endpoint para excluir uma clínica pelo ID.'
 * #swagger.path = '/api/clinicas/{id}'
 * #swagger.method = 'DELETE'
  */
  const result = await db.collection(nomeCollection).deleteOne({
    "_id": { $eq: new ObjectId(req.params.id)}
  })
  if (result.deletedCount === 0){
    res.status(404).json({
      errors: [{
        value: `Não há nenhuma clínica com o id ${req.params.id}`,
        msg: 'Erro ao excluir a clínica',
        param: '/:id'
      }]
    })
  } else {
    res.status(200).send(result)
  }
})

// Exportar o módulo de rotas
export default router

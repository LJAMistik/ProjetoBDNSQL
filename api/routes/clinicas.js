import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'

const router = express.Router()

// Conectar ao banco de dados

const { db, ObjectId } = await connectToDatabase()
const nomeCollection = 'clinicas'

const validaClinicas = [
check('nome')
  .notEmpty().trim().withMessage('O nome é obrigatório')
  .isLength({min:3}).withMessage('O nome é muito curto. Mínimo de 3')  
  .isLength({max:200}).withMessage('O nome é muito longo. Máximo de 200'),

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
  .isArray({ min: 1 }).withMessage('Pelo menos uma especialidade deve ser selecionada'),
  // .custom((value, { req }) => {
  //   const validEspecialidades = ['1', '2', '3']; // Especialidades válidas
  //   const invalidEspecialidades = value.filter(item => !validEspecialidades.includes(item));
  //   if (invalidEspecialidades.length > 0) {
  //     throw new Error('Especialidades inválidas');
  //   }
  //   return true;
  // }).withMessage('Especialidades inválidas'),

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

/**
 * GET /api/clinicas
 * Lista todas clinicas
 * Parâmetros: limit, skip e order
 */
router.get('/', async (req, res) => {
  const { limit, skip, order } = req.query //Obter da URL
  try {
    const docs = []
    await db.collection(nomeCollection)
      .find()
      .limit(parseInt(limit) || 10)
      .skip(parseInt(skip) || 0)
      .sort({ order: 1 })
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
 */
router.get('/id/:id', async (req, res) => {
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
        msg: 'Erro ao obter a clinica pelo ID',
        param: '/id/:id'
      }]
    })
  }
})
/**
 * GET /api/clinicas/razao/:filtro
 * Lista as clínicas pelo nome
 * Parâmetros: filtro
 */
router.get('/nome/:filtro', async (req, res) => {
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
 * DELETE /api/clinicas/:id
 * Remove a clínica pelo id
 * Parâmetros: id
 */
router.delete('/:id', async(req, res) => {
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

//  * POST /api/clinicas
//  * Insere um nova clinica
//  * Parâmetros: Objeto clínicas

router.post('/', validaClinicas, async(req, res) => {
  try{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()})
    }
    const clinicas = await db.collection(nomeCollection).insertOne(req.body)
    res.status(201).json(clinicas) //201 é o status created            
  } catch (err){
    res.status(500).json({message: `${err.message} Erro no Server`})
  }
})

/**
 * PUT /api/clinicas
 * Altera uma clinica pelo _id
 * Parâmetros: Objeto clinicas
 */
router.put('/', validaClinicas, async(req, res) => {
  let idDocumento = req.body._id //armazenamos o _id do documento
  delete req.body._id //removemos o _id do body que foi recebido na req.
  try {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
      }
      const clinica = await db.collection(nomeCollection)
      .updateOne({'_id': {$eq: new ObjectId(idDocumento)}},
                 {$set: req.body})
      res.status(202).json(clinica) //Accepted           
  } catch (err){
    res.status(500).json({errors: err.message})
  }
  console.log(idDocumento)
})

export default router
/*
* Testes na API - Usuários
* Tecnologias utilizadas:
* Supertest: Biblioteca para testes na API Rest do NodeJS
* dotenv: Biblioteca para gerenciar variáveis de ambiente
*/
const request = require('supertest')
const dotenv = require('dotenv')
dotenv.config() //carrega as variáveis do .env

const baseURL = 'http://localhost:4000/api'

describe('Testes de Registro de Usuario', () => {
    let token
    it('Faz o cadastro de um novo usuario no banco', async () => {
        const senha = process.env.SENHA_USUARIO
        const response = await request(baseURL)
        .post('/usuarios')
        .set('Content-Type', 'application/json')
        .send({nome:"Yara", email:"yara@teste.com", senha: senha})
        .expect(201) // Created
    })

    it('Faz Login e gera token jwt', async () => {
        const senha = process.env.SENHA_USUARIO
        const reponse = await request(baseURL)
        .post('/usuarios/login')
        .set('Content-Type', 'application/json')
        .send({email:"andre_silva@gmail.com.br", senha: senha})
        .expect(200); //OK

        token = reponse.body.access_token
        expect(token).toBeDefined() //verificação de recebimento de token
    })

    it('Verificação de email duplicado', async () => {
        const senha = process.env.SENHA_USUARIO
        await request(baseURL)
          .post('/usuarios')
          .set('Content-Type','application/json')
          .send({ email: 'test@example.com', nome: 'Teste', senha: senha });
    
        const response = await request(baseURL)
          .post('/usuarios')
          .set('Content-Type','application/json')
          .send({ email: 'test@example.com', nome: 'Outro Teste', senha: senha });
          
        expect(response.body.errors[0].msg).toBe(`o email já existe!`)
    })

    // it('Armazenamento seguro de senha', async () => {
    //     const senha = 'senhaForte123!';
    //     const email = 'secure@example.com';
    //     const nome = 'Usuário Seguro';
    
    //     await request(baseURL)
    //       .post('/usuarios')
    //       .set('Content-Type', 'application/json')
    //       .send({ email, nome, senha });
    
    //     const user = await db.collection('usuarios').findOne({ email });
    
    //     expect(user).not.toBeNull();
    //     expect(user.nome).toBe(nome);
    //     expect(user.email).toBe(email);
    
    //     const isPasswordMatch = await bcrypt.compare(senha, user.senha);
    //     expect(isPasswordMatch).toBe(true);
    // });
})
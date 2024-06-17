const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config(); // carrega as variáveis do .env

const baseURL = 'http://localhost:4000/api';

describe('Testes de Registro de Usuario', () => {
  let token;
  it('Faz o cadastro de um novo usuario no banco', async () => {
      const senha = process.env.SENHA_USUARIO;
      const response = await request(baseURL)
          .post('/usuarios')
          .set('Content-Type', 'application/json')
          .send({ nome: "Yara", email: "yara@teste.com", senha: senha })
          .expect(201); // Created
  });

    it('Verificação de email duplicado', async () => {
        const senha = 'Senh@Forte_2024';
        await request(baseURL)
            .post('/usuarios')
            .set('Content-Type', 'application/json')
            .send({ email: 'test@example.com', nome: 'Teste', senha: senha });

        const response = await request(baseURL)
            .post('/usuarios')
            .set('Content-Type', 'application/json')
            .send({ email: 'test@example.com', nome: 'Outro Teste', senha: senha });

        expect(response.body.errors[0].msg).toBe('o email já existe!');
    });

    it('Verificação de senha fraca (sem caracteres especiais)', async () => {
        const response = await request(baseURL)
            .post('/usuarios')
            .set('Content-Type', 'application/json')
            .send({ nome: "Test", email: "weak@teste.com", senha: "Weak123" });

        expect(response.body.errors[0].msg).toBe('A senha não é segura. Informe no mínimo 1 caractere maiúsculo, 1 minúsculo, 1 número e 1 caractere especial');
    });

    it('Verificação de senha fraca (sem números)', async () => {
        const response = await request(baseURL)
            .post('/usuarios')
            .set('Content-Type', 'application/json')
            .send({ nome: "Test", email: "weak@teste.com", senha: "SenhaForte!" });

        expect(response.body.errors[0].msg).toBe('A senha não é segura. Informe no mínimo 1 caractere maiúsculo, 1 minúsculo, 1 número e 1 caractere especial');
    });

    it('Verificação de senha fraca (sem letras maiúsculas)', async () => {
        const response = await request(baseURL)
            .post('/usuarios')
            .set('Content-Type', 'application/json')
            .send({ nome: "Test", email: "weak@teste.com", senha: "senha123!" });

        expect(response.body.errors[0].msg).toBe('A senha não é segura. Informe no mínimo 1 caractere maiúsculo, 1 minúsculo, 1 número e 1 caractere especial');
    });

    it('Verificação de senha fraca (sem letras minúsculas)', async () => {
        const response = await request(baseURL)
            .post('/usuarios')
            .set('Content-Type', 'application/json')
            .send({ nome: "Test", email: "weak@teste.com", senha: "SENHA123!" });

        expect(response.body.errors[0].msg).toBe('A senha não é segura. Informe no mínimo 1 caractere maiúsculo, 1 minúsculo, 1 número e 1 caractere especial');
    });
});
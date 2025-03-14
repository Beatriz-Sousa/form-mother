import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';

const app = express();
const db = new sqlite3.Database('./campanha.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados.');
    }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota para salvar os dados
app.post('/salvar', (req, res) => {
    const {
        nome,
        dataNascimento,
        cpf,
        telefone,
        email,
        logradouro,
        bairro,
        numero,
        cidade,
        estado,
        cep,
        numeroNota,
        cnpj,
        dataCompra,
        resposta
    } = req.body;

    db.serialize(() => {
        db.run(`INSERT INTO cliente (nome, data_nascimento, cpf, telefone, email) VALUES (?, ?, ?, ?, ?)`, 
            [nome, dataNascimento, cpf, telefone, email], function (err) {
            if (err) {
                return res.status(400).send('Erro ao salvar o cliente: ' + err.message);
            }

            const clienteId = this.lastID; // ID do cliente inserido

            db.run(`INSERT INTO endereco (cliente_id, logradouro, bairro, numero, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [clienteId, logradouro, bairro, numero, cidade, estado, cep], function (err) {
                if (err) {
                    return res.status(400).send('Erro ao salvar o endereço: ' + err.message);
                }
            });

            db.run(`INSERT INTO nota (cliente_id, numero_nota, cnpj_empresa, data_compra) VALUES (?, ?, ?, ?)`,
                [clienteId, numeroNota, cnpj, dataCompra], function (err) {
                if (err) {
                    return res.status(400).send('Erro ao salvar a nota fiscal: ' + err.message);
                }
            });

            db.run(`INSERT INTO pergunta (cliente_id, resposta) VALUES (?, ?)`,
                [clienteId, resposta], function (err) {
                if (err) {
                    return res.status(400).send('Erro ao salvar a resposta à pergunta: ' + err.message);
                }
            });

            res.send('Cadastro realizado com sucesso!');
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
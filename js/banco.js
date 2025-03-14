import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

// Abrir o banco de dados (será criado se não existir)
const db = new sqlite3.Database('./campanha.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados.');
    }
});

// Criar as tabelas
db.serialize(() => {
    // Tabela de Cliente
    db.run(`CREATE TABLE IF NOT EXISTS cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data_nascimento TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        telefone TEXT NOT NULL,
        email TEXT NOT NULL
    )`);

    // Tabela de Endereço
    db.run(`CREATE TABLE IF NOT EXISTS endereco (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        logradouro TEXT NOT NULL,
        bairro TEXT NOT NULL,
        numero TEXT NOT NULL,
        cidade TEXT NOT NULL,
        estado TEXT NOT NULL,
        cep TEXT NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES cliente(id)
    )`);

    // Tabela de Nota
    db.run(`CREATE TABLE IF NOT EXISTS nota (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        numero_nota TEXT NOT NULL,
        cnpj_empresa TEXT NOT NULL,
        data_compra TEXT NOT NULL,
        valor_compra REAL NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES cliente(id)
    )`);

    // Tabela de Pergunta (1:1)
    db.run(`CREATE TABLE IF NOT EXISTS pergunta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        resposta TEXT NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES cliente(id)
    )`);
});

module.exports = db;

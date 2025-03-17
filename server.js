import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();

// Configuração do CORS para permitir todas as origens
app.use(cors({
    origin: '*'  // Permite todas as origens
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const dbPromise = open({
    filename: './campanha.db',
    driver: sqlite3.Database
});

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Bloqueia CPFs inválidos como 111.111.111-11

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true;
}

// Função para validar data de nascimento
function validarDataNascimento(dataNascimento) {
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);

    // Verifica se a data é válida
    if (isNaN(dataNasc.getTime())) {
        return { valido: false, erro: "Data de nascimento inválida." };
    }

    // Calcula a idade
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    let mes = hoje.getMonth() - dataNasc.getMonth();
    let dia = hoje.getDate() - dataNasc.getDate();

    // Ajusta se ainda não fez aniversário no ano atual
    if (mes < 0 || (mes === 0 && dia < 0)) {
        idade--;
    }

    // Verifica idade mínima (exemplo: 18 anos)
    if (idade < 18) {
        return { valido: false, erro: "É necessário ter pelo menos 18 anos." };
    }

    // Verifica se a data é futura
    if (dataNasc > hoje) {
        return { valido: false, erro: "A data de nascimento não pode estar no futuro." };
    }

    return { valido: true };
}

// Rota para salvar os dados
app.post('/salvar', async (req, res) => {
    try {
        console.log("Dados recebidos no backend:", req.body);

        const {
            nome, dataNascimento, cpf, telefone, email,
            logradouro, bairro, numero, cidade, estado, cep,
            numeroNota, cnpj, dataCompra, resposta
        } = req.body;

        // Validar CPF
        if (!validarCPF(cpf)) {
            return res.status(400).json({ erro: "CPF inválido." });
        }

        // Validar data de nascimento
        const { valido, erro } = validarDataNascimento(dataNascimento);
        if (!valido) {
            return res.status(400).json({ erro });
        }

        const db = await dbPromise;

        // Verificar se o CPF já existe no banco
        const cpfExistente = await db.get("SELECT cpf FROM cliente WHERE cpf = ?", [cpf]);
        if (cpfExistente) {
            return res.status(400).json({ erro: "CPF já cadastrado." });
        }

        // Validar se a data da compra está dentro do período permitido
        const dataInicio = new Date('2025-05-01');
        const dataFim = new Date('2025-05-31');
        const dataDeCompra = new Date(dataCompra);

        if (dataDeCompra < dataInicio || dataDeCompra > dataFim) {
            return res.status(400).json({ erro: "A data da compra deve estar entre 01/05/2025 e 31/05/2025." });
        }

        // Inserir os dados no banco
        const result = await db.run(
            `INSERT INTO cliente (nome, data_nascimento, cpf, telefone, email) VALUES (?, ?, ?, ?, ?)`,
            [nome, dataNascimento, cpf, telefone, email]
        );

        const clienteId = result.lastID;

        await db.run(
            `INSERT INTO endereco (cliente_id, logradouro, bairro, numero, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [clienteId, logradouro, bairro, numero, cidade, estado, cep]
        );

        await db.run(
            `INSERT INTO nota (cliente_id, numero_nota, cnpj_empresa, data_compra) VALUES (?, ?, ?, ?)`,
            [clienteId, numeroNota, cnpj, dataCompra]
        );

        await db.run(
            `INSERT INTO pergunta (cliente_id, resposta) VALUES (?, ?)`,
            [clienteId, resposta]
        );

        res.json({ mensagem: "Cadastro realizado com sucesso!" });

    } catch (err) {
        console.error("Erro no servidor:", err);
        res.status(500).json({ erro: err.message }); // Exibe o erro real no JSON de resposta
    }
});

// Definir porta do servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
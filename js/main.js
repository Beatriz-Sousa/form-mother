document.addEventListener('DOMContentLoaded', function () {
    // Função para aplicar a máscara no CPF, CNPJ e CEP
    function aplicarMascara(event, tipo) {
        let input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remove tudo que não for número

        if (tipo === 'cpf') {
            // Máscara para CPF
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
            }
        } else if (tipo === 'cnpj') {
            // Máscara para CNPJ
            if (value.length <= 14) {
                value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
            }
        } else if (tipo === 'cep') {
            // Máscara para CEP
            if (value.length <= 8) {
                value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
            }
        }
        input.value = value;
    }

    // Aplicando as máscaras nos campos de CPF, CNPJ e CEP
    document.getElementById('cpfId').addEventListener('input', function(event) {
        aplicarMascara(event, 'cpf');
    });

    document.getElementById('cnpjId').addEventListener('input', function(event) {
        aplicarMascara(event, 'cnpj');
    });

    document.getElementById('cep').addEventListener('input', function(event) {
        aplicarMascara(event, 'cep');
    });

    // Função para validar o CPF
    function validarCPF(cpf) {
        const cpfLimpo = cpf.replace(/[^\d]+/g, '');

        if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
            return false;
        }

        let soma = 0;
        let peso = 10;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * peso--;
        }
        let resto = soma % 11;
        let digito1 = (resto < 2) ? 0 : 11 - resto;

        soma = 0;
        peso = 11;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * peso--;
        }
        resto = soma % 11;
        let digito2 = (resto < 2) ? 0 : 11 - resto;

        return cpfLimpo.charAt(9) === digito1 && cpfLimpo.charAt(10) === digito2;
    }

    // Função para validar os dados do formulário
    function validarFormulario(form) {
        const nome = form.nome ? form.nome.value.trim(): '';
        const dataNascimento = form.dataNascimento ? form.dataNascimento.value.trim() : '';
        const cpf = form.cpf ? form.cpf.value.trim(): '';
        const telefone = form.telefone ? form.telefone.value.trim(): '';
        const email = form.email ? form.email.value.trim(): '';
        const logradouro = form.logradouro ? form.logradouro.value.trim(): '';
        const bairro = form.bairro ? form.bairro.value.trim(): '';
        const numero = form.numero ? form.numero.value.trim(): '';
        const cidade = form.cidade ? form.cidade.value.trim(): '';
        const estado = form.estado ? form.estado.value.trim(): '';
        const cep = form.cep ? form.cep.value.trim(): '';
        const numeroNota = form.numeroNota ? form.numeroNota.value.trim(): '';
        const cnpj = form.cnpj ? form.cnpj.value.trim(): '';
        const dataCompra = form.dataCompra ? form.dataCompra.value: '';
        const resposta = form.resposta ? form.resposta.value.trim(): '';


        // Validar data de compra (deve estar entre 01/05/2025 e 31/05/2025)
        const dataInicio = new Date('2025-05-01');
        const dataFim = new Date('2025-05-31');
        const dataDeCompra = new Date(dataCompra);
        if (dataDeCompra < dataInicio || dataDeCompra > dataFim) {
            alert("A data da compra deve estar entre 01/05/2025 e 31/05/2025.");
            return false;
        }

        return true;
    }

    // Evento de envio do formulário
    document.getElementById('formCadastro').addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio do formulário

        const form = event.target;

        if (validarFormulario(form)) {
            // Enviar os dados via AJAX para o backend
            const formData = new FormData(form);
            fetch('/salvar', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.text())
            .then(data => {
                alert(data);  // Mensagem de sucesso ou erro do backend
            })
            .catch(error => {
                console.error('Erro:', error);
                alert("Erro ao salvar os dados.");
            });
        }
    });
});
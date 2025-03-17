document.addEventListener('DOMContentLoaded', function () {
    // Função para aplicar a máscara no CPF, CNPJ e CEP
    function aplicarMascara(event, tipo) {
        let input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remove tudo que não for número

        if (tipo === 'cpf') {
            // Máscara para CPF
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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

    // Adicionando listeners de máscara
    const cpfInput = document.getElementById('cpfId');
    if (cpfInput) {
        cpfInput.addEventListener('input', function (event) {
            aplicarMascara(event, 'cpf');
        });
    }

    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function (event) {
            aplicarMascara(event, 'cnpj');
        });
    }

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function (event) {
            aplicarMascara(event, 'cep');
        });
    }

    // Função para validar o CPF
    function validarCPF(cpf) {
        const cpfLimpo = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
            return false; // CPF inválido se for uma sequência repetida (ex: 111.111.111-11)
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

        // Verificar se os dois últimos dígitos correspondem aos calculados
        return cpfLimpo.charAt(9) == digito1 && cpfLimpo.charAt(10) == digito2;
    }

    // Captura o formulário
    const formCadastro = document.getElementById('formCadastro');

    if (formCadastro) {
        // Evento de envio do formulário
        formCadastro.addEventListener('submit', function (event) {
            event.preventDefault();

            // Validação do CPF antes de enviar
            const cpfValor = document.getElementById('cpfId').value;
            if (!validarCPF(cpfValor)) {
                alert('CPF inválido! Por favor, insira um CPF válido.');
                return;
            }

            // Captura os dados do formulário
            const formData = new FormData(formCadastro);
            const jsonData = {};

            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            // Envia os dados para o backend
            fetch('http://localhost:3000/salvar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData) // Converte FormData para JSON
            })
                .then(response => {
                    if (!response.ok) {
                        // Se a resposta não for OK (erro 400 ou 500), retorna a mensagem de erro do backend
                        return response.json().then(errorData => {
                            throw new Error(errorData.erro || "Erro no servidor");
                        });
                    }
                    return response.json(); // Caso contrário, retorna o JSON normal
                })
                .then(data => {
                    // Sucesso, exibe a mensagem de sucesso
                    alert(data.mensagem || "Cadastro realizado com sucesso!");
                    formCadastro.reset(); // Limpa o formulário após o envio
                })
                .catch(error => {
                    // Exibe a mensagem de erro
                    console.error("Erro:", error.message);
                    alert(error.message); // Exibe o erro no alert ou pode ser adicionado à UI
                });
        });
    }
});

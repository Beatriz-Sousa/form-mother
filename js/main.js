document.addEventListener('DOMContentLoaded', function () {
    function aplicarMascara(event, tipo) {
        let input = event.target;
        let value = input.value.replace(/\D/g, ''); 

        if (tipo === 'cpf') {
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }
        } else if (tipo === 'cnpj') {
            if (value.length <= 14) {
                value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
            }
        } else if (tipo === 'cep') {
            if (value.length <= 8) {
                value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
            }
        }
        input.value = value;
    }

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

    function validarCPF(cpf) {
        const cpfLimpo = cpf.replace(/\D/g, ''); 

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

        return cpfLimpo.charAt(9) == digito1 && cpfLimpo.charAt(10) == digito2;
    }

    const formCadastro = document.getElementById('formCadastro');

    if (formCadastro) {
        formCadastro.addEventListener('submit', function (event) {
            event.preventDefault();

            const cpfValor = document.getElementById('cpfId').value;
            if (!validarCPF(cpfValor)) {
                alert('CPF inválido! Por favor, insira um CPF válido.');
                return;
            }

            const formData = new FormData(formCadastro);
            const jsonData = {};

            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            fetch('http://localhost:3000/salvar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData) 
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.erro || "Erro no servidor");
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    alert(data.mensagem || "Cadastro realizado com sucesso!");
                    formCadastro.reset();
                })
                .catch(error => {
                    console.error("Erro:", error.message);
                    alert(error.message); 
                });
        });
    }
});

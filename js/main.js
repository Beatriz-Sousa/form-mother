// Função para aplicar a máscara no CPF e CNPJ
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
    }
    else if (tipo === 'cep') {
        // Máscara pra CEP
        if (value.length <= 8){
            value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2')
        }
    }
    input.value = value;
}

// Adicionar os event listeners para os campos de CPF e CNPJ
document.getElementById('cpfId').addEventListener('input', function(event) {
    aplicarMascara(event, 'cpf');
});

document.getElementById('cnpjId').addEventListener('input', function(event) {
    aplicarMascara(event, 'cnpj');
});

document.getElementById('cep').addEventListener('input', function(event){
    aplicarMascara(event, 'cep')
})

// Função para validar o CPF diretamente
function validarCPF() {
    // Pega o valor do campo CPF (pelo id)
    const cpf = document.getElementById('cpfId').value;

    // Remover caracteres não numéricos
    const cpfLimpo = cpf.replace(/[^\d]+/g, '');

    // Verificar se o CPF tem 11 dígitos e se não é um CPF sequencial (todos os dígitos iguais)
    if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
        console.log('CPF inválido!');
        return false;
    }

    // Cálculo do 1º dígito verificador
    let soma = 0;
    let peso = 10;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * peso--;
    }
    let resto = soma % 11;
    let digito1 = (resto < 2) ? 0 : 11 - resto;

    // Cálculo do 2º dígito verificador
    soma = 0;
    peso = 11;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * peso--;
    }
    resto = soma % 11;
    let digito2 = (resto < 2) ? 0 : 11 - resto;

    // Verificar se os dígitos verificadores calculados coincidem com os do CPF
    if (cpfLimpo.charAt(9) == digito1 && cpfLimpo.charAt(10) == digito2) {
        console.log('CPF válido!');
        return true;  // CPF válido
    } else {
        console.log('CPF inválido!');
        return false; // CPF inválido
    }
}

// Adicionar o evento de input no campo de CPF para validar ao digitar
document.getElementById('cpfId').addEventListener('input', validarCPF);

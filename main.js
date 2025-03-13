function openTab(event, tabName) {
    // Oculta todas as abas
    let contents = document.querySelectorAll(".tab-content");
    contents.forEach(content => content.classList.remove("active"));

    // Remove a classe ativa dos botões
    let buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(button => button.classList.remove("active"));

    // Mostra a aba selecionada
    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");
}

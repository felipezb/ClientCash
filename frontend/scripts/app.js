document.getElementById('cadastrarCliente').addEventListener('click', showCadastroForm);
document.getElementById('fazerTransferencia').addEventListener('click', showTransferenciaForm);
document.getElementById('exibirClientes').addEventListener('click', exibirClientes);
document.getElementById('limparClientes').addEventListener('click', limparClientes);


function showCadastroForm() {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
        <h2>Cadastrar Cliente</h2>
        <label for="nome">Nome:</label>
        <input type="text" id="nome">
        <label for="saldo">Saldo:</label>
        <input type="number" id="saldo">
        <label for="cpf">CPF:</label>
        <input type="text" id="cpf">
        <button onclick="cadastrarCliente()">Cadastrar</button>
    `;
}

function showTransferenciaForm() {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
        <h2>Fazer Transferência</h2>
        <label for="origemNome">Nome (Origem):</label>
        <input type="text" id="origemNome">
        <label for="origemCpf">CPF (Origem):</label>
        <input type="text" id="origemCpf">
        <label for="destinoNome">Nome (Destino):</label>
        <input type="text" id="destinoNome">
        <label for="destinoCpf">CPF (Destino):</label>
        <input type="text" id="destinoCpf">
        <label for="valor">Valor:</label>
        <input type="number" id="valor">
        <button onclick="fazerTransferencia()">Transferir</button>
    `;
}

async function cadastrarCliente() {
    const nome = document.getElementById('nome').value;
    const saldo = document.getElementById('saldo').value;
    const cpf = document.getElementById('cpf').value;
    const response = await fetch('/cadastrar_cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, saldo, cpf })
    });
    const result = await response.json();
    alert(result.message);
}

async function fazerTransferencia() {
    const origemNome = document.getElementById('origemNome').value;
    const origemCpf = document.getElementById('origemCpf').value;
    const destinoNome = document.getElementById('destinoNome').value;
    const destinoCpf = document.getElementById('destinoCpf').value;
    const valor = document.getElementById('valor').value;
    const response = await fetch('/fazer_transferencia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origemNome, origemCpf, destinoNome, destinoCpf, valor })
    });
    const result = await response.json();
    alert(result.message);
}

async function exibirClientes() {
    const response = await fetch('/exibir_clientes');
    const clientes = await response.json();
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `<h2>Clientes Cadastrados</h2>`;
    formContainer.innerHTML += `
        <table class="fade-in">
            <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Saldo</th>
            </tr>
        </table>`;
    const table = formContainer.querySelector('table');
    clientes.forEach(cliente => {
        table.innerHTML += `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.saldo}</td>
            </tr>`;
    });
}

async function limparClientes() {
    const response = await fetch('/limpar_clientes', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const result = await response.json();
    alert(result.message);
}


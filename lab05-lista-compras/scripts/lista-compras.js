console.log("Lista de Compras carregada!");

// Array para guardar os itens da lista
let itens = [];
let proximoId = 1; // Variavel para gerar IDs unicos

// Funcao para adicionar item
function adicionarItem(nome, categoria = "Geral") {
    let item = {
        id: proximoId++,
        nome: nome,
        categoria: categoria,
        quantidade: 1,
        comprado: false
    };
    // Adicionar ao array
    itens.push(item);
    renderizarLista(); // Renderizar apos adicionar
    guardarDados(); // Guardar dados apos adicionar

    console.log("Item adicionado:", nome);
    console.log("Lista completa:", itens);
}

// Funcao para remover item
function removerItem(id) {
    itens = itens.filter(item => item.id !== id);
    renderizarLista();
    guardarDados();
}

function alterarQuantidade(id, delta) {
    let item = itens.find(item => item.id === id);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            removerItem(id);
        } else {
            renderizarLista();
            guardarDados();
        }
    }
}

// Funcao para marcar / desmarcar como comprado
function marcarComprado(id) {
    let item = itens.find(item => item.id === id);
    if (item) {
        item.comprado = !item.comprado;
        renderizarLista();
        guardarDados();
    }
}



// Funcao para renderizar lista no DOM
function renderizarLista() {
    // Selecionar elemento ul
    let listaElemento = document.getElementById('lista-itens');
    // Limpar lista
    listaElemento.innerHTML = '';
    // Percorrer array de itens ( for tradicional )
    for (let indice = 0; indice < itens.length; indice++) {
        let item = itens[indice];
        // Criar elemento li
        let li = document.createElement('li');
        li.classList.add('item-lista');
        if (item.comprado) {
            li.classList.add('item-comprado');
        }

        // Checkbox
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.comprado;
        checkbox.addEventListener('change', () => marcarComprado(item.id));

        // Criar span para o nome
        let span = document.createElement('span');
        span.classList.add('item-nome');
        span.textContent = item.nome + '[' + item.categoria + ']';

        // Quantidade
        let qtdDiv = document.createElement('div');
        qtdDiv.classList.add('quantidade-controlo');

        let btnMenos = document.createElement('button');
        btnMenos.textContent = '-';
        btnMenos.addEventListener('click', () => alterarQuantidade(item.id, -1));

        let qtdSpan = document.createElement('span');
        qtdSpan.textContent = item.quantidade;

        let btnMais = document.createElement('button');
        btnMais.textContent = '+';
        btnMais.addEventListener('click', () => alterarQuantidade(item.id, 1));

        qtdDiv.appendChild(btnMenos);
        qtdDiv.appendChild(qtdSpan);
        qtdDiv.appendChild(btnMais);

        let btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.classList.add('btn-remover');
        btnRemover.onclick = () => removerItem(item.id);

        // Neste passo , mostramos apenas o nome
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(qtdDiv);
        li.appendChild(btnRemover);

        // Adicionar li a lista
        listaElemento.appendChild(li);
    }
    // Atualizar contador
    atualizarEstatisticas();
}
// Funcao para atualizar total de itens
function atualizarEstatisticas() {
    let totalItens = itens.length;
    let totalUnidades = itens.reduce((total, item) => total + item.quantidade, 0);
    let comprados = itens.filter(item => item.comprado).length;
    document.getElementById('total-itens').textContent = totalItens;
    document.getElementById('total-unidades').textContent = totalUnidades;
    document.getElementById('comprados').textContent = comprados;
}


// Selecionar elementos do formulario
let inputItem = document.getElementById('input-item');
let btnAdicionar = document.getElementById('btn-adicionar');
let selectCategoria = document.getElementById('select-categoria');


// Event listener para botao adicionar
btnAdicionar.addEventListener('click', function () {
    let nome = inputItem.value.trim();
    let categoria = selectCategoria.value;


    // Validar input
    if (nome === '') {
        alert('Por favor, insira um nome para o item!');
        return;
    }

    // Adicionar item
    adicionarItem(nome, categoria);
    // Limpar input
    inputItem.value = '';
    selectCategoria.value = 'Geral';
    // Focar input novamente
    inputItem.focus();
});

// Event listener para tecla Enter no input
inputItem.addEventListener('keydown', function (evento) {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        btnAdicionar.click();
    }
});



// Event listener para limpar tudo
let btnLimpar = document.getElementById('btn-limpar');
btnLimpar.addEventListener('click', function () {
    if (itens.length === 0) {
        alert('A lista ja esta vazia!');
        return;
    }
    if (confirm('Tem a certeza que quer limpar toda a lista?')) {
        itens = [];
        renderizarLista();
    }
});


// Event listener para ordenar
let btnOrdenar = document.getElementById('btn-ordenar');
btnOrdenar.addEventListener('click', ordenarPorNome);

// Ordenar array alfabeticamente
function ordenarPorNome() {
    itens.sort((a, b) => a.nome.localeCompare(b.nome));
    renderizarLista();
    console.log("Lista ordenada!");
}

// Novo critério : categoria
function ordenarPorCategoria() {
    itens.sort((a, b) => a.categoria.localeCompare(b.categoria));
    renderizarLista();
}

// Novo critério : quantidade ( maior para menor )
function ordenarPorQuantidade() {
    itens.sort((a, b) => b.quantidade - a.quantidade);
    renderizarLista();
}



// Toggle tema
let toggleEscuro = document.getElementById('toggle-escuro');
toggleEscuro.addEventListener('change', function () {
    document.body.classList.toggle('escuro');
    console.log("Tema escuro");
});

function guardarDados() {
    let dados = {
        itens: itens,
        proximoId: proximoId
    };
    localStorage.setItem('listaCompras', JSON.stringify(dados));
    console.log("Dados guardados!");
}


// Carregar dados do LocalStorage
function carregarDados() {
    let jsonSalvo = localStorage.getItem('listaCompras');
    if (jsonSalvo) {
        try {
            let dados = JSON.parse(jsonSalvo);
            itens = dados.itens;
            proximoId = dados.proximoId;
            renderizarLista();
            console.log("Dados carregados!");
        } catch (erro) {
            console.error("Erro ao carregar dados:", erro);
        }
    }
}
// Se o script estiver com atributo defer no HTML ,
// basta chamar a inicializa ção no fim do ficheiro :
carregarDados();
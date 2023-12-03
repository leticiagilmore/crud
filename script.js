const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sPais = document.querySelector('#m-pais');
const sNascimento = document.querySelector('#m-nascimento');
const sObito = document.querySelector('#m-obito');
const sInstrumentacao = document.querySelectorAll('input[name="instrumentacao[]"]');
const sMidia = document.querySelector('#m-midia');
const sPaisObito = document.querySelector('#m-pais-obito');
const btnSalvar = document.querySelector('#btnSalvar');

let itens;
let id;

function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sPais.value = itens[index].pais;
    sNascimento.value = itens[index].nascimento;
    sObito.value = itens[index].obito;

    // Defina os valores dos checkboxes de instrumentação com base nos dados existentes
    sInstrumentacao.forEach(input => {
      input.checked = itens[index].instrumentacao.includes(input.value);
    });

    sMidia.value = itens[index].midia;
    sPaisObito.value = itens[index].paisObito;
    id = index;
  } else {
    sNome.value = '';
    sPais.value = '';
    sNascimento.value = '';
    sObito.value = '';
    sInstrumentacao.forEach(input => (input.checked = false));
    sMidia.value = '';
    sPaisObito.value = '';
  }
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.pais}</td>
    <td> ${item.nascimento}</td>
    <td> ${item.obito}</td>
    <td>${item.instrumentacao.join(', ')}</td>
    <td>${item.midia}</td>
    <td>${item.paisObito}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = e => {
  if (
    sNome.value == '' ||
    sPais.value == '' ||
    sNascimento.value == '' ||
    sObito.value == '' ||
    Array.from(sInstrumentacao).every(input => !input.checked) ||
    sMidia.value == '' ||
    sPaisObito.value == ''
  ) {
    return;
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value;
    itens[id].pais = sPais.value;
    itens[id].nascimento = sNascimento.value;
    itens[id].obito = sObito.value;
    itens[id].instrumentacao = Array.from(sInstrumentacao)
      .filter(input => input.checked)
      .map(input => input.value);
    itens[id].midia = sMidia.value;
    itens[id].paisObito = sPaisObito.value;
  } else {
    itens.push({
      nome: sNome.value,
      pais: sPais.value,
      nascimento: sNascimento.value,
      obito: sObito.value,
      instrumentacao: Array.from(sInstrumentacao)
        .filter(input => input.checked)
        .map(input => input.value),
      midia: sMidia.value,
      paisObito: sPaisObito.value,
    });
  }

  setItensBD();

  modal.classList.remove('active');
  loadItens();
  id = undefined;
};

function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = '';
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

loadItens();

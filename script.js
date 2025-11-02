// Seleciona elementos do DOM
const taskInput = document.getElementById('taskInput');
const quantityInput = document.getElementById('quantityInput');
const categorySelect = document.getElementById('categorySelect');
const priceInput = document.getElementById('priceInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const budgetInput = document.getElementById('budgetInput');
const totalDisplay = document.getElementById('totalDisplay');
const balanceDisplay = document.getElementById('balanceDisplay');
const dateTimeDisplay = document.getElementById('dateTimeDisplay');

// Recupera tarefas do localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Função para renderizar a lista de itens
function renderTasks() {
taskList.innerHTML = ''; // Limpa lista antes de renderizar

tasks.forEach((task, index) => {
    const li = document.createElement('li');

    // Div com detalhes do item
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('item-details');
    detailsDiv.textContent = `${task.name} | Qtd: ${task.quantity} | ${task.category} | R$ ${(task.price * task.quantity).toFixed(2)}`;

    if(task.done) li.classList.add('done');

    // Botão marcar/comprado
    const doneBtn = document.createElement('button');
    doneBtn.textContent = '✓';
    doneBtn.title = 'Marcar/Desmarcar';
    doneBtn.classList.add('btn-done');
    doneBtn.addEventListener('click', () => toggleDone(index));

    // Botão editar
    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.title = 'Editar';
    editBtn.classList.add('btn-edit');
    editBtn.addEventListener('click', () => editTask(index));

    // Botão excluir
    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.title = 'Excluir';
    delBtn.classList.add('btn-delete');
    delBtn.addEventListener('click', () => deleteTask(index));

    // Adiciona elementos ao li
    li.appendChild(detailsDiv);
    li.appendChild(doneBtn);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    taskList.appendChild(li);
});

updateBudget(); // Atualiza total e saldo

}

// Adiciona novo item
function addTask() {
const name = taskInput.value.trim();
const quantity = parseInt(quantityInput.value);
const category = categorySelect.value;
const price = parseFloat(priceInput.value);

if (!name || !quantity || !price) return alert('Preencha todos os campos corretamente!');

tasks.push({ name, quantity, category, price, done: false });

resetInputs();
saveTasks();
renderTasks();

}

// Função de resetar inputs
function resetInputs() {
taskInput.value = '';
quantityInput.value = 1;
priceInput.value = '';
taskInput.focus();
}

// Marca/desmarca como comprado
function toggleDone(index) {
tasks[index].done = !tasks[index].done;
saveTasks();
renderTasks();
}

// Edita item
function editTask(index) {
const task = tasks[index];

// Preenche os campos com valores do item
taskInput.value = task.name;
quantityInput.value = task.quantity;
categorySelect.value = task.category;
priceInput.value = task.price;

// Remove o item antigo
tasks.splice(index, 1);
saveTasks();
renderTasks();

}

// Exclui item
function deleteTask(index) {
tasks.splice(index, 1);
saveTasks();
renderTasks();
}

// Salva tarefas no localStorage
function saveTasks() {
localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Atualiza total e saldo/excedente
function updateBudget() {
const total = tasks.reduce((sum, task) => sum + (task.price * task.quantity), 0);
const budget = parseFloat(budgetInput.value) || 0;
const balance = budget - total;

totalDisplay.textContent = `Total da compra: R$ ${total.toFixed(2)}`;

if(balance >= 0){
    balanceDisplay.textContent = `Saldo: R$ ${balance.toFixed(2)}`;
    balanceDisplay.style.color = 'green';
} else {
    balanceDisplay.textContent = `Excedente: R$ ${Math.abs(balance).toFixed(2)}`;
    balanceDisplay.style.color = 'red';
}

}

// Atualiza hora e data automáticas
function updateDateTime() {
const now = new Date();
const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit'};
dateTimeDisplay.textContent = now.toLocaleDateString('pt-BR', options);
}
setInterval(updateDateTime, 1000);

// Eventos
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') addTask(); });
quantityInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') addTask(); });
priceInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') addTask(); });

// Atualiza saldo automaticamente quando o valor disponível mudar
budgetInput.addEventListener('input', updateBudget);

// Inicializa lista e data
renderTasks();
updateDateTime();

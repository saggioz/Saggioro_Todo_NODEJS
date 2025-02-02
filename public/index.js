const template = `<li class="list-group-item %BG">
   <span>%TODO</span>
   <button id="delete_ID" type="button" class="todo btn btn-danger float-end">X</button>
   <button id="success_ID" type="button" class="todo btn btn-success float-end">V</button>
   </li>`;

let todos = [];
const todoInput = document.getElementById("input");
const insertButton = document.getElementById("insertButton");
const list = document.getElementById("list");

const send = (todo) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        })
        .then((response) => response.json())
        .then((json) => {
            resolve(json); // risposta del server all'aggiunta
        })
    })
}

const completeTodo = (todo) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/complete", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        })
        .then((response) => response.json())
        .then((json) => {
            resolve(json);
        })
    })
}
 
const load = () => {
    return new Promise((resolve, reject) => {
        fetch("/todo")
        .then((response) => response.json())
        .then((json) => {
            resolve(json); // risposta del server con la lista
        })
    })
}

const deleteTodo = (id) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/"+id, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((response) => response.json())
        .then((json) => {
            resolve(json);
        })
    })
}

insertButton.onclick = () => {
    const todo = {
        name: todoInput.value,
        completed: false
    }
    send({todo: todo}) // 1. invia la nuova Todo
    .then(() => load()) // 2. caricala nuova lista
    .then((json) => {
        todos = json.todos;
        todoInput.value = "";
        render();  // 3. render della nuova lista
    });
}

const render = () => {
    const todoList = document.getElementById("list");
    todoList.innerHTML = "";
    todos.forEach(todo => {
        const li = `
            <li class="${todo.completed ? 'completed' : ''}">
                <span>${todo.name}</span>
                <div>
                    <button class="complete-button" id="${todo.id}">Completa</button>
                    <button class="delete-button" id="${todo.id}">Elimina</button>
                </div>
            </li>
        `;
        todoList.innerHTML += li;
    });
    const completeButtons = document.querySelectorAll('.complete-button');
    completeButtons.forEach(button => {
        button.onclick = () => {
            const id = button.getAttribute('id');
            completeTodo(id);
        };
    });
    
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.onclick = () => {
            const id = button.getAttribute('id');
            deleteTodo(id);
        };
    });
};

const refresh = () => {
    load().then((json) => {
        todos = json.todos;
        render();
    });
}
 
refresh();
setInterval(refresh, 30000);
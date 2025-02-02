let todos = [];

const render = () => {
   const todoList = document.getElementById("todoList");
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

const send = (todo) => {
    return fetch("/todo/add", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ todo })
    }).then(response => response.json());
};

const load = () => {
    return fetch("/todo")
        .then(response => response.json())
        .then(json => {
            todos = json.todos;
            render();
        });
};

const completeTodo = (id) => {
    const todo = { id };
    return fetch("/todo/complete", {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    }).then(() => load());
};

const deleteTodo = (id) => {
    return fetch("/todo/"+id, {
        method: 'DELETE'
    }).then(() => load());
};

document.getElementById("insertButton").onclick = () => {
    const todoInput = document.getElementById("todoInput");
    const todo = {
        name: todoInput.value,
        completed: false
    };
    send(todo).then(() => {
        todoInput.value = "";
        load();
    });
};

load();

setInterval(() => {
   load();
}, 30000);
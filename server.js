let http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

app.use("/", express.static(path.join(__dirname, "public")));

let todos = [];

app.post("/todo/add", (req, res) => {
    const todo = req.body.todo;
    todo.id = Date.now().toString();
    todos.push(todo);
    res.json({ result: "Ok" });
});

app.get("/todo", (req, res) => {
    res.json({ todos: todos });
});

app.put("/todo/complete", (req, res) => {
    const todo = req.body;
    todos = todos.map((element) => {
        if (element.id === todo.id) {
            element.completed = true;
        }
        return element;
    });
    res.json({ result: "Ok" });
});

app.delete("/todo/:id", (req, res) => {
    todos = todos.filter((element) => element.id !== req.params.id);
    res.json({ result: "Ok" });
});

const server = http.createServer(app);

server.listen(100, () => {
    console.log(`- server running`);
});
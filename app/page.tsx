//! we render from client side
"use client";

//!css import
import "./globals.css";

//!MST import
import { observer } from "mobx-react-lite";
import {
  types,
  getParentOfType,
  IModelType,
  ISimpleType,
  IStateTreeNode,
  toGeneratorFunction,
} from "mobx-state-tree";
//!react import
import { useState } from "react";
import { v4 as uuid } from "uuid";

//!declare schemes

const TodoModel = types
  .model("Home", {
    id: types.identifier,
    title: types.string,
    description: types.string,
    status: types.enumeration(["To Do", "In Progress", "Completed"]),
  })
  .actions((self) => ({
    toggle() {
      console.log(self.status);

      if (self.status === "To Do") {
        this.setStatus("In Progress");
      } else if (self.status === "In Progress") {
        this.setStatus("Completed");
      } else {
        this.setStatus("To Do");
      }
    },
    setStatus(status: "To Do" | "In Progress" | "Completed") {
      self.status = status;
      console.log("seted");
    },
    updateTitleAndDescription(title: string, description: string) {
      self.title = title;
      self.description = description;
    },
    deleteTodo() {
      const parent = getParentOfType(self, TodoAppModel);
      parent.deleteTodoById(self.id);
    },
  }));

//! create unique id for every task creation

const TodoAppModel = types
  .model("Home", {
    todos: types.array(TodoModel),
  })
  .actions((self) => ({
    addTodo: (title: string, description: string) => {
      const newTodo = TodoModel.create({
        id: uuid(),
        title,
        description,
        status: "To Do",
      });
      self.todos.push(newTodo);
    },
    deleteTodoById: (id: string) => {
      console.log(self, todoAppStore, todoAppStore.todos);

      //todoAppStore.todos = todoAppStore.todos.filter((todo) => todo.id !== id);
    },
  }));

const todoAppStore = TodoAppModel.create({ todos: [] });
console.log(todoAppStore);

//! main function with react hooks

const Home = observer(() => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim() !== "") {
      todoAppStore.addTodo(newTodoTitle.trim(), newTodoDescription.trim());
      setNewTodoTitle("");
      setNewTodoDescription("");
    }
  };
  //! Toggle for find id and change status of the task

  const handleToggleTodo = (id: string) => {
    const todo = todoAppStore.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.toggle();
    }
  };
  //!Delete method call

  const handleDeleteTodo = (id: string) => {
    const todo = todoAppStore.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.deleteTodo();
    }
  };
  //!Update method call

  const handleUpdateTodo = (
    id: string,
    newTitle: string,
    newDescription: string
  ) => {
    const todo = todoAppStore.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.updateTitleAndDescription(newTitle, newDescription);
    }
  };

  return (
    <div className="container mx-auto  p-4">
      <div className="navbar">
        <h1 className="text-2xl font-bold ">Todo App</h1>
      </div>
      <form className="mb-4 max-w-md" onSubmit={handleAddTodo}>
        <div className="mb-2">
          <label htmlFor="title" className="block font-bold">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Enter a title"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="description" className="block font-bold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Enter a description"
            rows={3}
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded button"
          >
            ADD
          </button>
        </div>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th className="status">Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todoAppStore.todos.map((todo) => (
            <tr
              key={todo.id}
              className={`${
                todo.status === "Completed" ? "line-through" : ""
              } cursor-pointer`}
              onClick={() => handleToggleTodo(todo.id)}
            >
              <td>{todo.title}</td>
              <td>{todo.description}</td>
              <td>{todo.status}</td>
              <td>
                <button
                  className="text-red-500 ml-2 delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo(todo.id);
                  }}
                >
                  Delete
                </button>
                <button
                  className="text-blue-500 ml-2 edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTitle = prompt("Update Todo Title", todo.title);
                    const newDescription = prompt(
                      "Update Todo Description",
                      todo.description
                    );
                    if (newTitle !== null && newDescription !== null) {
                      handleUpdateTodo(todo.id, newTitle, newDescription);
                    }
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default Home;

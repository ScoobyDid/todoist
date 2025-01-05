import './scss/App.scss';
import { useEffect, useState } from 'react';
import { TodoFilter } from './TodoFilter.jsx';
import { TodoList } from './TodoList.jsx';
import { TodoAdd } from './TodoAdd.jsx';

export default function App() {
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos') || '[]'));
  const [displayTodos, setDisplayTodos] = useState(todos);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function addTodo(text) {
    setTodos((currentTodos) => {
      const newTodos = [
        ...currentTodos,
        {
          id: crypto.randomUUID(),
          text,
          completed: false,
        },
      ];

      setDisplayTodos(newTodos);
      return newTodos;
    });
  }

  function filterTodos(searchQuery = null, completed = null) {
    const isEmptyCompleted = completed === null || completed === '';
    if (!searchQuery && isEmptyCompleted) {
      setDisplayTodos(todos);
      return;
    }

    setDisplayTodos(() =>
      todos.filter((todo) => {
        let matches = false;

        if (searchQuery) {
          matches = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
          if (!matches) return false;
        }

        if (!matches && !isEmptyCompleted) {
          matches = todo.completed === Boolean(+completed);
          if (!matches) return false;
        }

        return matches;
      })
    );
  }

  function toggleTodo(id, completed) {
    setTodos((currentTodos) => {
      const newTodos = currentTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed,
          };
        }
        return todo;
      });

      setDisplayTodos(newTodos);
      return newTodos;
    });
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => {
      const newTodos = currentTodos.filter((todo) => {
        return todo.id !== id;
      });
      setDisplayTodos(newTodos);
      return newTodos;
    });
  }

  return (
    <section className='todo section-gap-md container'>
      <h1 className='title fsz-title-md center up todo__title'>Todo list</h1>
      <TodoFilter filterTodos={filterTodos} />

      <TodoList todos={displayTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />

      <TodoAdd addTodo={addTodo} />
    </section>
  );
}


import PropTypes from 'prop-types';
import { TodoItem } from './TodoItem.jsx';

export function TodoList({ todos, toggleTodo, deleteTodo }) {
  TodoList.propTypes = {
    todos: PropTypes.array.isRequired,
    toggleTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
  };

  return (
    <ul className='todo__list todo-list'>
      {todos.length === 0 && (
        <li className='todo-list__li todo-list__no-results'>
          <img className='todo-list__no-results-image' src='/public/detective.png' alt='No notes' />
          <p className='todo-list__no-results-text'>Empty...</p>
        </li>
      )}
      {todos.map((todo) => {
        return <TodoItem todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} key={todo.id} />;
      })}
    </ul>
  );
}

import PropTypes from 'prop-types';

export function TodoItem({ todo, toggleTodo, deleteTodo }) {
  TodoItem.propTypes = {
    todo: PropTypes.object.isRequired,
    toggleTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
  };

  return (
    <li className='todo-list__li'>
      <label className='checkbox'>
        <div className='checkbox__box'>
          <input
            className='visually-hidden'
            type='checkbox'
            checked={todo.completed}
            onChange={(e) => toggleTodo(todo.id, e.target.checked)}
          />
          <svg className='checkbox__icon' aria-hidden viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeMiterlimit='10' fill='none' d='M22.9 3.7l-15.2 16.6-6.6-7.1'></path>
          </svg>
        </div>
      </label>
      <p className='todo-list__text up'>{todo.text}</p>
      <div className='todo-list__actions'>
        <button className='todo-list__action-btn btn' type='button' title='edit'>
          <svg className='todo-list__action-btn-icon' fill='none' stroke='currentColor' aria-hidden viewBox='0 0 18 18'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m9 6-7 7v3h3l7-7M9 6l2-2h0l1-1s0 0 0 0l1 1 1 1 1 1s0 0 0 0l-1 1h0l-2 2M9 6l3 3'
            />
          </svg>
        </button>
        <button className='todo-list__action-btn btn' type='button' title='delete' onClick={() => deleteTodo(todo.id)}>
          <svg className='todo-list__action-btn-icon' fill='none' stroke='currentColor' aria-hidden viewBox='0 0 18 18'>
            <path d='M3.87 7.62A1.5 1.5 0 0 1 5.37 6h7.26c.87 0 1.56.74 1.5 1.62l-.52 6.75a1.5 1.5 0 0 1-1.5 1.38H5.9a1.5 1.5 0 0 1-1.5-1.38l-.52-6.75Z' />
            <path strokeLinecap='round' d='M14.63 3.75H3.37' />
            <path d='M7.5 2.25c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v1.5h-3v-1.5Z' />
            <path strokeLinecap='round' d='M10.5 9v3.75M7.5 9v3.75' />
          </svg>
        </button>
      </div>
    </li>
  );
}

import { useState } from 'react';
import PropTypes from 'prop-types';

export function TodoFilter({ filterTodos }) {
  const [searchValue, setSearchValue] = useState('');
  const [typeValue, setTypeValue] = useState(null);

  function handleFilterTodoSubmit(e) {
    e.preventDefault();
    filterTodos(searchValue, typeValue);
  }

  TodoFilter.propTypes = {
    filterTodos: PropTypes.func.isRequired,
  };

  return (
    <form className='todo__form' onSubmit={handleFilterTodoSubmit}>
      <div className='todo__search-wrapper'>
        <input
          className='todo__search input'
          onChange={(e) => {
            setSearchValue(e.target.value);
            filterTodos(e.target.value, typeValue);
          }}
          type='text'
          name='search'
          id='todo-search-input'
          placeholder='Search note...'
        />
        <button className='btn todo__search-btn' type='submit' title='search'>
          <svg aria-hidden width='20' height='22' fill='none' viewBox='0 0 21 22'>
            <path
              fill='currentColor'
              d='m20.8 20.2-4.9-4.9a9 9 0 1 0-1 1v.1l4.8 4.9a.7.7 0 0 0 1 0 .7.7 0 0 0 0-1.1ZM9 17A7.5 7.5 0 1 1 9 2a7.5 7.5 0 0 1 0 15Z'
            />
          </svg>
        </button>
      </div>
      <select
        className='todo__type-select select'
        name='show_type'
        id='todo-type-select'
        onChange={(e) => {
          setTypeValue(e.target.value);
          filterTodos(searchValue, e.target.value);
        }}
        defaultValue='all'
      >
        <option value=''>All</option>
        <option value='1'>Complete</option>
        <option value='0'>Incomplete</option>
      </select>
      <div className='todo__theme-switch-wrapper'>
        <label
          className='todo__theme-switch btn btn-accent btn-accent--filled'
          htmlFor='todo-theme-switch'
          title='toggle theme'
        >
          <svg aria-hidden width='30' height='30' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M12 21q-3.8 0-6.4-2.6T3 12q0-3.5 2.3-6T11 3l.6.1q.3.1.4.4t.1.5-.1.6q-.5.7-.7 1.4t-.2 1.5q0 2.3 1.6 3.8t3.8 1.6q.8 0 1.5-.2t1.4-.6l.6-.2.5.1.4.4q.2.2 0 .6-.3 3.5-2.9 5.7T12 21m0-2q2.2 0 4-1.2t2.5-3.2l-1 .2-1 .1q-3 0-5.2-2.2T9 7.5v-1q0-.5.3-1-2 .8-3.2 2.5T5 12q0 2.9 2 5t5 2m-.3-6.8'
            />
          </svg>
          <input className='visually-hidden' type='checkbox' />
        </label>
      </div>
    </form>
  );
}

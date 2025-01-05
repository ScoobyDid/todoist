import PropTypes from 'prop-types';
import TodoAddModal from './TodoAddModal.jsx';
import { useRef } from 'react';

export function TodoAdd({ addTodo }) {
  TodoAdd.propTypes = {
    addTodo: PropTypes.func.isRequired,
  };

  const todoAddModalRef = useRef(null);

  function handleOpenDialog() {
    if (todoAddModalRef.current) {
      todoAddModalRef.current.openDialog();
    }
  }

  return (
    <>
      <button className='todo__add btn' type='button' title='add note' onClick={handleOpenDialog}>
        <svg className='todo__add-icon' fill='currentColor' viewBox='0 0 512 512'>
          <path d='M467 211H301V45a45 45 0 1 0-90 0v166H45a45 45 0 1 0 0 90h166v166a45 45 0 1 0 90 0V301h166a45 45 0 1 0 0-90z' />
        </svg>
      </button>

      <TodoAddModal addTodo={addTodo} ref={todoAddModalRef} />
    </>
  );
}

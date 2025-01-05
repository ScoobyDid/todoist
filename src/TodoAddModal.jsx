import { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';

const TodoAddModal = forwardRef(({ addTodo }, ref) => {
  TodoAddModal.propTypes = {
    addTodo: PropTypes.func.isRequired,
  };

  const [newTodo, setNewTodo] = useState('');
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    openDialog() {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    },
    closeDialog() {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    },
  }));

  function handleAddTodoSubmit(e) {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    addTodo(newTodo);
    setNewTodo('');
    ref.current.closeDialog();
  }

  return (
    <dialog className='todo__modal-add modal' ref={dialogRef}>
      <h2 className='todo__modal-add-title title fsz-title-md center up'>New note</h2>
      <form className='todo__modal-add-content' onSubmit={handleAddTodoSubmit}>
        <div className='todo__modal-add-input-wrapper'>
          <input
            className='todo__modal-add-input input'
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            name='search'
            id='todo-new-input'
            placeholder='Input your note...'
            autoFocus
          />
        </div>
        <div className='todo__modal-add-actions'>
          <button className='btn btn-accent btn-accent--hollow up' type='button' onClick={() => ref.current.closeDialog()}>
            Cancel
          </button>
          <button className='btn btn-accent btn-accent--filled' type='submit'>
            Apply
          </button>
        </div>
      </form>
    </dialog>
  );
});

TodoAddModal.displayName = 'TodoAddModal';

export default TodoAddModal;

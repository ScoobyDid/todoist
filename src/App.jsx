import './scss/App.scss';

export default function App() {
  return (
    <section className='todo section-gap-md container'>
      <h1 className='title fsz-title-md center up todo__title'>Todo list</h1>
      <form className='todo__form'>
        <div className='todo__search-wrapper'>
          <input className='todo__search input' type='text' name='search' id='todo-search-input' placeholder='Search note...' />
          <button className='btn todo__search-btn' type='submit' title='search'>
            <svg aria-hidden width='20' height='22' fill='none' viewBox='0 0 21 22'>
              <path
                fill='currentColor'
                d='m20.8 20.2-4.9-4.9a9 9 0 1 0-1 1v.1l4.8 4.9a.7.7 0 0 0 1 0 .7.7 0 0 0 0-1.1ZM9 17A7.5 7.5 0 1 1 9 2a7.5 7.5 0 0 1 0 15Z'
              />
            </svg>
          </button>
        </div>
        <select className='todo__type-select select' name='show_type' id='todo-type-select'>
          <option value='all'>All</option>
          <option value='complete'>Complete</option>
          <option value='incomplete'>Incomplete</option>
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

      <ul className='todo__list todo-list'>
        <li className='todo-list__li'>
          <label className='checkbox'>
            <div className='checkbox__box'>
              <input className='visually-hidden' type='checkbox' />
              <svg className='checkbox__icon' aria-hidden viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeMiterlimit='10' fill='none' d='M22.9 3.7l-15.2 16.6-6.6-7.1'></path>
              </svg>
            </div>
          </label>
          <p className='todo-list__text up'>Note #1</p>
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
            <button className='todo-list__action-btn btn' type='button' title='delete'>
              <svg className='todo-list__action-btn-icon' fill='none' stroke='currentColor' aria-hidden viewBox='0 0 18 18'>
                <path d='M3.87 7.62A1.5 1.5 0 0 1 5.37 6h7.26c.87 0 1.56.74 1.5 1.62l-.52 6.75a1.5 1.5 0 0 1-1.5 1.38H5.9a1.5 1.5 0 0 1-1.5-1.38l-.52-6.75Z' />
                <path strokeLinecap='round' d='M14.63 3.75H3.37' />
                <path d='M7.5 2.25c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v1.5h-3v-1.5Z' />
                <path strokeLinecap='round' d='M10.5 9v3.75M7.5 9v3.75' />
              </svg>
            </button>
          </div>
        </li>

        <li className='todo-list__li'>
          <label className='checkbox'>
            <div className='checkbox__box'>
              <input className='visually-hidden' type='checkbox' />
              <svg className='checkbox__icon' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeMiterlimit='10' fill='none' d='M22.9 3.7l-15.2 16.6-6.6-7.1'></path>
              </svg>
            </div>
          </label>
          <p className='todo-list__text up'>Note #1</p>
          <div className='todo-list__actions'>
            <button className='todo-list__action-btn' type='button'>
              Change
            </button>
            <button className='todo-list__action-btn' type='button'>
              Delete
            </button>
          </div>
        </li>
      </ul>

      <button className='todo__add btn' type='button' title='add note'>
        <svg className='todo__add-icon' fill='currentColor' viewBox='0 0 512 512'>
          <path d='M467 211H301V45a45 45 0 1 0-90 0v166H45a45 45 0 1 0 0 90h166v166a45 45 0 1 0 90 0V301h166a45 45 0 1 0 0-90z' />
        </svg>
      </button>
    </section>
  );
}


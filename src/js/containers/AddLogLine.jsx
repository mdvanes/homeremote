import React from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { addLogline, clearLog } from '../actions/actions';

// TODO use ES6 class syntax and remove eslint disable above?
let AddLogLine = ({ dispatch }) => {
  let input;

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(addLogline(input.value))
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Add Logline
        </button>
        <button type="button" onClick={() => dispatch(clearLog())}>
        Clear log
        </button>
      </form>
    </div>
  )
}
AddLogLine = connect()(AddLogLine);

export default AddLogLine;
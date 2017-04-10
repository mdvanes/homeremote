import React from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { logInfo, logError } from '../actions/actions';

// TODO Remove this file, everything has been moved to ClearLogButton

let AddLogLine = ({ dispatch }) => {
  let input;
  let input2;

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(logInfo(input.value, 'AddLogLine-dummy'))
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Log Info
        </button>
        {/*<button type="button" onClick={() => dispatch(clearLog())}>
        Clear log
        </button>*/}
      </form>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input2.value.trim()) {
          return
        }
        dispatch(logError(input2.value, 'AddLogLine-dummy'))
        input2.value = ''
      }}>
        <input ref={node => {
          input2 = node
        }} />
        <button type="submit">
          Log error
        </button>
      </form>
    </div>
  )
}
AddLogLine = connect()(AddLogLine);

export default AddLogLine;
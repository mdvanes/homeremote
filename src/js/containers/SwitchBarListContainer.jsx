import {connect} from 'react-redux';
import {logInfo, logError, setSwitches} from '../actions';
import SwitchBarList from '../components/SwitchBarList/SwitchBarList';
import {bindActionCreators} from 'redux';

// This is a simple thunk
const getSwitches = () =>
  dispatch =>
    fetch('/switches', {
      credentials: 'same-origin',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(data => data.json())
      .then(data => {
        dispatch(logInfo(`Got switches: ${data.switches.map(aSwitch => aSwitch.name).join(', ')}`));
        dispatch(setSwitches(data.switches));
      })
      .catch(error => dispatch(logError(`error on /switches: ${error}`)));

const sendState = (dispatch, state, id, type) => {
  fetch(`/switch/${id}`, {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      state,
      type
    })
  })
    .then(data => {
      return data.json();
    })
    .then(data => {
      dispatch(logInfo('some effect'));
      if (data.status !== 'received') {
        dispatch(logError(`error on send-${state}: ${data.status}`));
      } else {
        dispatch(logInfo(`Switch ${id} ${state}`));
        dispatch(getSwitches());
      }
    })
    .catch(error => dispatch(logError(`error on send-${state}: ${error}`)));
};

const sendOn = (...args) => dispatch => {
  sendState(dispatch, 'on', ...args);
};

const sendOff = (...args) => dispatch => {
  sendState(dispatch, 'off', ...args);
};

const mapStateToProps = state => {
  return {
    switches: state.switchesList.switches
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({getSwitches, sendOn, sendOff}, dispatch);
  // bindActionCreators is shorthand for:
  // return {
  //   getSwitches: () => dispatch(getSwitches()),
  //   sendOn: (...args) => dispatch(sendOn(...args))
  // };
};

const SwitchBarListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchBarList);

export default SwitchBarListContainer;
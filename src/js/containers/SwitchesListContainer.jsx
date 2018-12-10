import { connect } from 'react-redux';
import { logInfo, logError, setSwitches } from '../actions';
import SwitchesList from '../components/SwitchesList';

// This is a simple thunk
export function getSwitches() {
  return function(dispatch) {
    fetch('switches', {
      credentials: 'same-origin',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(data => data.json())
      .then(data => {
        console.log(data)
        dispatch(logInfo(`Got switches: ${data.switches.length}`)); // TODO log something useful
        dispatch(setSwitches(data.switches));
      })
      .catch(error => dispatch(logError(`error on /switches: ${error}`)));
  }
}

const mapStateToProps = state => {
  return {
    switches: state.switchesList.switches
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSwitches: dirIndex => dispatch(getSwitches(dirIndex)),
  };
};

const SwitchesListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchesList);

export default SwitchesListContainer;
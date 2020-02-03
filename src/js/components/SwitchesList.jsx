import React, {Fragment} from 'react';
import ButtonGroup from '../containers/button-group';
//import MacroButtonGroup from './components/macro-button-group';

// type is switchscene or switchlight
const getType = type => type === 'Group' ? 'switchscene' : 'switchlight';

export default class SwitchesList extends React.Component {
  constructor(props) {
    super(props);
    this.props.getSwitches(); // TODO if getSwitches can be outside, this class can be a SFC with state in Redux
  }

  render() {
    const buttonGroups = this.props.switches
      .map(({idx, name, type, status, dimLevel}) => (<ButtonGroup
        key={idx}
        label={name}
        type={getType(type)}
        status={status}
        dimLevel={dimLevel}
        id={idx}
      />));
    return (
      <Fragment>
        {buttonGroups}
      </Fragment>
    );
  }
}
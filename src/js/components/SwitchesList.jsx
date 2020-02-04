import React, {Fragment} from 'react';
import ButtonGroup from '../containers/button-group';
//import MacroButtonGroup from './components/macro-button-group';

// type is switchscene or switchlight
const getType = type => {
  switch (type) {
    case 'Group':
      return 'switchscene';
    case 'Selector':
      return 'selector';
    default:
      return 'switchlight';
  }
};

export default class SwitchesList extends React.Component {
  constructor(props) {
    super(props);
    this.props.getSwitches(); // TODO if getSwitches can be outside, this class can be a SFC with state in Redux
  }

  render() {
    const buttonGroups = this.props.switches
      .map(({idx, name, type, status, dimLevel, readOnly}) => (<ButtonGroup
        key={idx}
        label={name}
        type={getType(type)}
        status={status}
        dimLevel={dimLevel}
        readOnly={readOnly}
        id={idx}
      />));
    return (
      <Fragment>
        {buttonGroups}
      </Fragment>
    );
  }
}
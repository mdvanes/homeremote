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
      .map((aSwitch) => (<ButtonGroup
        key={aSwitch.idx}
        label={aSwitch.name.substring(0,1)}
        icon="lightbulb_outline"
        type={getType(aSwitch.type)}
        id={aSwitch.idx}
      />));
    return (
      <Fragment>
        {buttonGroups}
      </Fragment>
    );
  }
}
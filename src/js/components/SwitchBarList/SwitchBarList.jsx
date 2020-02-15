// eslint-disable-next-line no-unused-vars
import React, {Fragment} from 'react';
import SwitchBar from './SwitchBar';
import SwitchBarInnerButton from './SwitchBarInnerButton';

const SELECTOR_STATES = {
  0: 'disconnected',
  10: 'disarmed',
  20: 'partarmed',
  30: 'armed'
};

// Type is switchscene or switchlight
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

const getLeftIcon = label => label === 'Blinds' ? 'arrow_drop_down' : 'radio_button_checked';

const getRightIcon = label => label === 'Blinds' ? 'arrow_drop_up' : 'radio_button_unchecked';

const getNameAndChildren = (name, children) => children ? `${name} (${children.length})` : name;

const getLabel = ( name, dimLevel, type ) => {
  if ( type === 'selector' ) {
    return `${name}: ${SELECTOR_STATES[dimLevel]}`;
  }
  return dimLevel !== null ? `${name} (${dimLevel}%)` : name;
};

const mapSwitchToSwitchBar = ({idx, name, type, dimLevel, readOnly, status, children}, sendOn, sendOff, labelAction) => (<SwitchBar
  key={`switch-${idx}`}
  label={getLabel(getNameAndChildren(name, children), dimLevel, getType(type))}
  labelAction={labelAction}
  leftButton={<SwitchBarInnerButton
    isReadOnly={readOnly}
    clickAction={() => sendOn(idx, getType(type))}
    icon={getLeftIcon(name)}
    isActive={status === 'On'}
  />}
  rightButton={<SwitchBarInnerButton
    isReadOnly={readOnly}
    clickAction={() => sendOff(idx, getType(type))}
    icon={getRightIcon(name)}
    isActive={status === 'Off'}
  />}
/>);

const SwitchBarList = ({ switches, sendOn, sendOff }) => {
  const switchBars = switches
    .map((dSwitch) => {
      const hasChildren = dSwitch.children;
      const labelAction = hasChildren ? () => { console.log('NYI this should toggle the children') } : false;
      return (<Fragment key={`frag-${dSwitch.idx}`}>
        {mapSwitchToSwitchBar(dSwitch, sendOn, sendOff, labelAction)}
        {hasChildren ? (
          <div style={{'padding': '0.5em'}}>
            {hasChildren.map(switchChild => mapSwitchToSwitchBar(switchChild, sendOn, sendOff, false))}
          </div>) : null}
      </Fragment>);
    });
  return (
    <Fragment>
      {switchBars}
    </Fragment>
  );
};

// TODO This shim can be removed if the useEffect hook can call this.props.getSwitches from the SwitchBarList FC, but that requires React >= 16.8
class SwitchBarListShim extends React.Component {
  constructor(props) {
    super(props);
    this.props.getSwitches();
  }

  render() {
    return (<SwitchBarList {...this.props} />);
  }
}

export default SwitchBarListShim;

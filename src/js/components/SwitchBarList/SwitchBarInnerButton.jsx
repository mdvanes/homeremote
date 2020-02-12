// eslint-disable-next-line no-unused-vars
import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {deepPurple500, deepPurple900} from 'material-ui/styles/colors';

const getActiveStyle = isActive =>  ({ backgroundColor: isActive ? deepPurple500 : 'transparent' });

const SwitchBarInnerButton = ({ isReadOnly, clickAction, icon, isActive}) => {
  return <button
    onTouchTap={isReadOnly ? null : clickAction}
    style={getActiveStyle(isActive)}>
    {isReadOnly ? <div className="dummy"></div> : <FontIcon hoverColor={deepPurple900} className="material-icons">{icon}</FontIcon>}
  </button>
};

export default SwitchBarInnerButton;

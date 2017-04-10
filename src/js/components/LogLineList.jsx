import React, { PropTypes } from 'react';

// TODO merge with log.jsx (add clear log button here, or should it be via a container?)

class LogLineList extends React.Component {
    render() {
        return (
          <ul>
            {this.props.loglines.map(logline =>
              <li key={logline.message}>
                {logline.message}
              </li>
            )}
          </ul>
        );
    }
}

// TODO remove old ES5 implementation
// const LogLineList = ({ loglines }) => (
//  <ul>
//    {loglines.map(logline =>
//      <li key={logline.message}>
//        {logline.message}
//      </li>
//    )}
//  </ul>
// )

LogLineList.propTypes = {
    loglines: PropTypes.arrayOf(PropTypes.shape({
        message: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default LogLineList;
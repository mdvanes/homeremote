// import React from 'react'; // eslint-disable-line no-unused-vars
// import ButtonGroup from './button-group';
// import $http from '../request';
// import logger from '../logger';
//
// class MacroButtonGroup extends ButtonGroup {
//     constructor(props) {
//         super(props);
//         if(!this.props.id) {
//             throw new Error('property "ids" is required on Toggle');
//         }
//         this.sendOn = this.sendOn.bind(this);
//         this.sendOff = this.sendOff.bind(this);
//     }
//
//     send(id, state) {
//         $http('/' + id + '/' + state)
//             .then(data => {
//                 if(data.status !== 'received') {
//                     logger.error('error on send: ' + data.status);
//                 }
//             })
//             .catch(error => logger.error('error on sendOn: ' + error));
//     }
//
//     sendOn() {
//         this.props.id.forEach(id => {
//             this.send(id, 'on');
//         });
//     }
//
//     sendOff() {
//         this.props.id.forEach(id => {
//             this.send(id, 'off');
//         });
//     }
// }
//
// export default MacroButtonGroup;
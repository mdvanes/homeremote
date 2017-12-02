// let logger = {};
//
// /* TODO remove, deprecated by actions/index.js */
//
// let writeLog = (...messages) => {
//     let time = new Date();
//     let timestamp = time.toTimeString().substring(0,8);
//     const logElem = document.querySelector('.log');
//     const line = document.createElement('div');
//     line.innerHTML = `${timestamp} ${messages.join(' ')}\n`;
//     logElem.insertBefore(line, logElem.children[0]);
// };
//
// logger.clear = () => {
// 	const logElem = document.querySelector('.log');
//     Array.from(logElem.children).forEach(item => {
//     	logElem.removeChild(item);
//     });
// };
//
// logger.log = message => {
//     writeLog('INFO:    ', message);
// };
//
// logger.error = message => {
//     writeLog('ERROR:', message);
// };
//
// export default logger;
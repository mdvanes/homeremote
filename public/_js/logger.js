/**
 * Created by m.van.es on 6-2-2016.
 */

let logger = {};

let writeLog = (...messages) => {
    let time = new Date();
    let timestamp = time.toTimeString().substring(0,8);
    document.querySelector('.log').value = timestamp + ' ' +
        messages.join(' ') + '\n' +
        document.querySelector('.log').value;
};

logger.clear = () => {
    document.querySelector('.log').value = '';
};

logger.log = message => {
    writeLog('INFO:    ', message);
};

logger.error = message => {
    writeLog('ERROR:', message);
};

export default logger;
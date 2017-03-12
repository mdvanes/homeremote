/**
 * Created by m.van.es on 16-1-2016.
 */

// TODO replace by Fetch API

/*
 Pure ES6, promise based, http requester

 Usage:

 $http('http://example.com/someurl/')
     .then(data => {}})
     .catch(error => {})
 */
let $http = url => {
    return new Promise(function(resolve, reject) {
        // Standard XHR to load an image
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        // When the request loads, check whether it was successful
        request.onload = function() {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                //console.log('$http succesful response', request.response);
                resolve(request.response);
            } else {
                // If it fails, reject the promise with a error message
                reject(Error('URL didn\'t load successfully; error code:' + request.statusText));
            }
        };
        request.onerror = function() {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(Error('There was a network error.'));
        };
        // Send the request
        request.send();
    });
};

export default $http;
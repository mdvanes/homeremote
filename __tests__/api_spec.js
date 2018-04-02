// Run with `./node_modules/.bin/jest`

const frisby = require('frisby');

it('should be a teapot', function (done) {
    frisby.get('http://httpbin.org/status/418')
        .expect('status', 418)
        .done(done);
});

it('should be the login page', function (done) {
    frisby.get('https://localhost:3000')
    //.inspectBody()
        .expect('status', 200)
        .done(done);
    // TODO also test the contents of the body
});

it('should redirect /fm/list to the login page', function (done) {
    frisby.get('http://localhost:3000/fm/list')
    //.inspectBody()
        .expect('status', 200)
        .done(done);
});

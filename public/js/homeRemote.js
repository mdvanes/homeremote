'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function ($) {
    'use strict';

    var BroadcastButton = function BroadcastButton($elem) {
        _classCallCheck(this, BroadcastButton);

        this.$elem = $elem;
        console.log('BroadcastButton', this.$elem);

        console.log('foo');
        $.get('/broadcast/status').done(function (data) {
            if (data === 'foo') {
                console.log('running');
            } else {
                console.log('stopped');
            }
        });

        this.$elem.click(function () {
            return $.get('/broadcast/start').done(function (data) {
                console.log('xhr response: ' + data);
            });
        });
    };

    $('document').ready(function () {
        new BroadcastButton($('#broadcast'));
    });
})(jQuery);
//# sourceMappingURL=homeRemote.js.map

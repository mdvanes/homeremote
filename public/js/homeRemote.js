'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function ($) {
    'use strict';

    var BroadcastButton = function BroadcastButton($elem) {
        var _this = this;

        _classCallCheck(this, BroadcastButton);

        this.$elem = $elem;
        console.log('BroadcastButton', this.$elem);

        $.get('/broadcast/status').done(function (data) {
            if (data === 'running') {
                _this.$elem.addClass('active');
            } else {
                _this.$elem.removeClass('active');
            }
        });

        this.$elem.click(function () {
            return $.get('/broadcast/start' /*,
                                            {
                                            }*/).done(function (data) {
                if (data === 'ok') {
                    _this.$elem.addClass('active');
                } else {
                    alert('an error has occurred');
                }
            });
        });
    };

    $('document').ready(function () {
        new BroadcastButton($('#broadcast'));
    });
})(jQuery);
//# sourceMappingURL=homeRemote.js.map

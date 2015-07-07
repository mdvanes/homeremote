'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function ($) {
    'use strict';

    var BroadcastButton = (function () {
        function BroadcastButton($elem) {
            var _this = this;

            _classCallCheck(this, BroadcastButton);

            this.$elem = $elem;
            this.active = false;
            console.log('BroadcastButton', this.$elem);

            $.get('/broadcast/status').done(function (data) {
                if (data === 'running') {
                    // TODO setActive
                    _this.$elem.addClass('active');
                    _this.active = true;
                } else if (data === 'waiting') {
                    // TODO setInActive
                    _this.$elem.removeClass('active');
                } else {}
            });

            this.$elem.click(function () {
                return _this.click();
            });
        }

        _createClass(BroadcastButton, [{
            key: 'click',
            value: function click() {
                var _this2 = this;

                this.$elem.attr('class', ''); // clear all classes
                this.$elem.addClass('waiting');
                // TODO or .error?
                if (this.active) {
                    $.get('/broadcast/stop').done(function (data) {
                        return _this2.handleStopResponse(data);
                    });
                } else {
                    $.get('/broadcast/start' /*,
                                             {
                                             }*/).done(function (data) {
                        // TODO
                        if (data === 'ok') {
                            _this2.setActive();
                        } else {
                            _this2.$elem.attr('class', ''); // clear all classes
                            _this2.$elem.addClass('error');
                            alert('an error has occurred');
                        }
                    });
                }
            }
        }, {
            key: 'setActive',
            value: function setActive() {
                this.$elem.attr('class', ''); // clear all classes
                this.$elem.addClass('active');
                this.active = true;
            }
        }, {
            key: 'handleStopResponse',
            value: function handleStopResponse(data) {
                if (data === 'ok') {
                    this.$elem.attr('class', ''); // clear all classes
                    this.active = false;
                } else {
                    this.$elem.attr('class', ''); // clear all classes
                    this.$elem.addClass('error');
                    alert('an error has occurred');
                }
            }
        }]);

        return BroadcastButton;
    })();

    $('document').ready(function () {
        new BroadcastButton($('#broadcast'));
    });
})(jQuery);

// TODO error
//# sourceMappingURL=homeRemote.js.map

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function ($) {
    'use strict';

    // TODO rebuild in React?

    var BroadcastButton = (function () {
        function BroadcastButton($elem) {
            var _this = this;

            _classCallCheck(this, BroadcastButton);

            this.$elem = $elem;
            this.active = false;
            this.allClasses = 'hr-error hr-waiting hr-active';
            //console.log('BroadcastButton', this.$elem);

            $.get('/broadcast/status').done(function (data) {
                if (data === 'running') {
                    _this.setActive();
                } else if (data === 'waiting') {
                    _this.setInActive();
                } else {
                    _this.setError();
                }
            });

            this.$elem.click(function () {
                return _this.click();
            });
        }

        _createClass(BroadcastButton, [{
            key: 'click',
            value: function click() {
                var _this2 = this;

                //this.$elem.attr('class',''); // clear all classes
                //this.$elem.addClass('waiting');
                this.$elem.removeClass(this.allClasses).addClass('waiting');
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
                //this.$elem.attr('class',''); // clear all classes
                //this.$elem.addClass('active');
                this.$elem.removeClass(this.allClasses).addClass('hr-active');
                this.active = true;
            }
        }, {
            key: 'setInActive',
            value: function setInActive() {
                this.$elem.removeClass(this.allClasses);
                this.active = false;
            }
        }, {
            key: 'setError',
            value: function setError() {
                this.$elem.removeClass(this.allClasses).addClass('hr-error');
                alert('an error has occurred');
            }
        }, {
            key: 'handleStopResponse',
            value: function handleStopResponse(data) {
                if (data === 'ok') {
                    //this.$elem.attr('class',''); // clear all classes
                    //this.active = false;
                    this.setInActive();
                } else {
                    this.setError();
                }
            }
        }]);

        return BroadcastButton;
    })();

    $('document').ready(function () {
        new BroadcastButton($('#broadcast'));
    });
})(jQuery);
//# sourceMappingURL=homeRemote.js.map

/*! HomeRemote 0.0.0 2015-07-10 20:29 */
"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
            "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
        Constructor;
    };
}(), RadioToggleButton = function() {
    function RadioToggleButton($elem) {
        var _this = this;
        _classCallCheck(this, RadioToggleButton), this.$elem = $elem, this.$elem.click(function() {
            return _this.toggleRadio();
        });
    }
    return _createClass(RadioToggleButton, [ {
        key: "toggleRadio",
        value: function() {
            $.get("http://192.168.0.8/radio/state.php?c=play").done(function(data) {
                return console.log(data);
            });
        }
    } ]), RadioToggleButton;
}(), RadioToggleButtonTempStop = function() {
    function RadioToggleButtonTempStop($elem) {
        var _this2 = this;
        _classCallCheck(this, RadioToggleButtonTempStop), this.$elem = $elem, this.$elem.click(function() {
            return _this2.toggleRadio();
        });
    }
    return _createClass(RadioToggleButtonTempStop, [ {
        key: "toggleRadio",
        value: function() {
            $.get("http://192.168.0.8/radio/state.php?c=stop").done(function(data) {
                return console.log(data);
            });
        }
    } ]), RadioToggleButtonTempStop;
}(), _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
            "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
        Constructor;
    };
}();

!function($) {
    var BroadcastButton = function() {
        function BroadcastButton($elem) {
            var _this = this;
            _classCallCheck(this, BroadcastButton), this.$elem = $elem, this.active = !1, this.allClasses = "hr-error hr-waiting hr-active", 
            $.get("/broadcast/status").done(function(data) {
                "running" === data ? _this.setActive() : "waiting" === data ? _this.setInActive() : _this.setError();
            }), this.$elem.click(function() {
                return _this.click();
            });
        }
        return _createClass(BroadcastButton, [ {
            key: "click",
            value: function() {
                var _this2 = this;
                this.$elem.removeClass(this.allClasses).addClass("waiting"), this.active ? $.get("/broadcast/stop").done(function(data) {
                    return _this2.handleStopResponse(data);
                }) : $.get("/broadcast/start").done(function(data) {
                    "ok" === data ? _this2.setActive() : (_this2.$elem.attr("class", ""), _this2.$elem.addClass("error"), 
                    alert("an error has occurred"));
                });
            }
        }, {
            key: "setActive",
            value: function() {
                this.$elem.removeClass(this.allClasses).addClass("hr-active"), this.active = !0;
            }
        }, {
            key: "setInActive",
            value: function() {
                this.$elem.removeClass(this.allClasses), this.active = !1;
            }
        }, {
            key: "setError",
            value: function() {
                this.$elem.removeClass(this.allClasses).addClass("hr-error"), alert("an error has occurred");
            }
        }, {
            key: "handleStopResponse",
            value: function(data) {
                "ok" === data ? this.setInActive() : this.setError();
            }
        } ]), BroadcastButton;
    }(), RadioInfo = function() {
        function RadioInfo($elem) {
            var _this3 = this;
            _classCallCheck(this, RadioInfo), this.$elem = $elem, this.$elem.click(function() {
                return _this3.toggleRadio();
            });
        }
        return _createClass(RadioInfo, [ {
            key: "toggleRadio",
            value: function() {
                console.log("info"), $.get("/radio/info").done(function(data) {
                    if ("error" !== data) {
                        var oldVal = $("#log").val();
                        $("#log").val(data + oldVal);
                    }
                });
            }
        } ]), RadioInfo;
    }();
    $("document").ready(function() {
        new BroadcastButton($("#broadcast")), new RadioToggleButton($("#play")), new RadioToggleButtonTempStop($("#stop")), 
        new RadioInfo($("#info"));
    });
}(jQuery);
//# sourceMappingURL=homeRemote.js.map
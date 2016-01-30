/*! HomeRemote 0.0.0 2016-01-30 19:27 */
"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}

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
}(), BroadcastButton = function() {
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
            $.get("/radio/play").done(function(data) {
                "error" !== data ? console.log(data) : alert("an error has occurred");
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
            $.get("/radio/stop").done(function(data) {
                "error" !== data ? console.log(data) : alert("an error has occurred");
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
}(), RadioInfoButton = function() {
    function RadioInfoButton($elem) {
        var _this = this;
        _classCallCheck(this, RadioInfoButton), this.$elem = $elem, this.$elem.click(function() {
            return _this.toggleRadio();
        });
    }
    return _createClass(RadioInfoButton, [ {
        key: "toggleRadio",
        value: function() {
            $.get("/radio/info").done(function(data) {
                if ("error" !== data) {
                    var oldVal = $("#log").val();
                    $("#log").val(data + oldVal);
                } else alert("an error has occurred");
            });
        }
    } ]), RadioInfoButton;
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
}(), RekelboxButtonGroup = function() {
    function RekelboxButtonGroup($elem) {
        _classCallCheck(this, RekelboxButtonGroup), this.$elem = $elem, this.$manual = $("#rekelboxManual");
        var self = this;
        $(".btn", this.$elem).click(function() {
            self.click(this);
        }), $(".btn", this.$manual).click(function() {
            self.clickManual(this);
        });
    }
    return _createClass(RekelboxButtonGroup, [ {
        key: "click",
        value: function(clickedElem) {
            $(".btn", this.$elem).removeClass("btn-success"), $(clickedElem).addClass("btn-success");
            var state = $(clickedElem).data("state");
            "manual" === state ? $(".btn", this.$manual).removeAttr("disabled") : $(".btn", this.$manual).attr("disabled", "disabled").removeClass("btn-success"), 
            "broek" === state ? console.debug("send broek") : "pi" === state ? console.debug("send pi") : "debug" === state && console.debug("send debug");
        }
    }, {
        key: "toggleLight",
        value: function($elem, cssClass) {
            $elem.is("." + cssClass) ? $elem.removeClass(cssClass) : ($elem.addClass(cssClass), 
            console.debug("send manual update"));
        }
    }, {
        key: "clickManual",
        value: function(clickedElem) {
            "1" === $(clickedElem).text() ? this.toggleLight($(clickedElem), "btn-success") : "2" === $(clickedElem).text() || "3" === $(clickedElem).text() ? this.toggleLight($(clickedElem), "btn-warning") : this.toggleLight($(clickedElem), "btn-danger");
        }
    } ]), RekelboxButtonGroup;
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
    var ClearButton = function() {
        function ClearButton($elem) {
            var _this = this;
            _classCallCheck(this, ClearButton), this.$elem = $elem, this.$elem.click(function() {
                return _this.clearLog();
            });
        }
        return _createClass(ClearButton, [ {
            key: "clearLog",
            value: function() {
                $("#log").val("");
            }
        } ]), ClearButton;
    }();
    $("document").ready(function() {
        new BroadcastButton($("#broadcast")), new RadioToggleButton($("#play")), new RadioToggleButtonTempStop($("#stop")), 
        new RadioInfoButton($("#info")), new ClearButton($("#clear")), new RekelboxButtonGroup($("#rekelboxButtonGroup"));
    });
}(jQuery);
//# sourceMappingURL=homeRemote.js.map
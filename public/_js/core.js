import RadioToggleButton from 'classes/RadioToggleButton';
import {RadioToggleButtonTempStop} from 'classes/RadioToggleButton';

(function($) {
    'use strict';

    // TODO rebuild in React?

    class BroadcastButton {
        constructor($elem) {
            this.$elem = $elem;
            this.active = false;
            this.allClasses = 'hr-error hr-waiting hr-active';
            //console.log('BroadcastButton', this.$elem);

            $.get('/broadcast/status')
                .done((data) => {
                    if (data === 'running') {
                        this.setActive();
                    } else if(data === 'waiting') {
                        this.setInActive();
                    } else {
                        this.setError();
                    }
                }
            );

            this.$elem.click(() => this.click());
        }

        click() {
            //this.$elem.attr('class',''); // clear all classes
            //this.$elem.addClass('waiting');
            this.$elem
                .removeClass(this.allClasses)
                .addClass('waiting');
            // TODO or .error?
            if(this.active) {
                $.get('/broadcast/stop')
                    .done((data) => this.handleStopResponse(data));
            } else {
                $.get('/broadcast/start'/*,
                 {
                 }*/)
                    .done((data) => {
                        // TODO
                        if (data === 'ok') {
                            this.setActive();
                        } else {
                            this.$elem.attr('class',''); // clear all classes
                            this.$elem.addClass('error');
                            alert('an error has occurred');
                        }
                    }
                );
            }
        }

        setActive() {
            //this.$elem.attr('class',''); // clear all classes
            //this.$elem.addClass('active');
            this.$elem
                .removeClass(this.allClasses)
                .addClass('hr-active');
            this.active = true;
        }

        setInActive() {
            this.$elem.removeClass(this.allClasses);
            this.active = false;
        }

        setError() {
            this.$elem
                .removeClass(this.allClasses)
                .addClass('hr-error');
            alert('an error has occurred');
        }

        handleStopResponse(data) {
            if (data === 'ok') {
                //this.$elem.attr('class',''); // clear all classes
                //this.active = false;
                this.setInActive();
            } else {
                this.setError();
            }
        }
    }

    //class RadioToggleButton {
    //    constructor($elem) {
    //        this.$elem = $elem;
    //        this.$elem.click(() => this.toggleRadio());
    //    }
    //
    //    // TODO works, but doesn't return anything (CORS error), so can't toggle
    //    toggleRadio() {
    //        $.get('http://192.168.0.8/radio/state.php?c=play')
    //            .done((data) => console.log(data));
    //    }
    //}

    //class RadioToggleButtonTempStop {
    //    constructor($elem) {
    //        this.$elem = $elem;
    //        this.$elem.click(() => this.toggleRadio());
    //    }
    //
    //    toggleRadio() {
    //        $.get('http://192.168.0.8/radio/state.php?c=stop')
    //            .done((data) => console.log(data));
    //    }
    //}

    class RadioInfo {
        constructor($elem) {
            this.$elem = $elem;
            this.$elem.click(() => this.toggleRadio());
        }

        toggleRadio() {
            console.log('info');
            $.get('http://192.168.0.8/radio/state.php?c=info')
                .done((data) => {
                    // TODO can be fixed with server side call?
                    console.log('no data logged, because cross domain call', data);
                    var oldVal = $('#log').val();
                    $('#log').val(data.message + oldVal);
                });
        }
    }

    $('document').ready(function() {
        new BroadcastButton($('#broadcast'));
        new RadioToggleButton($('#play'));
        new RadioToggleButtonTempStop($('#stop'));
        new RadioInfo($('#info'));
    });
})(jQuery);
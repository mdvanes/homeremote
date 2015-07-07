(function($) {
    'use strict';

    class BroadcastButton {
        constructor($elem) {
            this.$elem = $elem;
            this.active = false;
            console.log('BroadcastButton', this.$elem);

            $.get('/broadcast/status')
                .done((data) => {
                    if (data === 'running') {
                        // TODO setActive
                        this.$elem.addClass('active');
                        this.active = true;
                    } else if(data === 'waiting') {
                        // TODO setInActive
                        this.$elem.removeClass('active');
                    } else {
                        // TODO error
                    }
                }
            );

            this.$elem.click(() => this.click());
        }

        click() {
            this.$elem.attr('class',''); // clear all classes
            this.$elem.addClass('waiting');
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
            this.$elem.attr('class',''); // clear all classes
            this.$elem.addClass('active');
            this.active = true;
        }

        handleStopResponse(data) {
            if (data === 'ok') {
                this.$elem.attr('class',''); // clear all classes
                this.active = false;
            } else {
                this.$elem.attr('class',''); // clear all classes
                this.$elem.addClass('error');
                alert('an error has occurred');
            }
        }
    }

    $('document').ready(function() {
        new BroadcastButton($('#broadcast'));
    });
})(jQuery);
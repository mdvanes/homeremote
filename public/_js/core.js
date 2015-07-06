(function($) {
    'use strict';

    class BroadcastButton {
        constructor($elem) {
            this.$elem = $elem;
            console.log('BroadcastButton', this.$elem);

            $.get('/broadcast/status')
                .done((data) => {
                    if (data === 'running') {
                        this.$elem.addClass('active');
                    } else {
                        this.$elem.removeClass('active');
                    }
                }
            );

            this.$elem.click(() =>
                $.get('/broadcast/start'/*,
                    {

                    }*/)
                    .done((data) => {
                        if (data === 'ok') {
                            this.$elem.addClass('active');
                        } else {
                            alert('an error has occurred');
                        }
                    }
                )
            );
        }
    }

    $('document').ready(function() {
        new BroadcastButton($('#broadcast'));
    });
})(jQuery);
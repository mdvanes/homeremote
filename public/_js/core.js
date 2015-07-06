(function($) {
    'use strict';

    class BroadcastButton {
        constructor($elem) {
            this.$elem = $elem;
            console.log('BroadcastButton', this.$elem);

            console.log('foo');
            $.get('/broadcast/status')
                .done((data) => {
                    if (data === 'foo') {
                        console.log('running');
                    } else {
                        console.log('stopped');
                    }
                }
            );

            this.$elem.click(() =>
                $.get('/broadcast/start')
                    .done((data) => {
                        console.log('xhr response: ' + data);
                    }
                )
            );
        }
    }

    $('document').ready(function() {
        new BroadcastButton($('#broadcast'));
    });
})(jQuery);
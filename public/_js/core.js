import BroadcastButton from 'classes/BroadcastButton';
import RadioToggleButton from 'classes/RadioToggleButton';
import {RadioToggleButtonTempStop} from 'classes/RadioToggleButton';
import RadioInfoButton from 'classes/RadioInfoButton';

(function($) {
    'use strict';

    class ClearButton {
        constructor($elem) {
            this.$elem = $elem;
            this.$elem.click(()=>this.clearLog());
        }

        clearLog() {
            $('#log').val('');
        }
    }

    // TODO rebuild in React?
    $('document').ready(function() {
        new BroadcastButton($('#broadcast'));
        new RadioToggleButton($('#play'));
        new RadioToggleButtonTempStop($('#stop'));
        new RadioInfoButton($('#info'));
        new ClearButton($('#clear'));
    });
})(jQuery);
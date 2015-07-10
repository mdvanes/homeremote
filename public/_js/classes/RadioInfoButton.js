/**
 * Created by m.van.es on 10-7-2015.
 */

export default class RadioInfoButton {
    constructor($elem) {
        this.$elem = $elem;
        this.$elem.click(() => this.toggleRadio());
    }

    toggleRadio() {
        $.get('/radio/info')
            .done(data => {
                if(data !== 'error') {
                    var oldVal = $('#log').val();
                    $('#log').val(data + oldVal);
                } else {
                    alert('an error has occurred');
                }
            });
    }
}
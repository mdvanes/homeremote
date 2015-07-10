/**
 * Created by m.van.es on 8-7-2015.
 */

export default class RadioToggleButton {
    constructor($elem) {
        this.$elem = $elem;
        this.$elem.click(() => this.toggleRadio());
    }

    toggleRadio() {
        $.get('/radio/play')
            .done(data => {
                if(data !== 'error') {
                    console.log(data);
                } else {
                    alert('an error has occurred');
                }
            });
    }
}

export class RadioToggleButtonTempStop {
    constructor($elem) {
        this.$elem = $elem;
        this.$elem.click(() => this.toggleRadio());
    }

    toggleRadio() {
        $.get('/radio/stop')
            .done(data => {
                if(data !== 'error') {
                    console.log(data);
                } else {
                    alert('an error has occurred');
                }
            });
    }
}
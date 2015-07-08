/**
 * Created by m.van.es on 8-7-2015.
 */

export default class RadioToggleButton {
    constructor($elem) {
        this.$elem = $elem;
        this.$elem.click(() => this.toggleRadio());
    }

    // TODO works, but doesn't return anything (CORS error), so can't toggle
    toggleRadio() {
        $.get('http://192.168.0.8/radio/state.php?c=play')
            .done((data) => console.log(data));
    }
}

export class RadioToggleButtonTempStop {
    constructor($elem) {
        this.$elem = $elem;
        this.$elem.click(() => this.toggleRadio());
    }

    toggleRadio() {
        $.get('http://192.168.0.8/radio/state.php?c=stop')
            .done((data) => console.log(data));
    }
}
/**
 * Created by m.van.es on 10-7-2015.
 */

export default class BroadcastButton {
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
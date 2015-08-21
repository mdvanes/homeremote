
export default class RekelboxButtonGroup {
    constructor($elem) {
        this.$elem = $elem;

        this.$manual = $('#rekelboxManual');

        //this.$elem.find('.btn').click(() => this.click());

        var self = this;
        $('.btn', this.$elem).click(function() {
            self.click(this);
        });

        $('.btn', this.$manual).click(function() {
            self.clickManual(this);
        });
    }

    click(clickedElem) {
        //console.log('clicked', clickedElem);
        $('.btn', this.$elem).removeClass('btn-success');
        $(clickedElem).addClass('btn-success');

        var state = $(clickedElem).data('state');

        // Toggle manual button group
        if(state === 'manual') {
            $('.btn', this.$manual).removeAttr('disabled');
        } else {
            $('.btn', this.$manual)
                .attr('disabled', 'disabled')
                .removeClass('btn-success');
        }

        // Send request
        if(state === 'broek') {
            console.debug('send broek');
        } else if(state === 'pi') {
            console.debug('send pi');
        } else if(state === 'debug') {
            console.debug('send debug'); // pulsing signal
        }
    }

    toggleLight($elem, cssClass) {
        if($elem.is('.' + cssClass)) {
            $elem.removeClass(cssClass);
        } else {
            $elem.addClass(cssClass);
            console.debug('send manual update');
        }
    }

    clickManual(clickedElem) {
        if($(clickedElem).text() === '1') {
            this.toggleLight($(clickedElem), 'btn-success');
        } else if (
            $(clickedElem).text() === '2' ||
            $(clickedElem).text() === '3') {
            this.toggleLight($(clickedElem), 'btn-warning');
        } else {
            this.toggleLight($(clickedElem), 'btn-danger');
        }
    }
}
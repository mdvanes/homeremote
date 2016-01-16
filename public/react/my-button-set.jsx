import React from 'react';

class MyButtonSet extends React.Component {
    constructor(props) {
        super(props);
        //this.state = {isChecked: false};
        //this.onChange = this.onChange.bind(this);
    }

    handleClick() {
        //console.log('setting on', this);
        //this.setState({isChecked: true});
        console.log('clicked ');
        //this.setState({isChecked: true});
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">{this.props.label}</div>
                <div className="panel-body">
                    <div className="btn-group btn-group-justified">
                        <a href="#" className={'btn btn-default'} onClick={this.handleClick.bind(this)}>
                            <i className="glyphicon glyphicon-plus-sign"></i> on
                        </a>{/* for this.onChange, the bind is done in the constructor */}
                        <a href="#" className={'btn btn-default'}>off</a>
                    </div>
                </div>
            </div>
        );
    }
}
export default MyButtonSet;
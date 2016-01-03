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
            <div>
                <label>
                    {this.props.label}
                </label>
                <div className="btn-group btn-group-justified">
                    <a href="#" className={'btn btn-info'} onClick={this.handleClick.bind(this)}>on</a>{/* for this.onChange, the bind is done in the constructor */}
                    <a href="#" className={'btn btn-default'}>off</a>
                </div>
            </div>
        );
    }
}
export default MyButtonSet;
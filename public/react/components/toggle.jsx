import React from 'react';
import classNames from 'classnames';
import $http from '../request';

class MyToggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isChecked: false};
        $http('/togglestub/status')
            .then(data => {
                if(data.status === 'started') {
                    this.setState({isChecked: true});
                }
            })
            .catch(error => alert('error on toggle' + error));

        this.onChange = this.onChange.bind(this);
        this.sendToggle = this.sendToggle.bind(this);
    }

    onChange() {
        console.log('onchange', this, this.state);
        this.setState({isChecked: !this.state.isChecked});
    }

    sendToggle() {
        let url = '/togglestub/';
        if(this.state.isChecked) {
            url += 'stop';
        } else {
            url += 'start';
        }
        $http(url)
            .then(data => {
                if(data.status === 'started') {
                    this.setState({isChecked: true});
                } else if(data.status === 'stopped') {
                    this.setState({isChecked: false});
                }
            })
            .catch(error => alert('error on toggle' + error));
    }

    //handleClickOff() {
    //    this.setState({isChecked: false});
    //}

    render() {
        let btnClass = classNames({
            'btn': true,
            'btn-success': this.state.isChecked,
            'btn-danger': !this.state.isChecked
        });
        return (
            <div>
                <label>
                    {this.props.label}
                    <input type="checkbox" checked={this.state.isChecked}
                           onChange={this.onChange}/>
                    {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
                </label>

                <button className={btnClass} onClick={this.sendToggle}>
                    {this.props.label}
                </button>
            </div>
        );
    }
}
export default MyToggle;

//import React from 'react';
////import ProductTable from './components/product-table';
////import SearchBar from './components/search-bar';
//
//
//
//// Radio example: https://facebook.github.io/jest/docs/tutorial-react.html
//
//class MyRadio extends React.Component {
//
//    constructor() {
//        super();
//
//        //this.handleUserInput = this.handleUserInput.bind(this);
//
//        //this.state = {
//        //    filterText: '',
//        //    inStockOnly: false
//        //}
//    }
//
//    //handleUserInput(filterText, inStockOnly) {
//    //    this.setState({
//    //        filterText: filterText,
//    //        inStockOnly: inStockOnly
//    //    });
//    //}
//
//    render() {
//
//        const products = [
//            //{category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
//            //{category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
//            //{category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
//            //{category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
//            //{category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
//            {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
//        ];
//
//        return (
//            <div>
//                Foo
//            </div>
//        )
//    }
//
//}
//
//export default MyRadio;

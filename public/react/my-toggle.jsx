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





import React from 'react';

class MyToggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isChecked: false};
        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        console.log('onchange', this, this.state);
        this.setState({isChecked: !this.state.isChecked});
    }

    handleClickOn() {
        //console.log('setting on', this);
        //this.setState({isChecked: true});
        console.log('setting on2 ', this.state);
        this.setState({isChecked: true});
    }

    handleClickOff() {
        this.setState({isChecked: false});
    }

    render() {
        let classOn = 'btn btn-default';
        let classOff = 'btn btn-default';
        if(this.state.isChecked) {
            classOn = 'btn btn-success';
        } else {
            classOff = 'btn btn-danger';
        }
        return (
            <div>
                <label>
                    {this.props.label}
                    <input type="checkbox" checked={this.state.isChecked}
                        onChange={this.onChange}/>
                    {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
                </label>
                <div className="btn-group btn-group-justified">
                    <a href="#" className={classOn} onClick={this.handleClickOn.bind(this)}>on</a>{/* for this.onChange, the bind is done in the constructor */}
                    <a href="#" className={classOff} onClick={this.handleClickOff.bind(this)}>off</a>
                </div>
                {/*<input type="Toggle" checked={this.state.isChecked} onChange={this.onChange}/>*/}
            </div>
        );
    }
}
export default MyToggle;
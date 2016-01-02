import React from 'react';
//import ProductTable from './components/product-table';
//import SearchBar from './components/search-bar';



// Radio example: https://facebook.github.io/jest/docs/tutorial-react.html

class MyRadio extends React.Component {

    constructor() {
        super();

        //this.handleUserInput = this.handleUserInput.bind(this);

        //this.state = {
        //    filterText: '',
        //    inStockOnly: false
        //}
    }

    //handleUserInput(filterText, inStockOnly) {
    //    this.setState({
    //        filterText: filterText,
    //        inStockOnly: inStockOnly
    //    });
    //}

    render() {

        const products = [
            //{category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
            //{category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
            //{category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
            //{category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
            //{category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
            {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
        ];

        return (
            <div>
                Foo
            </div>
        )
    }

}

export default MyRadio;
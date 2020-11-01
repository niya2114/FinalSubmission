import React, { Component } from 'react';
import FormComponent from './components/FormComponent'
import './App.css'

class App extends Component {

	state = {
		loading: true,
		vendor: null
	};

	async componentDidMount() {
		var result = await fetch('https://vendorappapi.herokuapp.com/api/v1/detail')
		var data = await result.json()
		this.setState({ loading: false, vendor: data })
		console.log(data);
	}

	render() {
          
		return (
			<div className="form">
				<FormComponent/>
				{
				this.state.loading ? <div>Loading Database</div> : <div>
					<h4>Please refresh this page to load new data after uploading!!!</h4>
					<ul className="list">
					<li>Invoice uploaded is : {this.state.vendor.invoices_uploaded}</li>
					<li>Total amount is : {this.state.vendor.amount_total}</li>
					<li>Total vendors : {this.state.vendor.vendor_unique.length}</li>
				</ul></div>
			}</div>
		);
	}
}


export default App; 

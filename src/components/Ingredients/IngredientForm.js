import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import Spinner from 'components/UI/LoadingIndicator';

const IngredientForm = React.memo((props) => {
	// const inputState = useState({ title: '', amount: '' });
	// const [ inputState, setInputState ] = useState({
	// 	title: '',
	// 	amount: ''
	// });
	console.log('form rendering...');
	const [ title, setTitle ] = useState('');
	const [ amount, setAmount ] = useState('');

	const submitHandler = (event) => {
		event.preventDefault();
		// ...
		props.onAddIngredient({ title: title, amount: amount });
	};

	return (
		<section className="ingredient-form">
			<Card>
				<form onSubmit={submitHandler}>
					<div className="form-control">
						<label htmlFor="title">Name</label>
						<input
							type="text"
							id="title"
							// value={inputState[0].title}
							// value={inputState.title}
							value={title}
							onChange={(event) => {
								setTitle(event.target.value);
								// const newTitle = event.target.value;
								// // inputState[1]((prevInputState) => ({
								// setInputState((prevInputState) => ({
								// 	amount: prevInputState.amount,
								// 	title: newTitle
								// }));
							}}
						/>
					</div>
					<div className="form-control">
						<label htmlFor="amount">Amount</label>
						<input
							type="number"
							id="amount"
							// value={inputState[0].amount}
							// value={inputState.amount}
							value={amount}
							onChange={(event) => {
								setAmount(event.target.value);
								// const newAmount = event.target.value;
								// inputState[1]((prevInputState) => ({
								// setInputState((prevInputState) => ({
								// 	title: prevInputState.title,
								// 	amount: newAmount
								// }));
							}}
						/>
					</div>
					<div className="ingredient-form__actions">
						<button type="submit">Add Ingredient</button>
						{props.loading && <Spinner />}
					</div>
				</form>
			</Card>
		</section>
	);
});

export default IngredientForm;

import React, { Component } from 'react';
import '../JokeList.css';
import Joke from './Joke';
import axios from 'axios';

class JokeList extends Component {
	static defaultProps = { numJokesToGet: 10 };
	constructor(props) {
		super(props);
		this.state = { jokes: [] };

		this.vote = this.vote.bind(this);
		this.generateNewJokes = this.generateNewJokes.bind(this);
	}

	componentDidMount() {
		if (this.state.jokes.length < this.props.numJokesToGet) {
			this.getJokes();
		}
	}
	componentDidUpdate() {
		if (this.state.jokes.length < this.props.numJokesToGet) {
			this.getJokes();
		}
	}
	generateNewJokes() {
		this.setState(() => ({ jokes: [] }));
	}
	vote(id, delta) {
		this.setState((state) => ({
			jokes : state.jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
		}));
	}
	async getJokes() {
		try {
			let jokes = this.state.jokes;
			let seenJokes = new Set();
			while (jokes.length < this.props.numJokesToGet) {
				let res = await axios.get('https://icanhazdadjoke.com', {
					headers : { Accept: 'application/json' }
				});
				let { status, ...jokeObj } = res.data;

				if (!seenJokes.has(jokeObj.id)) {
					seenJokes.add(jokeObj.id);
					jokes.push({ ...jokeObj, votes: 0 });
				} else {
					console.error('duplicate found');
				}
			}
			this.setState({ jokes });
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		let sortedJokes = [ ...this.state.jokes ].sort((a, b) => b.votes - a.votes);
		return (
			<div className='JokeList'>
				<button className='JokeList-getmore' onClick={this.generateNewJokes}>
					Get New Jokes
				</button>

				{sortedJokes.map((j) => (
					<Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
				))}
			</div>
		);
	}
}
export default JokeList;

import React, {Component} from "react"
import ReactDOM from "react-dom"

import Safely, {networkError} from "./api"

import "../less/index.less"

export default class Index extends Component {
	constructor(props){
		super(props)
		this.state = {}
	}


	render(){
		return (
				<div>
					<div className="title">
						<h1>Peace of Mind</h1>
					</div>
					<div className="image">
						<img src="../public/logo.jpg" alt="logo"/>
					</div>
					<div className="yo-kids">
						<a href="parent.html">
	         		<button>Parent</button>
	      		</a>
					</div>

					<div className="child">
						<a href="child.html">
	         		<button>Child</button>
	      		</a>
					</div>
				</div>

		)
	}
}


ReactDOM.render(<Index/>, document.getElementById('root'))
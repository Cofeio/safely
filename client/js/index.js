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
			<div class="yo-kids">
				We are Safely. Protect yo kids!
				<a href="parent.html">
					<button>Parents</button>
				</a>
			</div>
		)
	}
}


ReactDOM.render(<Index/>, document.getElementById('root'))
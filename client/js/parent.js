import React, {Component} from "react"
import ReactDOM from "react-dom"

import Safely, {networkError} from "./api"

import "../less/parent.less"

export default class Index extends Component {
	constructor(props){
		super(props)
		this.state = {}
	}


	render(){
		return (

			<body>

					<label class="container">Crime
					  <input type="checkbox"/>
					  <span class="checkmark"></span>
					</label>

					<label class="container">Busy Streets
					  <input type="checkbox"/>
					  <span class="checkmark"></span>
					</label>

					<label class="container">Developers
					  <input type="checkbox"/>
					  <span class="checkmark"></span>
					</label>

				<div className="index">
						<a href="index.html">
	         	<button>Back</button>
	      			</a>
	      		</div>


				<div className="submit">
						<a href="parent.html">
	         	<button>Submit</button>
	      			</a>
	      		</div>


	      	</body>


			  

		)
	}
}


ReactDOM.render(<Index/>, document.getElementById('root'))
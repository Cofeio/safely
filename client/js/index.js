import React, {Component} from "react"
import ReactDOM from "react-dom"
import Button from '@material-ui/core/Button';

import Safely, {networkError} from "./api"
import Navbar from "./navbar"

import "../less/index.less"

export default class Index extends Component {
	constructor(props){
		super(props)
		this.state = {}
	}


	render(){
		return (
				<div className="landing">
          <Navbar />
					<div className="image">
						<img src="logo.jpeg" alt="logo" style={{ height: "32px" }}/>
					</div>
          <div className="title">
            <h1>peace of mind</h1>
          </div>
          <div className="button-holder">
            <Button href="parent.html" classes={{ root: "parent-button" }}>
              Parent
            </Button>
            <Button href="child.html" classes={{ root: "child-button" }}>
              Child
            </Button>
          </div>
				</div>

		)
	}
}


ReactDOM.render(<Index/>, document.getElementById('root'))
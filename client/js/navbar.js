import React, { Component } from "react"

import "../less/index.less"

export default class Navbar extends Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id="navbar">
        <span className="burger">☰</span>
      </div>
    )
  }
}

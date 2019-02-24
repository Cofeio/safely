import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Safely, { networkError } from "./api"

const defaultProps = {

}

export default class Child extends Component {
  constructor(props){
    super(props)
    this.state = {
      intervals: [],
      locationWatch: [],
      coords: {}
    }

    this.api = new Safely()

    this.updateLocation = this.updateLocation.bind(this)
    this.sendLocationUpdate = this.sendLocationUpdate.bind(this)
  }

  componentDidMount(){
    this.api.getChildLocation().then(({data, message}) => {
      this.updateLocation(data)
      navigator.geolocation.getCurrentPosition((position) => {
        this.updateLocation(position.coords)
        let locationWatchId = navigator.geolocation.watchPosition(({coords}) => {
          this.updateLocation(coords)
        })

        let intervalId = window.setInterval(this.sendLocationUpdate, 5000)
        this.setState({
          intervals: [intervalId],
          locationWatch: [locationWatchId]
        })
      })

    }, networkError)

  }

  componentWillUnmount(){
    const { intervals, locationWatch } = this.state 
    intervals.forEach(id => {
      window.clearInterval(id)
    })

    locationWatch.forEach(id => {
      navigator.geolocation.clearWatch(id)
    })
  }

  updateLocation(coords){
    this.setState({coords})
  }

  sendLocationUpdate(){
    const { coords } = this.state

    if(coords && coords.latitude != null && coords.longitude != null){
      this.api.updateChildLocation(coords).then((response) => {
        console.log(response, this.state)
      }, networkError)
    }
  }

  render(){
    const { coords } = this.state
    return(
      <div>
        <h1>{`Lat: ${(coords || {}).latitude || ""}  Long: ${(coords || {}).longitude || ""}`}</h1>
      </div>
    )
  }
}


 ReactDOM.render(<Child {...defaultProps}/>, document.getElementById('root'))
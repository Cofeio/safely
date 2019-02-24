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

  /**
   * Calculates and displays a walking route from the St Paul's Cathedral in London
   * to the Tate Modern on the south bank of the River Thames
   *
   * A full list of available request parameters can be found in the Routing API documentation.
   * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
   *
   * @param   {H.service.Platform} platform    A stub class to access HERE services
   */
  calculateRouteFromAtoB (currentLocation, endLocation) {
    var router = platform.getRoutingService(),
      routeRequestParams = {
        mode: 'balanced;pedestrian',
        representation: 'display',
        waypoint0: `${currentLocation.lat},${currentLocation.lon}`, // St Paul's Cathedral
        waypoint1: `${endLocation.lat},${endLocation.lon}`,  // Tate Modern
        routeattributes: 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action'
      };


    router.calculateRoute(
      routeRequestParams,
      onSuccess,
      onError
    );
  }
  /**
   * This function will be called once the Routing REST API provides a response
   * @param  {Object} result          A JSONP object representing the calculated route
   *
   * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
   */
  onSuccess(result) {
    var route = result.response.route[0];
   /*
    * The styling of the route response on the map is entirely under the developer's control.
    * A representitive styling can be found the full JS + HTML code of this example
    * in the functions below:
    */
    addRouteShapeToMap(route);
    addManueversToMap(route);

    addWaypointsToPanel(route.waypoint);
    addManueversToPanel(route);
    addSummaryToPanel(route.summary);
    // ... etc.
  }


  onError(error) {
    alert('Ooops!');
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
    const { latitude, longitude } = coords || {}

    if(latitude != null && longitude != null){
      this.api.updateChildLocation({latitude, longitude}).then((response) => {
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
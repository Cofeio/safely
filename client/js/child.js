import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Safely, { networkError } from "./api"
import Navbar from './navbar'

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

    // this.platform = new H.service.Platform({
    //   "app_id": "dVQIZi3O9juorRG9J3an",
    //   "app_code": "OjUQmZqR38GegiRzveivrQ"
    // })

    this.initMap = this.initMap.bind(this)
    this.updateLocation = this.updateLocation.bind(this)
    this.sendLocationUpdate = this.sendLocationUpdate.bind(this)
  }


  componentDidMount(){
    this.api.getChildLocation().then(({data, message, waypoint, safe}) => {
      this.initMap(data.latitude, data.longitude)
      this.updateLocation({data, waypoint, safe})
      navigator.geolocation.getCurrentPosition((position) => {
        this.updateLocation({data: position.coords})
        let locationWatchId = navigator.geolocation.watchPosition(({coords}) => {
          this.updateLocation({data: coords})
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

  initMap(currentLat, currentLong){
    var mapContainer = document.getElementById('map'),
      routeInstructionsContainer = document.getElementById('panel');

    //Step 1: initialize communication with the platform
    // var platform = new H.service.Platform({
    //   "app_id": "dVQIZi3O9juorRG9J3an",
    //   "app_code": "OjUQmZqR38GegiRzveivrQ"
    // });
    var pixelRatio = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });

    //Step 2: initialize a map - this map is centered over Berlin
    var map = new H.Map(mapContainer,
      defaultLayers.normal.map,{
      center: {lat:currentLat, lng:currentLong},
      zoom: 13,
      pixelRatio: pixelRatio
    });

    window.map = map

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);
  }

  updateLocation({data, waypoint, safe}){
    if((waypoint || {}).latitude && (waypoint || {}).longitude && safe === false){
      let startCoords = `${data.latitude},${data.longitude}`
      let endCoords = `${waypoint.latitude},${waypoint.longitude}`
      calculateRouteFromAtoB (platform, startCoords, endCoords)
    }

    this.setState({coords: data})
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


  /**
   * Calculates and displays a walking route from the St Paul's Cathedral in London
   * to the Tate Modern on the south bank of the River Thames
   *
   * A full list of available request parameters can be found in the Routing API documentation.
   * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
   *
   * @param   {H.service.Platform} platform    A stub class to access HERE services
   */
    calculateRouteFromAtoB (platform) {
      var router = platform.getRoutingService(),
        routeRequestParams = {
          mode: 'shortest;pedestrian',
          representation: 'display',
          waypoint0: '51.5141,-0.0999', // St Paul's Cathedral
          waypoint1: '51.5081,-0.0985',  // Tate Modern
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

  render(){
    const { coords } = this.state
    return(
      <div>
        <Navbar/>
        {/* <h1>{`Lat: ${(coords || {}).latitude || ""}  Long: ${(coords || {}).longitude || ""}`}</h1> */}
        {/*<div id="map"/>*/}
      </div>
    )
  }
}


 ReactDOM.render(<Child {...defaultProps}/>, document.getElementById('root'))
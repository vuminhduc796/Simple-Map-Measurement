import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker,Polygon,Polyline, InfoWindow, } from 'google-maps-react';


const mapStyles = {
    width: '100%',
    height: '100%',
  };
  export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.mapClicked = this.mapClicked.bind(this);

        this.state = {
          markerList :[],
          show_info: false,
          lat_arr:[],
          lon_arr: []
        };
      }
    mapClicked(mapProps, map, clickEvent) {
      var datapoint = clickEvent.latLng.toString()
      var lat_data = datapoint.substring(1,datapoint.indexOf(","))
      var lon_data = datapoint.substring(datapoint.indexOf(",")+1,datapoint.length-1)

            this.setState({
                markerList: [...this.state.markerList,clickEvent.latLng],
                lat_arr: [...this.state.lat_arr,lat_data],
                lon_arr: [...this.state.lon_arr,lon_data]         
            }   
    )} 

    handleToggle = () => {
        this.setState({
            show_info: !this.state.show_info
        });
    }
    handle_polygon() {
      var sum_result = 0
      if(this.state.markerList.length === 1){
        return 0
      } else if (this.state.markerList.length === 2) {
        return this.calculate_side(this.state.lat_arr[0],this.state.lat_arr[1],this.state.lon_arr[0],this.state.lon_arr[1])
      }
      if (this.state.markerList.length >= 3) {
        for(var i = 1; i < this.state.markerList.length - 1 ; i++){
          sum_result = sum_result + this.calculate_triangle(i)
        }
        return sum_result.toFixed(2)
      }
      }
    
    
    calculate_triangle(start) {
        var side_1 = this.calculate_side(this.state.lat_arr[0],this.state.lat_arr[start],this.state.lon_arr[0],this.state.lon_arr[start])
        var side_2 = this.calculate_side(this.state.lat_arr[start],this.state.lat_arr[start+1],this.state.lon_arr[start],this.state.lon_arr[start+1])
        var side_3 = this.calculate_side(this.state.lat_arr[start+1],this.state.lat_arr[0],this.state.lon_arr[start+1],this.state.lon_arr[0])
        var p = (side_1+side_2+side_3)/2
        var result  = Math.sqrt(p * (p - side_3)* (p - side_2) * (p- side_1))
        return result
    }


    calculate_side(lat1,lat2,lon1,lon2) {
      const R = 6371e3; // metres
      const φ1 = lat1 * Math.PI/180; // φ, λ in radians
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180;
      const Δλ = (lon2-lon1) * Math.PI/180;
 
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const d = R * c; // in metres
      return d
}


    erase_marker(item) {
        var key = item.position
        var index = this.state.markerList.indexOf(key)
        var templist = this.state.markerList
        templist.splice(index, 1)
        if(index > -1){
            this.setState({
                markerList: templist
            })}
        
    }

    render() {
      return (
        <Map
          google={this.props.google}
          zoom={14}
          style={mapStyles}
          initialCenter={{
           lat: -37.907803,
           lng: 145.133957
          }}
          onClick={this.mapClicked}
        >

        {
        this.state.markerList.map((pos) => {
            return(     
            <Marker
            label = {1}
            key = {pos}
            position= {pos}
            onClick= {(item) => this.erase_marker(item)} 
        
            >
            </Marker>
        )
        })
        
    }
    <InfoWindow
            onCloseClick={this.handleToggle}
            visible={this.state.show_info}
            position= {this.state.markerList[0]}
            >          
            <div>
              <h4>The area in m^2: {this.handle_polygon()}</h4>
            </div>
    </InfoWindow>    
     <Polygon
    paths={[...this.state.markerList,this.state.markerList[0]]}
    fillColor="#0000FF"
    fillOpacity={0.35} 
    onClick = {this.handleToggle} 
    >

    </Polygon>
         <Polyline
    paths={[...this.state.markerList,this.state.markerList[0]]}
    strokeColor="#0002FF"
    strokeOpacity={0.8}
    strokeWeight={2}/>

        </Map>      
      );
    }
  }
  
  export default GoogleApiWrapper({
    apiKey: "YOUR_API_KEY"
  })(MapContainer);
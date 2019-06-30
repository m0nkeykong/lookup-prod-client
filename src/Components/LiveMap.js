import React, {Component} from 'react'
import Map from './Map';
import Menu from './Menu';
import axios from 'axios';
import TamplateComponent from './TemplateComponent';
import { Card, Navbar, NavDropdown, Nav, Breadcrumb } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { NavLink} from "react-router-dom";


 class LiveMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: [this.props.location.track],
      userDetails: []
    }
    this.viewMap = this.viewMap.bind(this)
  }

  componentDidMount(){
    console.log(`Entered <LiveMap> componentDidMount(), fetching userid: ${this.userid}`);

    let idOfTrack = this.props.location.idOfTrack;
    console.log(idOfTrack);

    console.log(this.props.location.track);
    this.setState({track:this.props.location.track});

    console.log("STATE:");
    console.log(this.state.track);
    // user session
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <LiveMap> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
      .then(userResponse => {
        this.setState({ userDetails: userResponse.data, loading: false });
        console.log(userResponse.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  viewMap(track,i){
    return(
      <TamplateComponent key={'track'+i} index={i}>
        <div className="container">
          <div className="row">
            <Map track={this.props.location.track}></Map>
          </div>
        </div>
      </TamplateComponent>
    )
  }

  render() {
    return (
      <div>
        <Card className="text-center">

          {/* Show Menu And User Details When Page Stop Loading sessionStorage */}
          <Menu currentPage={"Post Navigation"}> </Menu>

          {/* Page BreadCrumbs */}
          <Breadcrumb>
            <Breadcrumb.Item href="/">Login</Breadcrumb.Item>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/choose">Choose</Breadcrumb.Item>
            <Breadcrumb.Item href="">Live</Breadcrumb.Item>
            <Breadcrumb.Item active>Post</Breadcrumb.Item>
          </Breadcrumb>

          {this.viewMap()}
          <Card.Footer id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  }
}

export default LiveMap

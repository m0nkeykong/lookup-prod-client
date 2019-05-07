import React, { Component } from 'react';
import Map from './Map';
import { BeatLoader } from 'react-spinners';
import './style/AutoGenerateTrack.css';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Button, Card, Form, Col, Row, Container, Navbar, NavItem, NavDropdown, Nav, MenuItem } from 'react-bootstrap';

class ChooseExisting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userDetails: [],
      origin: '',
      destination: '',
      travelMode: 'WALKING',
      response: null,
      tracks: [],
      track: {
        startPoint: null,
        endPoint: null,
        middlePoints: null,
        travelMode: null
      }
    }

    this.onSbumit = this.onSubmit.bind(this);   
    this.onChange = this.onChange.bind(this);
    this.renderForm = this.renderForm.bind(this);

    this.getGeneratedTrack = this.getGeneratedTrack.bind(this);
    
    
    this.addTracks = this.addTracks.bind(this)
    this.viewTracks = this.viewTracks.bind(this)
    this.updateTracks = this.updateTracks.bind(this)
    this.getAllTracks = this.getAllTracks.bind(this)
    this.getReports = this.getReports.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleChange  = this.handleChange.bind(this)
  }

  componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
      .then(response => {
				this.setState({ userDetails: response.data });
        this.setState({ loading: false });
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    this.getAllTracks();

  }

  onSubmit(e){
    e.preventDefault();
    

    console.log("FROM:");
    console.log(this.state.from);
    console.log("to:");
    console.log(this.state.to);
    console.log("TYPE:");
    console.log(this.refs.walking.checked);
    console.log(this.refs.bicycling.checked);
    var checked = this.refs.bicycling.checked ? 'Bicycling' : 'Walking';

    // TODO: parse city to upper case and lower case:
    fetch(getTracksByCityURL(this.state.from,this.state.to,checked))
    .then((res) => { 
      // console.log(`RES::::::::::`);
      // console.log(res.status);       
      return res.json();      
    }).then((data) => {
      var self=this; 
      this.state.tracks = [];

      if( data.length == 0){
          self.addTracks('','','',''); 
      }    
      else{
        data.map(json => { 
          console.log(JSON.stringify(json) ); 
          self.addTracks(json._id,json.title, json.type, json.reports, json.description); 
        })  
      } 
    })
  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
    console.log("Entered onChange function");
    const {name} = e.target.name;
    const {value} = e.target.value;
    console.log(`name: ${name}, value: ${value}`);
    if(name && value){
      // Insert the changed value into state array
      this.setState({ direction: [...this.state.direction, {name: value}] });
    }
    // console.log(`Updated state direction object [{name: value:}] >> ${this.state.direction}`);
  }

  renderForm(){

  }

  getGeneratedTrack(){

  }
  
  addTracks(_id,_title,_type, _reports, _description) {
    this.setState(prevState => ({
      tracks: [
        ...prevState.tracks,      
      {
          id: this.state.tracks.length + 1,
          idOfTrack: _id,
          title: _title,
          type: _type,
          reports: _reports,
          description: _description
      }]
    }))
  }

  getAllTracks(){
    fetch(getAllTracksURL())
    .then((res) => {        
      return res.json();      
    }).then((data) => {        
      var self=this;        
      data.map((json) => {   
        // console.log(JSON.stringify(json) );          
        self.addTracks(json._id,json.title, json.type, json.reports, json.description);        
          console.log(json);  
      })    // endOf data.map((data)  
    })
  }

  // Change to class method
  checkBicycling = ({ target: { checked } }) => {
    console.log(`Entered checkBicycling ${checked}`);
    checked &&
      this.setState(
        () => ({
          travelMode: 'BICYCLING'
        })
      )
  }

  // Change to class method
  checkWalking = ({ target: { checked } }) => {
    console.log(`Entered checkWalking ${checked}`);
    checked &&
      this.setState(
        () => ({
          travelMode: 'WALKING'
        })
      )
  }

  // Change to class method
  getOrigin = ref => {
    console.log(`Entered getOrigin ${ref}`);
    this.origin = ref
  }

  // Change to class method
  getDestination = ref => {
    console.log(`Entered getDestination ${ref}`);
    this.destination = ref
  }

  // Change to class method
  onClick = () => {
    console.log(`Entered onClick`);
    if (this.origin.value !== '' && this.destination.value !== '') {
      this.setState(
        (prevState) => ({
          // track: [...prevState, {
          //   startPoint: this.origin.value,
          //   endPoint:  this.destination.value,
          //   middlePoints: null,
          //   travelMode: this.state.travelMode
          // }]
          track: {
            startPoint: this.origin.value,
            endPoint:  this.destination.value,
            middlePoints: null,
            travelMode: this.state.travelMode
          }
        }), () => {
          console.log(this.state.track);
        }
      )
      this.setState({ loading: true });
    }
    else{
      console.log(`Entered Invalid value, ORIGIN: ${this.origin.value}, DESTINATION: ${this.origin.destination}`);
    }
  }


  updateTracks(newTrack, i) {
    this.setState(() => ({
      tracks: this.state.tracks.map(
        (trck) => (trck.id !== i) ? trck : {...trck, name: newTrack}
      )
    }))
  }
  
  getReports(reports){
    let html=[];
    // Outer loop to create parent
    for (let i = 0; i < reports.length; i++) {
      html.push(<p>	&#8227; &#9;{reports[i]}</p>)
    }
    return html;
  }

  getIconType(type){
    if(type == 'Walking')
      return <MdDirectionsWalk size={20} color="black" />;
    else
      return <IoAndroidBicycle size={20} color="black" />;
     
  }

  viewTracks(track,i) {
    if(track.title == ''){
      console.log("there are no tracks to display !");
      return (
        <div>
          <h3 style={{ margin: '0 auto'}}> There are no tracks to display</h3>
        </div>
      )
    }
    else{
     
      return (          
        <div key={'container'+i} className="col-10 p-md-4 card" style={{ margin:`20px auto`,width: 18 + 'rem'}}>
            <div className="">
              <TamplateComponent key={'track'+i} index={i} onChange={this.updateTracks}>  
              
              <NavLink to=
              //navigate to TrackDetails via TemplateComponent with the params
              {{pathname: `${process.env.PUBLIC_URL}/trackDetails`, 
                idOfTrack: track.idOfTrack}}
                activeStyle={this.active} 
                className="" >
                <h1 className="card-title" style={{ textAlign:`center`}}>{track.title} {this.getIconType(track.type)}</h1>
                <p style={{ textAlign:`center`}}>{track.description}</p>
              </NavLink>

              <div>
                <p>Reports: </p>
                <p style={{ border:`groove`,fontSize:'10px'}}>{this.getReports(track.reports)}</p>
              </div>

              </TamplateComponent>
          </div>
          
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <Card className="text-center">

          <Card.Header>
            <Navbar collapseOnSelect expand="lg">

              <Navbar.Brand href="#profilePicture" style={{ float: 'left' }}>
                {this.state.userDetails.profilePicture ?
                  (
                    <img alt="Profile" src={this.state.userDetails.profilePicture} style={{ height: '40px', width: '40px', float: 'left', borderRadius: '50%' }}></img>
                  )
                  :
                  (
                    <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
                  )
                }
              </Navbar.Brand>

              <Navbar.Brand href="#name" style={{ float: 'center' }}>
                {this.state.userDetails.name ?
                  (
                    <div>
                      <p>{this.state.userDetails.name}</p>
                    </div>
                  )
                  :
                  (
                    <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
                  )
                }
              </Navbar.Brand>

              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#profile">View Profile</Nav.Link>
                  <Nav.Link href="#favoriteTracks">Favorite Tracks</Nav.Link>
                  <NavDropdown title="Navigate a Route" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/2.1">Choose Existing Track</NavDropdown.Item>
                    <NavDropdown.Item href="#action/2.2">Generate Auto Track</NavDropdown.Item>
                    <NavDropdown.Item href="#action/2.3">Custom Made Track</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/2.4">Info</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="#searcgTracks">Serach Tracks</Nav.Link>
                  <Nav.Link href="#vibrations">Vibrations</Nav.Link>
                  <Nav.Link href="#about">About</Nav.Link>
                  <Nav.Link href="#contact">Contact us</Nav.Link>
                </Nav>
              </Navbar.Collapse>

            </Navbar>
          </Card.Header>

          <Card.Body>
            <Card.Title>
              <h6> Choose Origin and Destination </h6>
           </Card.Title>

            <Container>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="ORIGIN">
                    <Form.Control type="Text" placeholder="Origin" ref={this.getOrigin} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group as={Row} controlId="ORIGIN">
                    <Form.Control type="Text" placeholder="Destination" ref={this.getDestination} />
                  </Form.Group>
                </Col>
              </Row>
            </Container>

            <div className='d-flex flex-wrap justify-content-md-center'>
              <div className='form-group custom-control custom-radio mr-4 justify-content-md-center' >
                <input
                  id='WALKING'
                  className='custom-control-input'
                  name='travelMode'
                  type='radio'
                  checked={this.state.travelMode === 'WALKING'}
                  onChange={this.checkWalking}
                />
                <label className='custom-control-label' htmlFor='WALKING'>Walking</label>
              </div>

              <div className='form-group custom-control custom-radio mr-4 justify-content-md-center' >
                <input
                  id='BICYCLING'
                  className='custom-control-input'
                  name='travelMode'
                  type='radio'
                  checked={this.state.travelMode === 'BICYCLING'}
                  onChange={this.checkBicycling}
                />
                <label className='custom-control-label' htmlFor='BICYCLING'>Bicycling</label>
              </div>
            </div>

            <button className='btn btn-primary' type='button' onClick={this.onClick}>
              Search track
            </button>

          </Card.Body>

          <Card.Header> 
          </Card.Header>
          <Card.Body>
            {this.state.loading ?
              (
                <Map
                  track={this.state.track}>
                </Map>

              )
              :
              (
                <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
              )
            }
          </Card.Body>
          <Card.Footer id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  }
}
// Save - Save (DB) track without navigating
// Fast Travel - Navigate without saving ::: Warning Modal
// Save and Navigate - Save (DB) and Immidiatly start Navigation

export default ChooseExisting;
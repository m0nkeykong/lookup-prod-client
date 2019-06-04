import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import './style/ChooseExistingTrack.css'
import './style/PostNavigation.css'
import TiArrowBackOutline from 'react-icons/lib/ti/arrow-back-outline';
import {PostAsyncRequest} from '../globalService';



import { Card, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import './style/TrackDetails.css'

class PostNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      userDetails: [],
      addReport: []
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange  = this.handleChange.bind(this)
  }
  
  componentDidMount(){
      // get user details
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
      .then(userResponse => {
        this.setState({ userDetails: userResponse.data, loading: false });
      })
      .catch(error => {
        console.error(error);
      });

      // TODO: call route for update RANK
      // TODO: call route for update actual time
  }

  initialState(){
    this.setState(prevState => ({tracks: []}))
  }

  handleChange(event){
    this.setState({ [event.target.name]: event.target.value})
  }

  async onSubmit(e){
    e.preventDefault();

    // add stars:
    var checkedStar = "";
    if(this.refs.star1.checked)
      checkedStar = "1";
    if(this.refs.star2.checked)
      checkedStar = "2";
    if(this.refs.star3.checked)
      checkedStar = "3";
    if(this.refs.star4.checked)
      checkedStar = "4";
    if(this.refs.star5.checked)
      checkedStar = "5";

    axios.put(`http://localhost:3000/track/updateDefficultyLevel/${this.props.location.idOfTrack}/${checkedStar}`)
    .then(res => {
    })
    .catch(error => {
      console.error(error);
    });

    console.log("USER :");
    console.log(this.state.userDetails._id);
    console.log("REPORT:");
    console.log(this.state.addReport);
    // add report if exist

    if(this.state.addReport.length != 0 ||
        typeof this.state.addReport !== "undefined")
    {
        let data1 = {userId:`${this.state.userDetails._id}`, report: `${this.state.addReport}` };
        var reportId = await PostAsyncRequest('reports/insertReport', data1);

        let data2 = {trackId:`${this.props.location.idOfTrack}`, reportId: `${reportId}` };
        var reportId = await PostAsyncRequest('track/addReportToTrack', data2);
        
        this.initialState();
    }
  }

  render() {
    
    return (
      <div>
        <div className="postContainer">
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
              <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/profile`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >View Profile</NavLink>

                <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/favorites`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >Favorite Tracks</NavLink>

                <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/auto`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >Generate Auto Track</NavLink>
                  
                <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/choose`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >Choose Existing Tracks</NavLink>

                <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/custom`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >Custom Made Track</NavLink>

              </Nav>
              </Navbar.Collapse>

            </Navbar>
          </Card.Header>

          <div className="col-10 p-md-4">
            <NavLink to=
            //navigate to TrackDetails via TemplateComponent with the params
            // TODO: dont forgot to send the id of track 
            {{pathname: `${process.env.PUBLIC_URL}/trackDetails`}}
                activeStyle={this.active} 
                style={{padding:'6px', verticalAlign:'baseline'}}
                className="tring" >
                <TiArrowBackOutline size={29} color='black'/></NavLink>
            </div>


          <form onSubmit={this.onSubmit}>
          
                <h6>Vote for Difficulty Level</h6>
                <div className="row rating">     
                    <input className="inputStarts" type="radio" name="stars" id="4_stars" value="4" ref="star5" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="4_stars">4 stars</label>
                    <input className="inputStarts" type="radio" name="stars" id="3_stars" value="3" ref="star4" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="3_stars">3 stars</label>
                    <input className="inputStarts" type="radio" name="stars" id="2_stars" value="2" ref="star3" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="2_stars">2 stars</label>
                    <input className="inputStarts" type="radio" name="stars" id="1_stars" value="1" ref="star2" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="1_stars">1 star</label>
                    <input className="inputStarts" type="radio" name="stars" id="0_stars" value="0" ref="star1" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="0_stars">0 star</label>
                </div>

                <div className="row pt-3">     
                    <div class="col-10" style={{ margin:`20px auto`}}> 
                    <h6>Have you encountered a report <br></br>during the track?</h6>
                        <div class="col-12" id="add-report">
                            <div class="form-group">
                                <div class="col-12 pt-1">
                                    <textarea className="form-control textareaSize" placeholder="Tell us!" name="addReport" onChange={this.handleChange}  value={this.state.addReport} rows="5"></textarea>
                                </div>
                            </div>           
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="w-100 mb-md-4"></div>
                    <div className="col-12 mx-auto">
                        <button className='btn btn-primary' type='submit'>
                        Submit
                        </button>
                    </div>
                </div>

            </form>
        </div>
      </div>
    );
  }
}


export default PostNavigation;
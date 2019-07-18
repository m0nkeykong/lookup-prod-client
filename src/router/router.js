import React from "react";
import {Route} from "react-router-dom";
import TrackBuilder from "../Components/TrackBuilder";
import AutoGenerateTrack from "../Components/TrackPlanner/AutoGenerateTrack";
import ChooseExistingTrack from "../Components/ChooseExistingTrack";
import CustomTrack from "../Components/TrackPlanner/CustomTrack";
import Login from "../Components/Login";
import TrackDetails from "../Components/TrackDetails";
import HomePage from '../Components/HomePage';
import PostNavigation from '../Components/PostNavigation'
import Profile from "../Components/Profile";
import Favorites from "../Components/FavoritesList";
import LiveMap from "../Components/LiveMap";
import MyTracks from "../Components/MyTracks";

const AppRouter = () =>{
  return(
    <React.Fragment>
      {/* <Header/> */}
      <Route exact path="/" component={Login}/>
      <Route exact path="/auto" component={AutoGenerateTrack}/>
      <Route exact path="/choose" component={ChooseExistingTrack}/>
      <Route exact path="/custom" component={CustomTrack}/>
      <Route exact path="/trackDetails" component={TrackDetails}/>
      <Route exact path="/home" component={HomePage}/>
      <Route exact path="/liveNavigation" component={TrackBuilder}/>
      <Route exact path="/post" component={PostNavigation}/>
      <Route exact path="/profile" component={Profile}/>
      <Route exact path="/favorites" component={Favorites}/>
      <Route exact path="/liveMap" component={LiveMap}/>
      <Route exact path="/myTracks" component={MyTracks}/>
    </React.Fragment>
  );
  
}

export default AppRouter;
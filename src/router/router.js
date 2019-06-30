import React from "react";
import {Route} from "react-router-dom";
import LiveNavigation from "../Components/LiveNavigation";
import AutoGenerateTrack from "../Components/AutoGenerateTrack";
import ChooseExistingTrack from "../Components/ChooseExistingTrack";
import CustomTrack from "../Components/CustomTrack";
import Login from "../Components/Login";
import Map from "../Components/Map";
import TrackDetails from "../Components/TrackDetails";
import HomePage from '../Components/HomePage';
import PostNavigation from '../Components/PostNavigation'
import Profile from "../Components/Profile";
import Favorites from "../Components/FavoritesList";
import LiveMap from "../Components/LiveMap";

const AppRouter = () =>{
  return(
    <React.Fragment>
      {/* <Header/> */}
      <Route exact path="/" component={Login}/>
      <Route exact path="/map" component={Map}/>
      <Route exact path="/auto" component={AutoGenerateTrack}/>
      <Route exact path="/choose" component={ChooseExistingTrack}/>
      <Route exact path="/custom" component={CustomTrack}/>
      <Route exact path="/trackDetails" component={TrackDetails}/>
      <Route exact path="/home" component={HomePage}/>
      <Route exact path="/liveNavigation" component={LiveNavigation}/>
      <Route exact path="/post" component={PostNavigation}/>
      <Route exact path="/profile" component={Profile}/>
      <Route exact path="/favorites" component={Favorites}/>
      <Route exact path="/liveMap" component={LiveMap}/>
    </React.Fragment>
  );
  
}

export default AppRouter;
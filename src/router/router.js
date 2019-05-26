import React from "react";
import {Route} from "react-router-dom";
import Header from "../Header";
import LiveNavigation from "../Components/LiveNavigation";
import AutoGenerateTrack from "../Components/AutoGenerateTrack";
import ChooseExistingTrack from "../Components/ChooseExistingTrack";
import CustomTrack from "../Components/CustomTrack";
// import StartNavigate from "../Components/StartNavigate";
import Login from "../Components/Login";
import Map from "../Components/Map";
import TrackDetails from "../Components/TrackDetails";
import HomePage from '../Components/HomePage';
import PostNavigation from '../Components/PostNavigation'
import Profile from "../Components/Profile";
import Favorites from "../Components/FavoritesList";
// import DirectionsPoint from "../Components/DirectionsPoints";
// import Navigate from "../Components/Navigate";

// import UserSettings from "../Components/UserSettings";
// import Disconnect from "../Components/Disconnect";
// import BuildTrack from "../Components/BuildTrack";
// import BrowseTrack from "../Components/BrowseTrack";


const AppRouter = () =>{
  return(
    <React.Fragment>
      <Header />
      <Route exact path="/" component={Login} />
      <Route exact path="/map" component={Map} />
      <Route exact path="/auto" component={AutoGenerateTrack} />
      <Route exact path="/choose" component={ChooseExistingTrack} />
      <Route exact path="/custom" component={CustomTrack} />
      <Route exact path="/trackDetails" component={TrackDetails} />
      <Route exact path="/homePage" component={HomePage} />
      <Route exact path="/liveNavigation" component={LiveNavigation} />
      <Route exact path="/post" component={PostNavigation} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/favorites" component={Favorites} />
    </React.Fragment>
  );
// <Route exact path="/" component={Navigate} />
// <Route exact path="/" component={UserProfile} />
// <Route exact path="/" component={UserSettings} />
// <Route exact path="/" component={Disconnect} />
// <Route exact path="/" component={BuildTrack} />
// <Route exact path="/" component={BrowseTrack} />
}

// <Route exact path="/" component={SomePage} />
// <Route exact path="/custom" component={CustomTrack} />
// <Route exact path="/start" component={StartNavigate} />      
// <Route exact path="/directions" component={DirectionsPoint} />

export default AppRouter;
import React from "react";
import {Route} from "react-router-dom";
import Header from "../Header";
import SomePage from "../Components/SomePage";
import AutoGenerateTrack from "../Components/AutoGenerateTrack";
import ChooseExistingTrack from "../Components/ChooseExistingTrack";
import CustomTrack from "../Components/CustomTrack";
import StartNavigate from "../Components/StartNavigate";
import Login from "../Components/Login";
import HomePage from "../Components/HomePage";
import TrackDetails from "../Components/TrackDetails";
import DirectionsPoint from "../Components/DirectionsPoints";
// import Navigate from "../Components/Navigate";
// import UserProfile from "../Components/UserProfile";
// import UserSettings from "../Components/UserSettings";
// import Disconnect from "../Components/Disconnect";
// import BuildTrack from "../Components/BuildTrack";
// import BrowseTrack from "../Components/BrowseTrack";


const AppRouter = () =>{
  return(
    <React.Fragment>
    <Header />
      <Route exact path="/" component={SomePage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/homePage" component={HomePage} />
      <Route exact path="/auto" component={AutoGenerateTrack} />
      <Route exact path="/choose" component={ChooseExistingTrack} />
      <Route exact path="/custom" component={CustomTrack} />
      <Route exact path="/start" component={StartNavigate} />
      <Route exact path="/trackDetails" component={TrackDetails} />
      <Route exact path="/directions" component={DirectionsPoint} />

    </React.Fragment>
  );
// <Route exact path="/" component={Navigate} />
// <Route exact path="/" component={UserProfile} />
// <Route exact path="/" component={UserSettings} />
// <Route exact path="/" component={Disconnect} />
// <Route exact path="/" component={BuildTrack} />
// <Route exact path="/" component={BrowseTrack} />
}

export default AppRouter;
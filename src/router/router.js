import React from "react";
import {Route } from "react-router-dom";
import somePage from "../Components/js/somePage";
import autoGenerateTrack from "../Components/js/AutoGenerateTrack";
import chooseExistingTrack from "../Components/js/ChooseExistingTrack";
import customTrack from "../Components/js/CustomTrack";
import startNavigate from "../Components/js/StartNavigate";



const AppRouter = () =>{
  return(
    <React.Fragment>
      <Route exact path="/" component={somePage} />
      <Route exact path="/auto" component={autoGenerateTrack} />
      <Route exact path="/choose" component={chooseExistingTrack} />
      <Route exact path="/custom" component={customTrack} />
      <Route exact path="/start" component={startNavigate} />
    </React.Fragment>
  );

}

export default AppRouter;
import React from "react";
import {Route } from "react-router-dom";
import somePage from "../Components/js/somePage";



const AppRouter = () =>{
  return(
    <React.Fragment>
      <Route exact path="/" component={somePage} />
    </React.Fragment>
  );

}

export default AppRouter;

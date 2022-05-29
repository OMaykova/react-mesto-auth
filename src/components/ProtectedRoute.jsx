import React from 'react';
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ loggedIn, children, checkToken, ...props }) => {
  checkToken()
  return (
      <Route {...props}>
        {loggedIn ? children : <Redirect to="/signin"/>}
      </Route>
  )
}

export default ProtectedRoute;
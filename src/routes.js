import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";

import Login from "./pages/Login";
import Notes from "./pages/Notes";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/notes" component={Notes} />
      </Switch>
    </BrowserRouter>
  );
}

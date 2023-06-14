import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoChat from "./VideoChat";
import Login from "./component/Login";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login/>}
            exact
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

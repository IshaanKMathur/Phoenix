
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import NewGroup from './Groups';
import Logout from './Logout';
import Fetch from './Fetch';
import Chatroom from './Chatroom';


function App() {
  return(
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/newgroup" element={<NewGroup/>}/>
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/fetch" element={<Fetch/>}/>
        <Route path="/:groupName" element={<Chatroom/>}/>
      </Routes>
    </Router>
  )
  }

export default App;

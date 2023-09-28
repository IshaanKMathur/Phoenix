import React,{useState} from 'react';
import {Link} from 'react-router-dom';

function Groups() {
    const [gname, setGname] = useState("");
    const [errorMessages, setErrorMessages] = useState({success:null});
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const jsondata = {
        "gname": gname,
      };
  
      fetch('http://localhost:5000/newgroup', {
        method: 'POST',
        mode: 'cors',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(jsondata)
      }).then((response) => response.json()) 
      .then((data) => {
        if (data.status === 200) {
          setErrorMessages({ success: true });
        } else {
          setErrorMessages({ success: false });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    };
  
    const renderErrorMessage = (name) =>
      name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
      );
  
    const renderForm = (
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Group Name</label>
            <input
              type="text"
              name="gname"
              required
              value={gname}
              onChange={(e) => setGname(e.target.value)}
            />
            {renderErrorMessage("Group Name")}
          </div>
  
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
        <div className="logoutcontainer">
          <Link to="/logout">Log Out</Link>
        </div>
        <div className="fetchcontainer">
          <Link to="/fetch">Display Groups</Link>
        </div>
        </div>
        
    );
  
    return (
      <div className="app">
        <div className="newgroup-form">
          <div className="title">New Group</div>
          {/* Display a message when the user is successfully logged in */}
          {errorMessages.success===true && (
            <div>
            <div>Group Created</div>
            </div>
          )}
          {errorMessages.success===false&&
          (
            <div>
            {renderForm}
            <div>Group could not be created</div>
            </div>
          )}
          {errorMessages.success===null &&
          (
            renderForm
          )
          }
        </div>
      </div>
    );
  }
  
  export default Groups;
  
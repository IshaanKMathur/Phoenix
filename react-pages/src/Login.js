import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();
    const [errorMessages, setErrorMessages] = useState({success:null});
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const jsondata = {
        "username": username,
        "password": password,
      };
  
      fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(jsondata)
      }).then((response) => response.json()) 
      .then((data) => {
        if (data.message === 'Logged in') {
          navigate('/newgroup');
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
            <label>Username</label>
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {renderErrorMessage("username")}
          </div>
  
          <div className="input-container">
            <label>Password</label>
            <input
              type="text"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {renderErrorMessage("password")}
          </div>
  
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
  
        <div className="signupcontainer">
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    );
  
    return (
      <div className="app">
        <div className="login-form">
          <div className="title">Login</div>
          {/* Display a message when the user is successfully logged in */}
          {errorMessages.success===true && (
            <div>
            <div>User is successfully logged in</div>
            </div>
          )}
          {errorMessages.success===false&&
          (
            <div>
            {renderForm}
            <div>Login incorrect</div>
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
  
  export default Login;
  
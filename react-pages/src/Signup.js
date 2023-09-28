import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Signup(){
    const [username, setUsername] = useState("");
    const [namep,setNamep] = useState("");
    const [email,setEmail] = useState("");
    const [mobile,setMobile] =useState("");
    const [password, setPassword] = useState("");
    const [errorMessages, setErrorMessages] = useState({success:null});
    const navigate=useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Move jsondata declaration inside handleSubmit to capture current values
        const jsondata = {
            "name":namep,
            "username": username,
            "password": password,
            "email": email,
            "mobile":mobile
        };
    
        fetch('http://localhost:5000/user', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsondata)
        }).then((response) => response.json()) 
        .then((data) => {
          console.log(data);
          if (data.status===200) {
            navigate('/');
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
          <label>Name</label>
          <input
            type="text"
            name="namep"
            required
            value={namep}
            onChange={(e) => setNamep(e.target.value)}
          />
          {renderErrorMessage("name")}
        </div>


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

        <div className="input-container">
          <label>Mobile</label>
          <input
            type="text"
            name="mobile"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {renderErrorMessage("mobile")}
        </div>

        <div className="input-container">
          <label>Email</label>
          <input
            type="text"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {renderErrorMessage("email")}
        </div>

        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
      </div>
  );

  return (
    <div className="app">
      <div className="signup-form">
        <div className="title">Signup</div>
        {/* Display a message when the user is successfully logged in */}
        {errorMessages.success===true && (
          <div>
          <div>User is successfully registered</div>
          </div>
        )}
        {errorMessages.success===false&&
        (
          <div>
          {renderForm}
          <div>Recheck and check if all the fields are correctly entered</div>
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

export default Signup;
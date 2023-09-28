import React,{useState} from 'react';

function Logout(){

    const [errorMessages, setErrorMessages] = useState({success:null});

    const handleSubmit = (event) => {
        event.preventDefault();
    
        fetch('http://localhost:5000/logout', {
          method: 'POST',
          mode: 'cors',
          credentials:'include',
          headers: {
            'Content-Type': 'application/json', 
          },
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

      const renderForm=(
        <div className="form">
        <form onSubmit={handleSubmit}>
        <div className="button-container">
        <input type="submit" />
        </div>
        </form>
        </div>
      )


      return (
        <div className="app">
          <div className="newgroup-form">
            <div className="title">Log Out</div>
            {/* Display a message when the user is successfully logged in */}
            {errorMessages.success===true && (
              <div>
              <div>Successfully Logged Out</div>
              </div>
            )}
            {errorMessages.success===false&&
            (
              <div>
              <div>Already Logged Out</div>
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

export default Logout;
import React,{useState} from 'react';
import {Link} from 'react-router-dom';

function Fetch(){

    const [errorMessages, setErrorMessages] = useState({success:null});
    const [userName, setUsername]=useState("");
    const [groups,setGroups]= useState([]);
    
    const handleSubmit = (event) => {
        event.preventDefault();

    
        fetch('http://localhost:5000/fetch', {
          method: 'GET',
          mode: 'cors',
          credentials:'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => response.json()) 
        .then((data) => {
          if (data.status === 200) {
            setGroups(data.data);
            setUsername(data.checker);
            setErrorMessages({ success: true });
          } else {
            setErrorMessages({ success: false });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      };

      const renderGroups=(
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
      <div className="title">Groups</div>
      
      {/* Display a message when the user is successfully logged in */}
      {errorMessages.success === true && (
          <div>
        {groups.map((group, index) => (
          <div key={index}>
            {group.gname.map((element, elementIndex) => (
              <div key={elementIndex}>
                <Link to={`/${element}`}>
                <h5>{element}</h5>
                </Link>
              </div>
            ))}

              <div className="logoutcontainer">
                <Link to="/logout">Log Out</Link>
              </div>
          </div>
        ))}
      </div>
      )}


                  
            {errorMessages.success===false&&
            (
              <div>
              <div>No Groups Available : Click to create groups</div>
              <div className="newgroupcontainer">
                <Link to="/newgroup">Create New Group</Link>
                </div>
                <div className="logoutcontainer">
                <Link to="/logout">Log Out</Link>
                </div>
              </div>
            )}
            {errorMessages.success===null &&
            (
                renderGroups
            )
            }
          </div>
        </div>
      );
}

export default Fetch;
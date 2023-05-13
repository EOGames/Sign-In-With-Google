import { useEffect, useState } from "react";
import Database from "./pages/Database";
import {googleLogin} from "./api/login.api";
import jwt_token from 'jwt-decode';


function App() {
  const [user, setUser] = useState({});
  const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
 let google;
  // console.log('CLIENT ID:',client_id);

  useEffect(() => {


    checkIfGoogleExisit();

    if (localStorage.getItem('log_session')) {
      let token = localStorage.getItem('log_session');

      let userInfo = jwt_token(token);
      setUser(userInfo);
      document.getElementById('signInDiv').hidden = true

    }

  }, []);


  const checkIfGoogleExisit = () => {
     google = window.google;

    setTimeout(() => {
      try {
        if (window.google) {

          google.accounts.id.initialize(
            {
              client_id: client_id,
              callback: handleLoginCallbackResponse,
            });

          google.accounts.id.renderButton(
            document.getElementById('signInDiv'),
            { theme: 'outline', size: 'large' }
          );
          clearTimeout();

          if (!localStorage.getItem('log_session')) {
            google.accounts.id.prompt();
          }
        }
      } catch (error) {
        console.log("Not Ready Yet Error: ", error);
        checkIfGoogleExisit();
      }
    }, 500);
  }


  const handleLoginCallbackResponse = async (response) => {
    // console.log("Encoded JWT ID Token: ", response.credential);
    console.log('res::::>>>>>>>>>>',response);

    try {
      let data = await googleLogin(response.credential);

      console.log(`%cFinal Data : ${data}`,'color:green');
      console.log('New Token: ', data?.token);
    let userInfo = jwt_token(data?.token);
    console.log('User Info: ',userInfo);

     setUser(userInfo);

    localStorage.setItem('log_session', data?.token);
    document.getElementById('signInDiv').hidden = true

    } 
    catch (error) 
    {
      console.log('ERROR: ',error);
    }
   


   

  }

  const handleLogout = () => {
    setUser({});
    document.getElementById('signInDiv').hidden = false
    localStorage.removeItem('log_session');
  }

  return (
    <div className="App">

      {
        user.userName ?
          <div className="logLogout">
            <img className="logLogout_child" src={user.picLink} alt="userPic" />
            <h6 className="logLogout_child">{user.userName}</h6>
            <button className="logLogout_child" onClick={handleLogout} >Logout</button>

          </div>
          :
          <>

          </>
      }


        <div id="signInDiv">
        </div>

      <div>
        {
          user.userName ? <Database  client_id = {client_id} email = {user.email} /> : <p className="loginMsg">Please Log In To Continue</p>

        }
      </div>
    </div>
  );
}

export default App;

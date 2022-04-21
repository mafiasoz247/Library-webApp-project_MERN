// import { Link } from "react-router-dom";
// import LoginNav from "./UI/LoginNav";
// import NormalNav from "./UI/NormalNav";
// import axios from 'axios';
// import { setUserIDSession, getUser, removeUserSession, removeUserIDSession, getToken } from "../Utils/Common";
// import React, { useState } from 'react';

// const NavBar = ({ history }) => {
//   const user = JSON.parse(sessionStorage.getItem("user"));

//   const userAccess = (int) => {
//     if (sessionStorage.getItem("token")) {
//       sessionStorage.removeItem("token");
//       sessionStorage.removeItem("user");
//       //sessionStorage.removeItem("username");
//      // sessionStorage.removeItem("userType");
//       //sessionStorage.removeItem("categoryId");
//     }
//     console.log(int);
//     if(int === undefined){
//       window.location = "/login";}
//       else{
//         window.location = "/register";
//       }
//   };
//   return (
//     <nav className="navbar navbar-dark bg-dark navbar-expand-md">
//       <div className="container">
//         <Link className="navbar-brand" to="/">
//           <strong>Library</strong>
//         </Link>
//         {sessionStorage.getItem("user") && (
//           <NormalNav user={user} userAccess={userAccess}/>
//         )}
//         {!(sessionStorage.getItem("user")) && (
//           <LoginNav userAccess={userAccess} />
//         )}
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

import React, { Component, useState } from 'react';
import { MenuItemsAdmin,MenuItems, LoggedIn, LoggedOut } from './MenuItems';
import './Navbar.css'
import { Button } from './Button';
import { checkAdmin,checkToken, setUserIDSession, getUser, removeUserSession, removeUserIDSession, getToken } from "../../Utils/Common";
import axios from 'axios';
import Notification from '../Notifications';


class Navbar extends Component {

  state = { clicked: false }
  token = checkToken()
  admin = checkAdmin();
  handleClick = () => {
    this.setState({ clicked: !this.state.clicked })
  }

  render() {

    
    const user = getUser();
    const token = getToken();
    

    const handleLogout = async () => {
  
      let config = {
        headers: {
          Authorization: "basic " + token
        }
      }

      await axios.delete("http://localhost:4000/users/logout", config, {
      }).then(response => {
        removeUserSession();
        removeUserIDSession();
      }).catch(error => {        
        console.log("errors >>> ", error)
      })
      window.location.assign('/login');
    }


    return (
      <nav className="NavbarItems">
        <h1 className="navbar-logo">Library{/*<i className="fab fa-react"></i>*/}</h1>

        <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
          {
          
          this.admin ? 
          
          MenuItemsAdmin.map((item, index) => {
            return (
              <li key={index}>
                <a className={item.cName}  href={item.url} >
                  {item.title}
                </a>
              </li>
            )}
          ) : 
          MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <a className={item.cName}  href={item.url} >
                  {item.title}
                </a>
              </li>
            )}
           )
      
          }
          </ul>
        <ul className='nav-menu-right'>
          {
            this.token ? (
              <Button onClick={() => window.location.assign('/dashboard')}>MyProfile</Button>
            )
              : (
                <Button onClick={() => window.location.assign('/login')}>Login</Button>
              )
          }
          {
            this.token ? (
              <Button onClick={handleLogout}>Logout</Button>
            )
              : (
                <Button onClick={() => window.location.assign('/register')}>Register</Button>
              )
          }


        </ul>
      </nav>

    )
  }
}

export default Navbar;
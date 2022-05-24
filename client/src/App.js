import React, { useState, useEffect,lazy,Suspense } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import axios from 'axios';
import Events from "./admin_pages/Events";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PublicRoute from "./Utils/PublicRoute";
import PrivateRoute from "./Utils/PrivateRoute";
import { checkAdmin,checkManager,getToken, removeUserSession, setUserSession, removeUserIDSession, setUserIDSession } from './Utils/Common';
import Spinner from "./Components/Spinner";
import Login from './admin_pages/Login';
import Home from './admin_pages/Home';
import HomeManager from './manager_pages/HomeManager';
import Register from './admin_pages/Register';
import Navbar from './Components/Navbar/Navbar.js';
import Dashboard from './admin_pages/Dashboard';
import HomeAdmin from './admin_pages/HomeAdmin';
import PageNotFound from './admin_pages/pagenotfound';
import RegisterManager from './admin_pages/RegisterManager';
import ViewUsers from './admin_pages/ViewUsers';
import ViewLibraries from './admin_pages/ViewLibraries';
import CreateLibrary from './admin_pages/CreateLibrary';
import ViewRequests from './admin_pages/ViewRequests';
import ViewCategories from './admin_pages/ViewCategories';
// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const NavBar = lazy(() => import("./Components/Navbar"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));

function App(props) {

  const [authLoading, setAuthLoading] = useState(true);
  const admin = checkAdmin();
  const manager = checkManager();
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    axios.get(`http://localhost:4000/auth/verifyToken?token=${token}`).then(async response => {
      setUserSession(response.data.token)
      //setUserIDSession(response.data.user);
      let config = {
        headers: {
          authorization: "basic " + token
        }
      }
      await axios.get("http://localhost:4000/users/user-profile", config, {
      }).then(response => {
        setAuthLoading(false);
        // console.log(response.data.data.result.profile[0]);
        setUserIDSession(response.data.data.result.profile[0]);
      }).catch(error => {
        setAuthLoading(false);
        console.log("errors >>> ", error)
      })

      setAuthLoading(false);
    }).catch(error => {
      
      removeUserSession();
      removeUserIDSession();
      setAuthLoading(false);
    });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }
  
  return (

    <div className="App">
      
        {/* <div className="header">
          <NavLink exact activeClassName="active" to="/">Home</NavLink> */}

          {/* <NavLink activeClassName="active" to="/events"> Events </NavLink> */}
          
          {/* <NavLink activeClassName="active" to="/login">Login <small> Access without token only </small></NavLink>
          <NavLink activeClassName="active" to="/register">Register<small> Access without token only </small></NavLink>
          <NavLink activeClassName="active" to="/dashboard">Dashboard <small> Access with token only </small></NavLink>
        </div> */}

        
             
           
        
        <div className="content">
        <Suspense fallback={<Spinner text="Loading" />}>
        
          <Navbar />
      
          
            {
              admin ? 
              <Switch>
              
              <PrivateRoute exact path='/admin/home' component={HomeAdmin} />
              <PrivateRoute exact path='/' component={HomeAdmin} />  
              <PrivateRoute exact path='/admin/RegisterManager' component={RegisterManager} />
              <PrivateRoute exact path='/admin/Users' component={ViewUsers} />
              <PrivateRoute exact path='/admin/Libraries' component={ViewLibraries} /> 
              <PrivateRoute exact path='/admin/CreateLibrary' component={CreateLibrary} /> 
              <PrivateRoute exact path='/admin/Requests' component={ViewRequests} />
              <PrivateRoute exact path='/admin/Categories' component={ViewCategories} />    
              <Route  path="*" component={PageNotFound} />
              </Switch>
              
              :manager ? 
              <Switch>
              
              <PrivateRoute exact path='/manager/home' component={HomeManager} />
              <PrivateRoute exact path='/' component={HomeManager} />  
              <PrivateRoute exact path='/admin/RegisterManager' component={RegisterManager} />
              <PrivateRoute exact path='/admin/Users' component={ViewUsers} />
              <PrivateRoute exact path='/admin/Libraries' component={ViewLibraries} /> 
              <PrivateRoute exact path='/admin/CreateLibrary' component={CreateLibrary} /> 
              <PrivateRoute exact path='/admin/Requests' component={ViewRequests} />
              <PrivateRoute exact path='/admin/Categories' component={ViewCategories} />    
              <Route  path="*" component={PageNotFound} />
              </Switch>
              
              :
              
              <Switch>
              
              <Route exact path='/Home' component={Home} />
              <Route exact path='/' component={Home} />
              <PublicRoute exact path='/login' component={Login} />
              <PublicRoute exact path='/register' component={Register} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <Route exact path='/events' component={Events} />
              <Route  path="*" component={PageNotFound} />
              </Switch>
            }
            
            
            
          
          </Suspense>

        </div>
      
    </div>
  );
}

export default App;
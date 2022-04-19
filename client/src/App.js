import React, { useState, useEffect,lazy,Suspense } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import axios from 'axios';
import Events from "./pages/Events";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PublicRoute from "./Utils/PublicRoute";
import PrivateRoute from "./Utils/PrivateRoute";
import { checkAdmin,getToken, removeUserSession, setUserSession, removeUserIDSession, setUserIDSession } from './Utils/Common';
import Spinner from "./Components/Spinner";
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Navbar from './Components/Navbar/Navbar.js';
import Dashboard from './pages/Dashboard';
import HomeAdmin from './pages/HomeAdmin';
import PageNotFound from './pages/pagenotfound';
// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const NavBar = lazy(() => import("./Components/Navbar"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));

function App(props) {

  const [authLoading, setAuthLoading] = useState(true);
  const admin = checkAdmin();
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
          Authorization: "basic " + token
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

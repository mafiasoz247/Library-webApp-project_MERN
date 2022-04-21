import React from 'react';
import './HomeAdmin.css'

const HomeAdmin = () => {
  return (
    <div className='HomeAdmin'>
      <head>
        
  
      </head>
      <body>  
        {/* <div class="container-homeadmin"><img class="cover" src="./img/undraw.png" /></div> */}
        <div class="zone blue grid-wrapper">
        
        
          <div class="boxfirst zone"><a href="/admin/RegisterManager" class="mylink">
          <img src="https://cdn0.iconfinder.com/data/icons/audio-video-industry-1/240/Add_to_library-256.png"></img>
          <h1>Create Library</h1></a>
          </div> 
          
          <div class="box zone"><a href='/admin/Users' class="mylink2">
          <img src="https://cdn2.iconfinder.com/data/icons/linkedin-ui/48/jee-100-256.png"></img>
          <h1>Users</h1></a>
          </div>
         
          <div class="boxlast zone"><a href='/admin/Libraries' class="mylink3">
          <img src="https://cdn1.iconfinder.com/data/icons/education-outlines/100/15-256.png"></img>
          <h1>Libraries</h1></a>
          </div>
          
          
          
        </div>
        
        </body >
    </div>


  )
}

export default HomeAdmin;
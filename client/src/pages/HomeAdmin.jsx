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
          <img src="https://cdn2.iconfinder.com/data/icons/complete-common-version-6-4/1024/add_library-512.png"></img>
          <h1>Create Library</h1></a>
          </div> 
          
          <div class="box zone"><a href='/admin/Users' class="mylink2">
          <img src="https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/group2-256.png"></img>
          <h1>Users</h1></a>
          </div>
         
          <div class="boxlast zone"><a href='/admin/Libraries' class="mylink3">
          <img src="https://cdn1.iconfinder.com/data/icons/education-39/100/15-128.png"></img>
          <h1>Libraries</h1></a>
          </div>
          
          
          
        </div>
        
        </body >
    </div>


  )
}

export default HomeAdmin;
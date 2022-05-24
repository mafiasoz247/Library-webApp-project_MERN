import React,{useState} from 'react';
import '../admin_pages/HomeAdmin'
import axios from 'axios';
import { getToken } from '../Utils/Common';





const HomeManager = () => {
  const [Reviews, setReviews] = useState(JSON.parse(sessionStorage.getItem('Reviews')));
  const [Queries, setQueries] = useState(JSON.parse(sessionStorage.getItem('Queries')));
  const [Orders, setOrders] = useState(JSON.parse(sessionStorage.getItem('Orders')));
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const [Books, setBooks] = useState(JSON.parse(sessionStorage.getItem('Books')));
  const [Categories, setCategories] = useState(JSON.parse(sessionStorage.getItem('Categories')));



  const fetchOrders = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users/getOrdersLibrary', config, {
    }).then(async response => {
        setOrders(response.data.data.result.info);
        sessionStorage.setItem('Orders', JSON.stringify(response.data.data.result.info));
        //console.log(libraries);
        setLoading(false);
        window.location.assign('/manager/Orders')
        
    }).catch(error => {

    });


};

const fetchCategories = async () => {
  setLoading(true);
  let config = {
      headers: {
          Authorization: "basic " + token
      }
  }
  await axios.get('http://localhost:4000/users/getCategory', config, {
  }).then(async response => {
      setCategories(response.data.data.message.Categories);
      console.log(Categories);
      sessionStorage.setItem('Categories', JSON.stringify(response.data.data.message.Categories));
     
      setLoading(false);
      window.location.assign('/manager/Categories');

  }).catch(error => {

  });

}
  const fetchBooks = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users/getBooksLibrary', config, {
    }).then(async response => {
        setBooks(response.data.data.result.data);
        sessionStorage.setItem('Books', JSON.stringify(response.data.data.result.data));
        setLoading(false);
        window.location.assign('/manager/Books');
        
    }).catch(error => {
  
    });
  
  };

  const fetchreviews = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users/seeReviewsLibrary', config, {
    }).then(async response => {
        setRequests(response.data.data.message.Queries);
        sessionStorage.setItem('requests', JSON.stringify(response.data.data.message.Reviews));
        setLoading(false);
        window.location.assign('/manager/Reviews');
        
    }).catch(error => {
  
    });
  
  };

  const fetchqueries = async () => {
    setLoading(true);
    let config = {
        headers: {
            Authorization: "basic " + token
        }
    }
    await axios.get('http://localhost:4000/users//getQueries', config, {
    }).then(async response => {
        setRequests(response.data.data.message.Queries);
        sessionStorage.setItem('requests', JSON.stringify(response.data.data.message.Queries));
        setLoading(false);
        window.location.assign('/manager/Queries');
        
    }).catch(error => {
  
    });
  
  };
  return (
    <div className='HomeAManager'>
      
        
        {/* <div class="container-homemanager"><img class="cover" src="./img/undraw.png" /></div> */}
        <div className="zone blue grid-wrapper">
        
        
          <div className="boxfirst zone"><a onClick={fetchOrders} className="mylink">
          <img src="https://cdn-icons.flaticon.com/png/512/3624/premium/3624080.png?token=exp=1653401747~hmac=60b791d86a5c3df152ac5095bdb639d1"></img>
          <h2>Orders</h2></a>
          </div> 

          <div className="boxlast zone"><a onClick={fetchBooks} className="mylink3">
          <img src="https://cdn1.iconfinder.com/data/icons/education-outlines/100/15-256.png"></img>
          <h2>Books</h2></a>
          </div>
          
          
          <div className="box zone"><a  onClick={fetchCategories} className="mylink2">
          <img src="https://cdn2.iconfinder.com/data/icons/linkedin-ui/48/jee-100-256.png"></img>
          <h2>Categories</h2></a>
          </div>
         
          
          <div className="boxrequest zone"><a onClick={fetchqueries} className="mylink4">
          <img src="https://cdn-icons-png.flaticon.com/512/901/901533.png"></img>
          <h2>Queries</h2></a>
          </div>

          <div className="boxrequest zone"><a onClick={fetchreviews} className="mylink4">
          <img src="https://cdn-icons-png.flaticon.com/512/901/901533.png"></img>
          <h2>Reviews</h2></a>
          </div>
          
          
        </div>
        
        
    </div>


  )
}

export default HomeManager;
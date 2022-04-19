import React from 'react';
import '../Components/pagenotfound.css'

const PageNotFound = () => {

    return (
        <div>
        <div className='containerlol'>
            <h1>404</h1>
            </div>
            <div id='container'>
            <p>Oops! Something is wrong.</p>
            <a class="button" href="/"><i class="icon-home"></i> Click here to go to Home Page!</a>
            </div>
        </div>
    )
}

export default PageNotFound;

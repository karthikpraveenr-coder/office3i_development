import React from 'react';
import './css/Community.css';
import bg_image from './images/Community_image.png'

const Community = () => {
    const communitycontainer = {
        backgroundImage: `url(${bg_image})`,
        height: "80vh",
        // marginTop: "-70px",
        // fontSize: "50px",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    return (
        <div className="community-container" style={communitycontainer}>
            <div className="community-content">
                <div className="community-text">
                    <h1>Unlock The Power Of Seamless HR Management</h1>
                    <p>
                        Empower your workforce, enhance productivity and elevate employee
                        satisfaction with our comprehensive suite of tools designed to meet
                        the diverse needs of modern enterprises. Easy, accurate, user-friendly
                        software tailored for all businesses.
                    </p>
                    <button className='Request_demo'>Request Demo</button>
                    
                </div>
            </div>
        </div>
    );
};

export default Community;

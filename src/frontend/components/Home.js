import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <div className="home_boxes">

      <div className="container">
        <div className="row">

          <div className="col-md-6">
            <div className="left_home_content">
              <h1>Discover, collect, and sell extraordinary NFTs</h1>
              <p>DPP is the world's first and largest NFT marketplace</p>

              <div className="move_button_box">
                <Link to="/explore">Explore</Link>
                <Link to="/create" className='ml-2'>Create</Link>
              </div>

              <div className="learn_more">
                {/* <a href="#"><i className="fas fa-play-circle"></i> Learn more about OpenSea</a> */}
              </div>
            </div>

          </div> 
          {/* <!-- end left column home box --> */}

          <div className="col-md-6">

            <div className="right_home_content">
              <div className="home_inside_img">
                <img src="https://openseauserdata.com/files/kith_friends_launch_image_rc1.jpeg" alt='img'/>
              </div>

              <div className="home_inside_slogn">
                <img src="https://openseauserdata.com/files/kith_friends_launch_creator_image_rc1.png" alt='img'/>
                  <div className="slogn_text">
                    <span>Kith Friends</span>
                    <p>Kith & Invisible Friends</p>
                  </div>
              </div>
            </div>



          </div>   
          {/* <!-- end right column home box --> */}


        </div> 
        {/* <!-- end row explore listing --> */}

      </div>
      {/* <!--  end container --> */}

    </div>
  );
}
export default Home
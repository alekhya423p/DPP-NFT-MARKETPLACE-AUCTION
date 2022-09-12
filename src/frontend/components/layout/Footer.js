import React from "react";
import { Link } from "react-router-dom";
import logo from '../logo.png'

const Footer = () => {
  return (
    <footer>
      <div className="container my_container">
        <div className="ft_logo">
          <p>
            <img src={logo} alt="logo"/>
          </p>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="address_box">
              <h3>Address</h3>
              <p>
                <Link to="mailto:info@edmedia.productions">
                  info@edmedia.productions
                </Link>
              </p>
              <div>
                <p>
                  777 South Figueroa Street <br></br>
                  Suite 4600, DPT#2035 <br></br>Los 
                  Angeles, CA 90017
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="exp_box">
              <h3>Explore</h3>
              <ul>
                <li>
                  <a href="https://diversityproduction.pro/">Home</a>
                </li>
                <li>
                  <a href="https://diversityproduction.pro/about/">About</a>
                </li>
                <li>
                  <a href="https://diversityproduction.pro/why-us/">Why Us</a>
                </li>
                <li>
                  <a href="https://diversityproduction.pro/course/">Courses</a>
                </li>
                <li>
                  <a href="https://diversityproduction.pro/contact-us/">Contact</a>
                </li>
                <li>
                  <a href="https://diversityproduction.pro/video-page/">Video</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3">
            <div className="quick_link">
              <h3>Quick Link</h3>
              <ul>
                <li>
                  <a href="https://diversityproduction.pro/the-diversity-production-pro-reports/">Report</a>
                </li>
                <li>
                  <a href="/all-neft">All NFTs</a>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <a href="https://diversityproduction.pro/privacy-policy/">Privacy Policy</a>
                </li>
                <li>
                  <a href="https://diversityproduction.pro/refund-returns-policy/">Returns & Refund policy</a>
                </li>
                <li>
                  <a href="https://diversityproduction.pro/copyright-policy/">Copyrights Policy</a>
                </li>
                <li>
                  <a href="https://diversityproduction.pro/terms-condition/">Terms of Use</a>
                </li>
                <li>
                  <Link to="/register">Employer Register</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3">
            <div className="get_contect">
              <h3>Get Connected - Follow us on social media</h3>
              <ul>
                <li>
                  <a href="https://www.facebook.com/TheDPPro">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/the-diversity-production-pro">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/div_pro_pro/">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/Diversity_P_P">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="copyright">
          <p>
            © Copyright Brought to you by Education Media, LLC, All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

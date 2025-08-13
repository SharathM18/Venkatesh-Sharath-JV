import './css/Footer.css';
import { FaLinkedin, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__top">
                <h2>
                    Need help? <span className="footer__highlight">We're here to assist you</span>
                </h2>
                <p>Contact us today to see how we can help bring your technology ideas to life!</p>
                <div className="footer__cta">
                    <button className="footer__button">
                        Get in touch <span className="footer__dot"></span>
                    </button>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="footer__linkedin">
                        <FaLinkedin size={24} />
                    </a>
                </div>
            </div>

            <hr className="footer__divider" />

            <div className="footer__nav">
                <ul>
                    <li>Services</li>
                    <li>Industries</li>
                    <li>About us</li>
                    <li>Our team</li>
                    <li>Career</li>
                    <li>Resources</li>
                    <li>News</li>
                </ul>
                <span className="footer__privacy">Privacy Policy</span>
            </div>

            <hr className="footer__divider" />

            <div className="footer__bottom">
                <p>Copyright © 2025 Mirafra. All rights reserved</p>
                <a href="#top" className="footer__scroll-top">
                    <FaArrowUp />
                </a>
            </div>
        </footer>
    );
};

export default Footer;

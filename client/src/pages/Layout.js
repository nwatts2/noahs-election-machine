import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import GoogleAds from '../components/GoogleAds';
import '../css/index.css';

const Layout = () => {
    const getIsMobile = () => window.innerWidth <= 1020;
    const [isMobile, setIsMobile] = useState(getIsMobile());

    useEffect(() => {
        const onResize = () => {
            setIsMobile(getIsMobile());
        }

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        }

    }, [])

    return (
        <div className='fullBody'>
            <NavBar isMobile={isMobile} />
            <div className='scrollable'>
                <Outlet />
            </div>
            <Footer isMobile={isMobile} />
        </div>
    );
};

export default Layout;
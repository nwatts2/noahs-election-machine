import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import icon from '../images/menu.png';
import '../css/Menu.css';

function Menu () {
    const [isExpanded, setIsExpanded] = useState(false);
    const [menuStyle, setMenuStyle] = useState({visibility: 'hidden', animation: 'moveLeft .5s ease-in-out'})

    function expand() {
        let style = {
            visibility: 'visible',
            animation: 'moveRight .5s ease-in-out'
        }

        setMenuStyle(style);
        setIsExpanded(true);

    }

    function hide() {
        let style = {
            animation: 'moveLeft .5s ease-in-out',
            visibility: 'hidden'
        }

        setMenuStyle(style);
        setIsExpanded(false);
    }

    return (
        <div className='menu'>
            <img src={icon}
            onClick={() => {
                if (isExpanded) {hide()}
                else {expand()}
            }} />
            <div className='navBody' style={menuStyle}>
                <ul>
                    <li onClick={hide}>
                        <Link to='/call-simulator'>Call Simulator</Link>
                    </li>
                    <li onClick={hide}>
                        <Link to='/'>Live Results</Link>
                    </li>
                    <li onClick={hide}>
                        <Link to='/past-results'>Past Results</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Menu;
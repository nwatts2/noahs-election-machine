import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Menu.css';

function Menu () {
    const [isExpanded, setIsExpanded] = useState(false);
    const [menuStyle, setMenuStyle] = useState({visibility: 'hidden', animation: 'moveLeft .5s ease-in-out'})

    function expand() {
        let style = {
            visibility: 'visible',
            animation: 'moveRight .5s ease-in-out',
            left: '0rem'
        }

        setMenuStyle(style);
        setIsExpanded(true);

    }

    function hide() {
        let style = {
            animation: 'moveLeft .5s ease-in-out',
            visibility: 'hidden',
            left: '-20rem'
        }

        setMenuStyle(style);
        setIsExpanded(false);
    }

    

    return (
        <div className='menu' 
            onClick={() => {
                if (isExpanded) {hide()}
                else {expand()}
            }}>
            <svg x="0px" y="0px"
                width="30" height="30"
                viewBox="0 0 30 30"
                >
                <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path></svg>
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
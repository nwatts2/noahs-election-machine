import { Link } from 'react-router-dom';
import logo from '../images/electionLogo.png';
import Menu from '../components/Menu';
import '../css/NavBar.css';

const NavBar = ({isMobile}) => {
    return (
        <nav className={'row'}>
            <ul className={'row'}>
                {isMobile &&
                    <Menu />
                }
                {isMobile === false &&
                    <div className='row third'>
                        <li>
                            <Link to='/call-simulator'>Call Simulator</Link>
                        </li>
                    </div>
                }
                <div className={isMobile ? 'row' : 'row third'}>
                    <li>
                        <Link className='row' to='/'>
                            <img src={logo} alt="Noah's Election Machine Logo" height='25px' />
                            Noah's Election Machine
                        </Link>
                    </li>
                </div>
                {isMobile === false &&
                    <div className='row third'>
                        <li>
                            <Link to='/past-results'>Past Results</Link>
                        </li>
                    </div>
                }
            </ul>
        </nav>
    );
};

export default NavBar;
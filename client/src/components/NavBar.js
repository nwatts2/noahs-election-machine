import { Link } from 'react-router-dom';
import styles from '../css/NavBar.module.css';
import logo from '../images/electionLogo.png';
import Menu from '../components/Menu';

const NavBar = ({isMobile}) => {
    

    return (
        <nav className={styles.row}>
            <ul className={styles.row}>
                {isMobile &&
                    <Menu />
                }
                {isMobile === false &&
                    <div className={`${styles.row} ${styles.third}`}>
                        <li>
                            <Link to='/call-simulator'>Call Simulator</Link>
                        </li>
                    </div>
                }
                <div className={isMobile ? styles.row : `${styles.row} ${styles.third}`}>
                    <li>
                        <Link className='row' to='/'>
                            <img src={logo} alt="Noah's Election Machine Logo" height='25px' />
                            Noah's Election Machine
                        </Link>
                    </li>
                </div>
                {isMobile === false &&
                    <div className={`${styles.row} ${styles.third}`}>
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
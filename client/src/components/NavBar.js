import { Link } from 'react-router-dom';
import styles from '../css/NavBar.module.css';
import logo from '../images/electionLogo.png';

const NavBar = () => {
    return (
        <nav className={styles.row}>
            <ul className={styles.row}>
                <div className={`${styles.row} ${styles.third}`}>
                    <li>
                        <Link to='/call-simulator'>Call Simulator</Link>
                    </li>
                </div>
                <div className={`${styles.row} ${styles.third}`}>
                    <li>
                        <Link className='row' to='/'>
                            <img src={logo} alt="Noah's Election Machine Logo" height='25px' />
                            Noah's Election Machine
                        </Link>
                    </li>
                </div>
                <div className={`${styles.row} ${styles.third}`}>
                    <li>
                        <Link to='/past-results'>Past Results</Link>
                    </li>
                </div>
            </ul>
        </nav>
    );
};

export default NavBar;
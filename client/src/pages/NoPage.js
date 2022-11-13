import { Link } from 'react-router-dom';

const NoPage = () => {
    return (
        <>
            <h1>Uh-Oh</h1>
            <p>Looks like we can't find this page. To get back to the home page, click
                <Link to='/'> <span style={{textDecoration: 'underline'}}>here</span></Link>
            .</p>
        </>
    );
}

export default NoPage;
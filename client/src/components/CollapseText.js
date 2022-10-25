import { useEffect, useState } from 'react';
import '../css/CollapseText.css';

function CollapseText ({ text, subtext }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [style, setStyle] = useState({});
    const getIsMobile = () => window.innerWidth <= 480;
    const [isMobile, setIsMobile] = useState(getIsMobile());

    useEffect(() => {
        if (isMobile) {
            setStyle({padding: '0px 10px 0px 10px', maxHeight: '50px', color: 'transparent', textShadow: 'none'})
        } else {
            setStyle({padding: '0px 70px 0px 70px', maxHeight: '50px', color: 'transparent', textShadow: 'none'})
        }
        
    }, [isMobile])

    useEffect(() => {
        const onResize = () => {
            setIsMobile(getIsMobile());
        }

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        }

    }, [])

    function expand () {
        if (isExpanded) {setIsExpanded(false)}
        else {setIsExpanded(true)}
    }

    return (
        <div className='collapseTextContainer' style={isExpanded ? {} : style}>
            <button className='expandButton' onClick={expand}>{isExpanded ? '-' : '+'}</button>
            &emsp;
            <span className='collapseText'>{text}</span>
            {subtext &&
                <>
                    <br /> <br />
                    &emsp;
                    <span className='collapseText'>{subtext}</span>
                </>
            }
        </div>
    );
}

export default CollapseText;
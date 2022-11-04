import { useEffect, useState } from 'react';
import '../css/CollapseText.css';

function CollapseText ({ text, subtext }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [contStyle, setContStyle] = useState({});
    const [style, setStyle] = useState({});
    const getIsMobile = () => window.innerWidth <= 740;
    const [isMobile, setIsMobile] = useState(getIsMobile());

    useEffect(() => {
        if (isMobile) {
            setContStyle({padding: '0px 10px 0px 10px', maxHeight: '50px'});
            setStyle({color: 'transparent', textShadow: 'none'});
        } else {
            setContStyle({padding: '0px 70px 0px 70px', maxHeight: '50px'});
            setStyle({color: 'transparent', textShadow: 'none'});
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
        if (isExpanded) {
            setIsExpanded(false);
        }
        else {
            setIsExpanded(true);
        }
    }

    return (
        <div className='collapseTextContainer' style={isExpanded ? {} : contStyle}>
            <button className='expandButton' onClick={expand}>{isExpanded ? '-' : '+'}</button>
            &emsp;
            <span className='collapseText' style={isExpanded ? {} : style}>{text}</span>
            {subtext &&
                <>
                    <br /> <br />
                    &emsp;
                    <span className='collapseText' style={isExpanded ? {} : style}>{subtext}</span>
                </>
            }
        </div>
    );
}

export default CollapseText;
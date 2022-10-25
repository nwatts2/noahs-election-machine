import { useState, useEffect } from 'react';
import '../css/CollapseText.css';

function CollapseText ({ text, subtext }) {
    const [isExpanded, setIsExpanded] = useState(true);

    function expand () {
        if (isExpanded) {setIsExpanded(false)}
        else {setIsExpanded(true)}
    }

    return (
        <div className='collapseTextContainer' style={isExpanded ? {} : {padding: '0px 70px 0px 70px', maxHeight: '50px', color: 'transparent', textShadow: 'none'}}>
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
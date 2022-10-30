import { useEffect, useState, useRef } from 'react';
import '../css/LastRefresh.css';

function LastRefresh({ refreshCount, setRefreshCount }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const refreshButton = useRef(null);
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    useEffect(() => {
        const date = new Date();

        setCurrentTime(date);

        refreshButton.current.style.animation = 'rotate .75s ease-in-out 0s infinite';
        setTimeout(() => {refreshButton.current.style.animation = ''}, 1499);

    }, [refreshCount])
    
    return (
        <div className='refresh'>
            <div className='refreshSVG' onClick={() => {setRefreshCount((c) => c + 1)}}>
                <svg x="0px" y="0px"
                    ref={refreshButton} 
                    viewBox="0 0 489.645 489.645">
                    <path 
                        d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3
                        c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5
                        c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8
                        c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2
                        C414.856,432.511,548.256,314.811,460.656,132.911z"/>
                </svg>
            </div>
            <span className='refreshText'>{`Data last updated on ${days[currentTime.getDay()]} ${months[currentTime.getMonth()]} ${currentTime.getDate()}, ${currentTime.getFullYear()}, at ${hours[currentTime.getHours()]}:${currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes()}:${currentTime.getSeconds() < 10 ? '0' + currentTime.getSeconds() : currentTime.getSeconds()} ${currentTime.getHours() >= 12 ? 'PM':'AM'}.`}</span>
        </div>
    );
}

export default LastRefresh;
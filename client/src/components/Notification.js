import { useRef, useEffect } from 'react';
import '../css/Notification.css';

function Notification ({ text, isNegative, trigger }) {
    const notification = useRef(null);

    useEffect(() => {
        if (text === 'Message sent' || text === 'Message failed to send') {
            notification.current.style.visibility = 'visible';
            notification.current.style.animation = 'moveLeft .5s ease-in-out';

            setTimeout(() => {
                notification.current.style.right = '0rem';
            }, 495);

            setTimeout(() => {
                notification.current.style.animation = 'moveRight .5s ease-in-out';
                notification.current.style.right = '-50rem';

                setTimeout(() => {
                    notification.current.style.visibility = 'hidden';
                }, 500);
            }, 3500);

        }

        return;

    }, [trigger]);

    return (
        <div className = {isNegative ? 'notificationContainerNegative' : 'notificationContainer'} ref={notification}>
            <span>{text}</span>
        </div>
    );
}

export default Notification;
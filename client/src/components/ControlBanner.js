import { useState, useEffect, useRef } from 'react';
import '../css/ControlBanner.css';

function ControlBanner ({ mode, count }) {
    const [winningClass, setWinningClass] = useState('');
    const container = useRef(null);

    useEffect(() => {
        if (mode === 'SENATE') {
            if (count[0] >= 50 && winningClass !== 'Democratic') {
                setWinningClass('Democratic');

            } else if (count[1] > 50 && winningClass !== 'Republican') {
                setWinningClass('Republican');

            } else if (count[0] < 50 && count[1] <= 50 && winningClass !== '') {
                setWinningClass('');
            }
        } else if (mode === 'HOUSE') {
            if (count[0] >= 218 && winningClass !== 'Democratic') {
                setWinningClass('Democratic');

            } else if (count[1] >= 218 && winningClass !== 'Republican') {
                setWinningClass('Republican');

            } else if (count[0] < 218 && count[1] < 218 && winningClass !== '') {
                setWinningClass('');

            }
        } else if (mode === 'GOVERNOR') {
            if (count[0] > 25 && winningClass !== 'Democratic') {
                setWinningClass('Democratic');

            } else if (count[1] > 25 && winningClass !== 'Republican') {
                setWinningClass('Republican');

            } else if (count[0] < 25 && count[1] < 25 && winningClass !== '') {
                setWinningClass('');

            }

        }

    }, [mode, count]);
    

    return (
        <>
        {(winningClass !== '' && (mode === 'SENATE' || mode === 'HOUSE' || mode === 'GOVERNOR')) &&
        <div className={`controlBanner ${winningClass}`} ref={container}>
            <h2>{mode} CONTROL: {winningClass.toUpperCase()}</h2>
            <h3>{`The ${winningClass === 'Democratic' ? 'Democrats' : 'Republicans'} are projected to win control of the ${mode === 'SENATE' ? 'U.S. Senate' : (mode === 'HOUSE' ? 'U.S. House of Representatives' : 'most governorships')}`}</h3>

        </div>
        }
        </>
    );
}

export default ControlBanner;
import { useState, useEffect, useRef } from 'react';
import drawChart from '../components/drawChart';

function Graph ({data}) {
    const ref = useRef(null);

    const [winFill, setWinFill] = useState('transparent');
    const [winStroke, setWinStroke] = useState('transparent');
    const [winText, setWinText] = useState('');

    useEffect(() => {
        if (ref.current) {
            drawChart(ref.current, data);
        }

        /*if (winText !== '') {
            for (let x of data) {
                if (x.value >= 218) {
                  setWinStroke('white');
                  if (x.party === 'DEMS') {setWinFill("rgba(0, 71, 255, 1)"); setWinText(`DEMS`)}
                  else if (x.party === 'GOP') {setWinFill("rgb(253, 3, 83)"); setWinText(`GOP`)}
                }
            }
        }*/
        

    }, [ref, data]);

    return (
        <div className='graph' ref={ref} />
    );

}

export default Graph;
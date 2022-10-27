import { useEffect, useRef } from 'react';
import drawChart from '../components/drawChart';

function Graph ({data}) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            drawChart(ref.current, data);
        }

    }, [ref, data]);

    return (
        <div className='graph' ref={ref} />
    );

}

export default Graph;
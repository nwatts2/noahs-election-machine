import '../css/SenateTracker.css';

const SenateButton = (props) => {
    let colorClass, gradientClass = '';

    if (props.candidate.party === 'Republican') {colorClass = 'rep'}
    else if (props.candidate.party === 'Democratic') {colorClass = 'dem'}
    else {colorClass = 'ind'}

    if (props.candidate.hasElection) {
        if (Math.abs(props.candidate.ratingRank) === 3) {
            gradientClass = 'solid';
        } else if (Math.abs(props.candidate.ratingRank) === 2) {
            gradientClass = `likely`;
        } else if (Math.abs(props.candidate.ratingRank) === 1) {
            gradientClass = `lean`;
        } else {
            gradientClass = `tossup`;
        }

    } else {
        gradientClass = colorClass;
    }

    return (
        <button className={`${colorClass} ${gradientClass}`}>
            <span className='stateName'>{props.candidate.state} </span>
            <span>{props.candidate.lname.toUpperCase()}</span>
        </button>
    );
};

const SenateTracker = ({records}) => {
    

    function buttonList(party) {
        return records.map((candidate) => {
            if (candidate.favorite && candidate.held === party) {
                return (
                    <SenateButton candidate={candidate} key={candidate._id} />
                );
            } else {
                return (<></>);
            }
        });
    }

    return (
        <div className='senateTrackerFull'>
            <div className='fullTracker'>
                <div className='dems'>{buttonList('Democratic')}</div>
                <hr />
                <div className='reps'>{buttonList('Republican')}</div>
            </div>
        </div>
     
    );
};

export default SenateTracker;
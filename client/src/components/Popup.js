const Popup = ({ isSpecial, resultsYear, page, raceRecords, resultsRecords, mode, state, mouseposition}) => {
    let title = '-', raceInfo = '-', favoriteStatement;
    let thisRace = {}, separatedState = '', district = '';

    const stateList = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
    const stateFullList = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachussetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconson','Wyoming'];


    if (mode === 'HOUSE') {
        separatedState = state.slice(0, 2);
        district = state.slice(3, state.length);
    }

    if (mode === 'HOUSE') {
        for (let x of raceRecords) {
                if (x.year === resultsYear && x.type === mode && x.state === separatedState && Number(x.district) === Number(district.slice(0, district.length - 2))) {thisRace = x; break;}
        }
    } else {
        for (let x of raceRecords) {
            if (x.year === resultsYear && x.type === mode && x.state === state && x.isSpecial === isSpecial) {thisRace = x; break;}
        }
    }

    let favorite = {}, altCandidate = {};

    if (mode === 'HOUSE') {
        for (let x of resultsRecords) {
            if (x.year === resultsYear && x.state === separatedState && x.district === district && x.type === mode) {
                if (thisRace.margin < 0 && x.caucus === 'Republican' && typeof favorite.state === 'undefined') {
                    favorite = x;
                } else if (thisRace.margin >= 0 && x.caucus === 'Democratic' && typeof favorite.state === 'undefined') {
                    favorite = x;
                } else if (typeof altCandidate.state === 'undefined') {
                    altCandidate = x;
                }
            }
        }

    } else {
        for (let x of resultsRecords) {
            if (x.year === resultsYear && x.state === state && x.type === mode && x.isSpecial === isSpecial) {
                if (thisRace.margin < 0 && x.caucus === 'Republican' && typeof favorite.state === 'undefined') {
                    favorite = x;
                } else if (thisRace.margin >= 0 && x.caucus === 'Democratic' && typeof favorite.state === 'undefined') {
                    favorite = x;
                } else if (typeof altCandidate.state === 'undefined') {
                    altCandidate = x;
                    console.log(isSpecial)
                }
            }
        }
    }

    let fullState = '';
    for (let x of stateList) {
        if (state.slice(0, 2) === x) {
            fullState = stateFullList[stateList.indexOf(x)];
        }
    }

    const tableTitle = `${resultsYear} ${mode === 'HOUSE' ? state : fullState.toUpperCase()} ${mode} RESULTS`;

    let typeText = '';

    if (mode === 'SENATE') {typeText = 'the U.S. Senate'}
    else if (mode === 'HOUSE') {typeText = 'the U.S. House of Representatives'}
    else if (mode === 'GOVERNOR') {typeText = 'Governor'}

    if (Math.abs(thisRace.ratingRank) === 3) {favoriteStatement = 'clearly favored'}
    else if (Math.abs(thisRace.ratingRank) === 2) {favoriteStatement = 'favored'}
    else if (Math.abs(thisRace.ratingRank) === 1) {favoriteStatement = 'somewhat favored'}
    else if (Math.abs(thisRace.ratingRank) === 0) {favoriteStatement = 'slightly favored'}

    if (mode === 'SENATE' && state === 'AK') {favoriteStatement = 'slightly favored'}

    //if (candidate.hasElection) {
    title = `${fullState.toUpperCase()} ${favorite.isSpecial ? 'SPECIAL ': ''}${mode} RACE`;
    if (mode === 'SENATE' || mode === 'GOVERNOR') {
        raceInfo = `${favorite.name} is running for ${typeText} in the state of ${fullState} against ${altCandidate.name}. ${favorite.name} is a member of the ${favorite.party} party and is ${favoriteStatement} to win this race.`

    } else if (mode === 'HOUSE') {
        raceInfo = `${favorite.name} is running for ${typeText} in the ${district} district of ${fullState} against ${altCandidate.name}. ${favorite.name} is a member of the ${favorite.party} party and is ${favoriteStatement} to win this race.`

    }

    function calculatePopupPosition() {
        if (mouseposition.y > (.5 * window.screen.height) && mouseposition.x <= .5 * window.screen.width) {
            return {bottom: `${100 * (window.screen.height - mouseposition.y - 130) / window.screen.height}%`, left:`${mouseposition.x + 10}px`};

        } else if (mouseposition.y > (.5 * window.screen.height) && mouseposition.x > .5 * window.screen.width) {
            return {bottom: `${100 * (window.screen.height - mouseposition.y - 130) / window.screen.height}%`, right:`${100 * (window.screen.width - mouseposition.x + 5) / window.screen.width}%`};

        } else if (mouseposition.y <= (.5 * window.screen.height) && mouseposition.x > .5 * window.screen.width) {
            return {top: `${mouseposition.y + 10}px`, right:`${100 * (window.screen.width - mouseposition.x + 5) / window.screen.width}%`};

        } else if (mouseposition.y <= (.5 * window.screen.height) && mouseposition.x <= .5 * window.screen.width) {
            return {top: `${mouseposition.y + 10}px`, left:`${mouseposition.x + 10}px`};

        }
    }


    function Table () {
        const names = [], parties = [], votes = [], percents = [], firstroundvotes = [], firstroundpercents = [], runoffvotes = [], runoffpercents = [];

        if (mode === 'GOVERNOR' || mode === 'SENATE') {
            resultsRecords.map((record) => {
                if (record.type === mode && record.state === state && record.year === resultsYear && record.isSpecial === isSpecial) {
                    names.push(record.name);
                    parties.push(record.party);
                    votes.push(record.vote !== '' ? record.vote : '-');
                    percents.push(record.percent !== '' ? record.percent : '-');
                    firstroundvotes.push(record.firstRoundVote !== '' ? record.firstRoundVote : '-');
                    firstroundpercents.push(record.firstRoundPercent !== '' ? record.firstRoundPercent : '-');
                    runoffvotes.push(record.runoffVote !== '' ? record.runoffVote : '-');
                    runoffpercents.push(record.runoffPercent !== '' ? record.runoffPercent : '-');
                }
            });

        } else if (mode === 'HOUSE') {
            resultsRecords.map((record) => {
                if (record.type === mode && record.state === separatedState && record.district === district && record.year === resultsYear) {
                    names.push(record.name);
                    parties.push(record.party);
                    votes.push(record.vote !== '' ? record.vote : '-');
                    percents.push(record.percent !== '' ? record.percent : '-');
                    firstroundvotes.push(record.firstRoundVote !== '' ? record.firstRoundVote : '-');
                    firstroundpercents.push(record.firstRoundPercent !== '' ? record.firstRoundPercent : '-');
                    runoffvotes.push(record.runoffVote !== '' ? record.runoffVote : '-');
                    runoffpercents.push(record.runoffPercent !== '' ? record.runoffPercent : '-');
                }
            });
        }
        

        

        return (
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        {names.map((name) => {return <th style={{textDecoration: 'underline'}}>{name}</th>})}
                    </tr>
                    <tr>
                        <th>Party</th>
                        {parties.map((party) => {return <td>{party}</td>})}
                    </tr>
                    {firstroundvotes[0] === '-' &&
                    <>
                        <tr>
                            <th>Votes</th>
                            {votes.map((vote) => {return <td>{vote}</td>})}
                        </tr>
                        <tr>
                            <th>Percent</th>
                            {percents.map((percent) => {return <td>{percent}</td>})}
                        </tr>
                    </>
                    }
                    {firstroundvotes[0] !== '-' &&
                    <>
                        <tr>
                            <th>First Round Votes</th>
                            {firstroundvotes.map((vote) => {return <td>{vote}</td>})}
                        </tr>
                        <tr>
                            <th>First Round Percent</th>
                            {firstroundpercents.map((percent) => {return <td>{percent}</td>})}
                        </tr>
                        <tr>
                            <th>Runoff Votes</th>
                            {runoffvotes.map((vote) => {return <td>{vote}</td>})}
                        </tr>
                        <tr>
                            <th>Runoff Percent</th>
                            {runoffpercents.map((percent) => {return <td>{percent}</td>})}
                        </tr>
                    </>
                    }
                </tbody>
            </table>
        );
    }

    if (page === 'LIVE' || page === 'CALLSIM') {
        return (
            <div className='popup' style={calculatePopupPosition()}>
                <div className='popupElement'>
                    <h3>{title}</h3>
                    <hr />
                    <span>{raceInfo}</span>
                    <hr />
                    <h3>{tableTitle}</h3>
                    <Table />
                    <hr />
                </div>
            </div>
            
        );
    } else if (page === 'PAST') {
        return (
            <div className='popup' style={calculatePopupPosition()}>
                <div className='popupElement'>
                    <hr />
                    <h3>{tableTitle}</h3>
                    <Table />
                    <hr />
                </div>
            </div>
            
        );
    } else {
        return (<></>);
    }
}

export default Popup;
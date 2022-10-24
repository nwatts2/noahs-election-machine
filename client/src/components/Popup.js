const Popup = ({ isSpecial, resultsYear, page, raceRecords, resultsRecords, mode, state, mouseposition}) => {
    let title = '-', raceInfo = '-', favoriteStatement;
    const tableTitle = `${resultsYear} ${mode} ELECTION RESULTS`;
    let thisRace = {}, separatedState = '', district = '';

    if (mode === 'HOUSE') {
        separatedState = state.slice(0, 2);
        district = state.slice(3, state.length);
    }

    for (let x of raceRecords) {
        if (mode === 'HOUSE') {
            if (x.year === resultsYear && x.type === mode && x.state === separatedState && Number(x.district) === Number(district.slice(0, district.length - 2))) {thisRace = x; break;}

        } else {
            if (x.year === resultsYear && x.type === mode && x.state === state && x.isSpecial === isSpecial) {thisRace = x; break;}
        }
    }

    let favorite = {}, altCandidate = {};

    if (mode === 'HOUSE') {
        for (let x of resultsRecords) {
            if (x.year === resultsYear && x.state === separatedState && x.district === district && x.type === mode && x.isSpecial === isSpecial) {
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
                }
            }
        }
    }
    

    let typeText = '';

    if (mode === 'SENATE') {typeText = 'the U.S. Senate'}
    else if (mode === 'HOUSE') {typeText = 'the U.S. House of Representatives'}
    else if (mode === 'GOVERNOR') {typeText = 'Governor'}

    if (Math.abs(thisRace.ratingRank) === 3) {favoriteStatement = 'clearly favored'}
    else if (Math.abs(thisRace.ratingRank) === 2) {favoriteStatement = 'favored'}
    else if (Math.abs(thisRace.ratingRank) === 1) {favoriteStatement = 'somewhat favored'}
    else if (Math.abs(thisRace.ratingRank) === 0) {favoriteStatement = 'slightly favored'}

    //if (candidate.hasElection) {
    title = `${state} ${mode} RACE`;
    if (mode === 'SENATE' || mode === 'GOVERNOR') {
        raceInfo = `${favorite.name} is running for ${typeText} in the state of ${state} against ${altCandidate.name}. ${favorite.name} is ${favoriteStatement} to win this race, which would be a win for the ${favorite.party} party.`

    } else if (mode === 'HOUSE') {
        raceInfo = `${favorite.name} is running for ${typeText} in the ${district} district of ${separatedState} against ${altCandidate.name}. ${favorite.name} is ${favoriteStatement} to win this race, which would be a win for the ${favorite.party} party.`

    }
    /*}
    else if (!candidate.hasElection && (candidate.party === 'Republican' || candidate.party === 'Democratic')) {
        title = `${candidate.state} ${candidate.type}`;
        raceInfo = `${candidate.name} is an incumbent senator and a member of the ${candidate.party} party. There are no elections for this seat in the 2022 election cycle.`
     
    } 
    else {
        title = `${candidate.state} ${candidate.type}`;
        raceInfo = `${candidate.name} is an incumbent and independent senator who caucuses with the ${candidate.caucus} party. There are no elections for this seat in the 2022 election cycle.`
    }*/

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
import { useRef, useState, useEffect } from 'react';

const Popup = ({ isSpecial, resultsYear, page, raceRecords, resultsRecords, mode, state, mouseposition}) => {
    const popup = useRef(null);
    const [popStyle, setPopStyle] = useState({top: '0px', left: '0px'});

    useEffect(() => {
        if (popup.current) {
            calculatePopupPosition();
        }

    }, [mouseposition.x, mouseposition.y]);

    let title = '-', raceInfo = '-', favoriteStatement;
    let thisRace = {}, separatedState = '', district = '';

    const stateList = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
    const stateFullList = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachussetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconson','Wyoming'];

    let favorite = {}, altCandidate = {};

    if (mode === 'HOUSE') {
        separatedState = state.slice(0, 2);
        district = state.slice(3, state.length);

        for (let x of raceRecords) {
            if (x.year === resultsYear && x.type === mode && x.state === separatedState && Number(x.district) === Number(district.slice(0, district.length - 2))) {thisRace = x; break;}
        }

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
        for (let x of raceRecords) {
            if (x.year === resultsYear && x.type === mode && x.state === state && x.isSpecial === isSpecial) {thisRace = x; break;}
        }

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

    title = `${fullState.toUpperCase()} ${favorite.isSpecial ? 'SPECIAL ': ''}${mode} RACE`;

    if (favorite && altCandidate && favorite.called === '' && altCandidate.called === '') {
        if (mode === 'SENATE' || mode === 'GOVERNOR') {
            raceInfo = `${favorite.name} is running for ${typeText} in the state of ${fullState} against ${altCandidate.name}. ${favorite.name} is a member of the ${favorite.party} party and is ${favoriteStatement} to win this race.`

        } else if (mode === 'HOUSE') {
            raceInfo = `${favorite.name} is running for ${typeText} in the ${district} district of ${fullState} against ${altCandidate.name}. ${favorite.name} is a member of the ${favorite.party} party and is ${favoriteStatement} to win this race.`

        }
    } else if (favorite && altCandidate && favorite.called !== '') {
        if (mode === 'SENATE') {
            raceInfo = `${favorite.name} ${favorite.caucus === 'Democratic' ? '(D)' : '(R)'} is projected to win the state of ${fullState} in ${typeText}. ${favorite.name} ran against ${altCandidate.name} for this seat and was initially ${favoriteStatement} to win this race.`
    
        } else if (mode === 'GOVERNOR') {
            raceInfo = `${favorite.name} ${favorite.caucus === 'Democratic' ? '(D)' : '(R)'} is projected to win the governorship for the state of ${fullState}. ${favorite.name} ran against ${altCandidate.name} for this seat and was initially ${favoriteStatement} to win this race.`
    
        } else if (mode === 'HOUSE') {
            raceInfo = `${favorite.name} ${favorite.caucus === 'Democratic' ? '(D)' : '(R)'} is projected to win the ${district} district of ${fullState} in ${typeText}. ${favorite.name} ran against ${altCandidate.name} for this seat and was initially ${favoriteStatement} to win this race.`
    
        }
    } else if (favorite && altCandidate && altCandidate.called !== '') {
        if (mode === 'SENATE') {
            raceInfo = `${altCandidate.name} ${altCandidate.caucus === 'Democratic' ? '(D)' : '(R)'} is projected to win the state of ${fullState} in ${typeText}. ${altCandidate.name} ran against ${favorite.name} for this seat, though ${favorite.name} was initially ${favoriteStatement} to win this race.`
    
        } else if (mode === 'GOVERNOR') {
            raceInfo = `${altCandidate.name} ${altCandidate.caucus === 'Democratic' ? '(D)' : '(R)'} is projected to win the governorship for the state of ${fullState}. ${altCandidate.name} ran against ${favorite.name} for this seat, though ${favorite.name} was initially ${favoriteStatement} to win this race.`
    
        } else if (mode === 'HOUSE') {
            raceInfo = `${altCandidate.name} ${altCandidate.caucus === 'Democratic' ? '(D)' : '(R)'} is projected to win the ${district} district of ${fullState} in ${typeText}. ${altCandidate.name} ran against ${favorite.name} for this seat, though ${favorite.name} was initially ${favoriteStatement} to win this race.`
    
        }
    }

    function calculatePopupPosition() {
        let height = '0px', width = '0px', top, left, visibility = 'hidden';

        if (popup.current) {
            height = window.getComputedStyle(popup.current).height;
            width = window.getComputedStyle(popup.current).width;
            visibility = 'visible';
        }

        if (Number(window.innerHeight) - 40 - (Number(mouseposition.y) + Number(height.slice(0, height.length - 2))) <= 0) {
            if (Number(window.innerWidth) - 10 - (Number(mouseposition.x) + Number(width.slice(0, width.length - 2))) <= 0) {
                top = Number(mouseposition.y) - Number(height.slice(0, height.length - 2)) - 10;
                left = Number(mouseposition.x) - Number(width.slice(0, width.length - 2)) - 10;

            } else {
                top = Number(mouseposition.y) - Number(height.slice(0, height.length - 2)) - 10;
                left = Number(mouseposition.x) + 10;
            }
        } else {
            if (Number(window.innerWidth) - 10 - (Number(mouseposition.x) + Number(width.slice(0, width.length - 2))) <= 0) {
                top = Number(mouseposition.y) + 10;
                left = Number(mouseposition.x) - Number(width.slice(0, width.length - 2)) - 10;

            } else {
                top = Number(mouseposition.y) + 10;
                left = Number(mouseposition.x) + 10;
            }
        }

        if (window.innerWidth <= 740) {
            top = 60;
            left = 40;
        }

        if (popup.current && (`${top}px` !== popStyle.top || `${left}px` !== popStyle.left)) {
            setPopStyle({top: `${top}px`, left:`${left}px`, visibility: visibility});
        }

    }


    function Table () {
        const names = [], parties = [], votes = [], percents = [], firstroundvotes = [], firstroundpercents = [], runoffvotes = [], runoffpercents = [];
        let percentIn = 0;

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
                    percentIn = record.percentIn;
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
                    percentIn = record.percentIn;
                }
            });
        }
        
        return (
            <>
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
                            <th rowSpan={2}>First Round</th>
                            {firstroundvotes.map((vote) => {return <td>{vote}</td>})}
                        </tr>
                        <tr>
                            {/*<th style={{whiteSpace: 'nowrap'}}>First Round Percent</th>*/}
                            {firstroundpercents.map((percent) => {return <td>{percent}</td>})}
                        </tr>
                        <tr>
                            <th rowSpan={2}>Runoff</th>
                            {runoffvotes.map((vote) => {return <td>{vote}</td>})}
                        </tr>
                        <tr>
                            {/*<th style={{whiteSpace: 'nowrap'}}>Runoff Percent</th>*/}
                            {runoffpercents.map((percent) => {return <td>{percent}</td>})}
                        </tr>
                    </>
                    }
                </tbody>
            </table>
            {(page === 'LIVE' || page === 'CALLSIM') &&
                <span>Percent Reporting: {percentIn === 0 ? '- ' : percentIn}%</span>
            }
            </>
        );
    }

    if (page === 'LIVE' || page === 'CALLSIM') {
        return (
            <div className='popup' ref={popup} style={popStyle}>
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
            <div className='popup' ref={popup} style={popStyle}>
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
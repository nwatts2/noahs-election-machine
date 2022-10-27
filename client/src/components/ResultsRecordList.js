import React, { useEffect, useState, useRef } from 'react';
import '../css/RecordList.css';

const ResultRecord = (props) => {
    const [stateCandidates, setStateCandidates] = useState([]);
    const [stateSpecialCandidates, setStateSpecialCandidates] = useState([]);
    const [stateFirstCandidate, setStateFirstCandidate] = useState({});
    const [stateFirstSpecial, setStateFirstSpecial] = useState({});

    const [winningClass, setWinningClass] = useState();
    const losingClass = 'notCalled';

    useEffect(() => {
        let candidates = [], specialCandidates = [], firstCandidate = {}, firstSpecial = {};

        let i = 0, j = 0, k = 0;
        while (i < props.records.length) {
            if (props.type === 'HOUSE') {
                if (props.records[i].state === props.state && props.records[i].type === props.type && props.records[i].district === props.district && props.year === props.records[i].year) {
                    if(props.records[i].isSpecial) {
                        specialCandidates.push(props.records[i]);

                        if (k === 0) {
                            firstSpecial = props.records[i];
                        }

                        if (props.records[i].called !== '') {
                            if (props.records[i].caucus === 'Democratic') {setWinningClass('calledDem')}
                            else if (props.records[i].caucus === 'Republican') {setWinningClass('calledRep')}
                        }
            
                        k += 1;
                    } else {
                        candidates.push(props.records[i]);

                        if (j === 0) {
                            firstCandidate = props.records[i];
                        }

                        if (props.records[i].called !== '') {
                            if (props.records[i].caucus === 'Democratic') {setWinningClass('calledDem')}
                            else if (props.records[i].caucus === 'Republican') {setWinningClass('calledRep')}
                        }
            
                        j += 1;
                    }
                }
                i += 1;
            } else {
                if (props.records[i].state === props.state && props.records[i].type === props.type && props.year === props.records[i].year) {
                    if(props.records[i].isSpecial) {
                        specialCandidates.push(props.records[i]);

                        if (k === 0) {
                            firstSpecial = props.records[i];
                        }

                        if (props.records[i].called !== '') {
                            if (props.records[i].caucus === 'Democratic') {setWinningClass('calledDem')}
                            else if (props.records[i].caucus === 'Republican') {setWinningClass('calledRep')}
                        }
            
                        k += 1;
                    } else {
                        candidates.push(props.records[i]);

                        if (j === 0) {
                            firstCandidate = props.records[i];
                        }

                        if (props.records[i].called !== '') {
                            if (props.records[i].caucus === 'Democratic') {setWinningClass('calledDem')}
                            else if (props.records[i].caucus === 'Republican') {setWinningClass('calledRep')}
                        }
            
                        j += 1;
                    }
                }
                i += 1;
            }            
        }

        i = 0;
        while (i < candidates.length) {
            let j = 0;
            while(j < candidates.length) {
                if (candidates[j].called !== '') {
                    firstCandidate = candidates[j];
                    if (j !== 0) {
                        const tempCandidate = candidates[j];
                        candidates[j] = candidates[0];
                        candidates[0] = tempCandidate;
                    }
                   
                }
                j++;
            }
            
            i++;
        }

        i = 0;
        while (i < specialCandidates.length) {
            let j = 0;
            while(j < specialCandidates.length) {
                if (specialCandidates[j].called !== '') {
                    firstSpecial = specialCandidates[j];
                    if (i < j) {
                        const tempCandidate = specialCandidates[i];
                        specialCandidates[i] = specialCandidates[j];
                        specialCandidates[j] = tempCandidate;
                    }
                }
                j++;
            }
            
            i++;
        }

        setStateCandidates(candidates);
        setStateSpecialCandidates(specialCandidates);
        setStateFirstCandidate(firstCandidate);
        setStateFirstSpecial(firstSpecial);
    }, [props.state, props.year, props.type, JSON.stringify(props.records), props.updateHouseWidget])
    
    return (
    <>
            {stateSpecialCandidates.map((candidate) => {
                if (candidate === stateFirstSpecial) {
                    return (
                        <tr style={{borderTop:'2px solid white'}} className={candidate.called === '' ? losingClass : winningClass}>
                            <td className={`${'stateLabel'}`} rowSpan={stateSpecialCandidates.length}>{props.type === 'HOUSE' ? `${props.state}-${candidate.district} Special` : `${props.state} Special`}</td>
                            <td>{candidate.name}</td>
                            <td>{candidate.party}</td>
                            {candidate.vote === '' ? <td>-</td>: <td>{candidate.vote}</td>}
                            {candidate.percent === '' ? <td>-</td>: <td>{candidate.percent}</td>}
        
                            {props.needRunoff &&
                            <>
                                {candidate.firstRoundVote === '' ? <td>-</td>: <td>{candidate.firstRoundVote}</td>}
                                {candidate.firstRoundPercent === '' ? <td>-</td>: <td>{candidate.firstRoundPercent}</td>}
                                {candidate.runoffVote === '' ? <td>-</td>: <td>{candidate.runoffVote}</td>}
                                {candidate.runoffPercent === '' ? <td>-</td>: <td>{candidate.runoffPercent}</td>}
                            </>
                            }
                        </tr>
                        );
                } else {
                    return (
                        <tr className={candidate.called === '' ? losingClass : winningClass}>
                            <td>{candidate.name}</td>
                            <td>{candidate.party}</td>
                            {candidate.vote === '' ? <td>-</td>: <td>{candidate.vote}</td>}
                            {candidate.percent === '' ? <td>-</td>: <td>{candidate.percent}</td>}
        
                            {props.needRunoff &&
                            <>
                                {candidate.firstRoundVote === '' ? <td>-</td>: <td>{candidate.firstRoundVote}</td>}
                                {candidate.firstRoundPercent === '' ? <td>-</td>: <td>{candidate.firstRoundPercent}</td>}
                                {candidate.runoffVote === '' ? <td>-</td>: <td>{candidate.runoffVote}</td>}
                                {candidate.runoffPercent === '' ? <td>-</td>: <td>{candidate.runoffPercent}</td>}
                            </>
                            }
                        </tr>
                        );
                }
               
            })}
            {stateCandidates.map((candidate) => {
                if (candidate === stateFirstCandidate) {
                    return (
                        <tr style={{borderTop:'2px solid white'}}  className={candidate.called === '' ? losingClass : winningClass}>
                            <td className={`${'stateLabel'}`} rowSpan={stateCandidates.length}>{props.type === 'HOUSE' ? `${props.state}-${candidate.district}` : props.state}</td>
                            <td>{candidate.name}</td>
                            <td>{candidate.party}</td>
                            {candidate.vote === '' ? <td>-</td>: <td>{candidate.vote}</td>}
                            {candidate.percent === '' ? <td>-</td>: <td>{candidate.percent}</td>}
        
                            {props.needRunoff &&
                            <>
                                {candidate.firstRoundVote === '' ? <td>-</td>: <td>{candidate.firstRoundVote}</td>}
                                {candidate.firstRoundPercent === '' ? <td>-</td>: <td>{candidate.firstRoundPercent}</td>}
                                {candidate.runoffVote === '' ? <td>-</td>: <td>{candidate.runoffVote}</td>}
                                {candidate.runoffPercent === '' ? <td>-</td>: <td>{candidate.runoffPercent}</td>}
                            </>
                            }
                        </tr>
                        );
                } else {
                    return (
                        <tr className={candidate.called === '' ? losingClass : winningClass}>
                            <td>{candidate.name}</td>
                            <td>{candidate.party}</td>
                            {candidate.vote === '' ? <td>-</td>: <td>{candidate.vote}</td>}
                            {candidate.percent === '' ? <td>-</td>: <td>{candidate.percent}</td>}
        
                            {props.needRunoff &&
                            <>
                                {candidate.firstRoundVote === '' ? <td>-</td>: <td>{candidate.firstRoundVote}</td>}
                                {candidate.firstRoundPercent === '' ? <td>-</td>: <td>{candidate.firstRoundPercent}</td>}
                                {candidate.runoffVote === '' ? <td>-</td>: <td>{candidate.runoffVote}</td>}
                                {candidate.runoffPercent === '' ? <td>-</td>: <td>{candidate.runoffPercent}</td>}
                            </>
                            }
                        </tr>
                        );
                }
               
            })}
            
    </>
    );
};

export default function ResultsRecordList(props) {
    const [needRunoff, setNeedRunoff] = useState(false);
    const [currentState, setCurrentState] = useState((props.page === 'LIVE' || props.page === 'CALLSIM') ? 'Top Races' : 'AL');
    const [limit, setLimit] = useState(5);
    const [limitStyle, setLimitStyle] = useState({maxHeight: '500px'});
    const [displayedList, setDisplayedList] = useState([]);
    const [neededStates, setNeededStates] = useState([]);

    const stateSelect = useRef(null);

    const stateList = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']


    useEffect(() => {
        let needSet = false, candidatesList = [];

        for (let x of props.records) {
            if (props.type === x.type && x.state === currentState && props.year === x.year) {
                candidatesList.push(x);
            }
        }

        for (let x of candidatesList) {
            if (x.firstRoundVote !== '') {
                needSet = true;
            }
        }

        if (needSet) {setNeedRunoff(true)}
        else {setNeedRunoff(false)}

        if (limit === 1000 && document.getElementById('showMore')) {
        //if (limitStyle.maxHeight === '1500px' && document.getElementById('showMore')) {
            showMore(document.getElementById('showMore'));
        }

        getNeededStates();

        return;

    }, [currentState, props.records, props.type]);

    function getNeededStates() {
        const states = [];
        let needsUpdate = false;

        for (let thisState of stateList) {
            for (let record of props.records) {
                if (record.state.includes(thisState) && record.type === props.type && record.year === props.year && states.includes(thisState) === false) {
                    states.push(record.state);
                }
            }
        }

        let i = 0;
        while (i < neededStates.length) {
            if (!(states[i] && neededStates[i] && states[i] === neededStates[i])) {
                needsUpdate = true;
            }

            i++;
        }

        if (needsUpdate || neededStates.length === 0) {setNeededStates(states)}

        if (states.includes(currentState) === false) {
            if (props.page === 'LIVE' || props.page === 'CALLSIM') {
                setCurrentState('Top Races');
            } else {
                setCurrentState(states[0]);
            }
        }

    }

    function showMore(e) {
        if (limit !== 1000) {
        //if (limitStyle.maxHeight !== '1500px') {

            //setLimitStyle({maxHeight: '1500px'})
            setLimit(1000);
            e.innerHTML = 'SHOW LESS';
        } else {
            setLimit(5);
            //setLimitStyle({maxHeight: '200px'})
            e.innerHTML = 'SHOW MORE';
        }
    }

    function recordList() {
        let thisState = '', thisList = [], needsUpdate = false;
        const topSenate = ['PA', 'WI', 'NC', 'OH', 'AZ', 'NV', 'GA', 'CO', 'NH', 'FL'];
        const topGovernor = ['PA', 'WI', 'NV', 'AZ', 'KS', 'OR', 'TX'];
        const topHouse = ['AK-1st', 'AZ-2nd', 'CA-22nd', 'CA-27th', 'CO-8th', 'IA-3rd', 'IL-17th', 'KS-3rd', 'MD-6th', 'ME-2nd', 'NC-13th', 'NJ-7th', 'NM-2nd', 'NV-3rd', 'NY-18th', 'NY-19th', 'NY-22nd', 'PA-7th', 'TX-15th', 'VA-2nd'];

        let numRecords = 0;

        props.records.map((record) => {
            if (currentState === 'Top Races') {
                if (record.year === props.year && record.type === props.type && thisState !== `${record.state}-${record.district}`) {
                    thisState = `${record.state}-${record.district}`;

                    if (props.type === 'SENATE' && topSenate.includes(record.state)) {
                        thisList.push(record);

                    } else if (props.type === 'GOVERNOR' && topGovernor.includes(record.state)) {
                        thisList.push(record);

                    } else if (props.type === 'HOUSE' && topHouse.includes(thisState)) {
                        thisList.push(record);

                    }
                    
                   
                }
            }
            else if (record.state === currentState && record.year === props.year && record.type === props.type && thisState !== `${record.state}-${record.district}`) {
                thisState = `${record.state}-${record.district}`;

                thisList.push(record);
            }
        });

        let i = 0;
        while (i < thisList.length) {
            if (!(thisList[i] && displayedList[i] && thisList[i].name === displayedList[i].name)) {
                needsUpdate = true;
            }
            
            i++;
        }

        if (needsUpdate || (thisList.length !== 0 && displayedList.length === 0)) {setDisplayedList(thisList);}
        thisState = '';

        return displayedList.map((record) => {
            if (currentState === 'Top Races') {
                if (thisState !== `${record.state}-${record.district}`) {
                    thisState = `${record.state}-${record.district}`;

                    if (numRecords < limit) {
                        numRecords += 1;
                        return <ResultRecord updateHouseWidget={props.updateHouseWidget} states={neededStates} records={props.records} setRecords={props.setRecords} district={record.district} state={record.state} type={props.type} needRunoff={needRunoff} year={props.year}/>
    
                    }
                   
                }
            }
            else if (record.state === currentState && thisState !== `${record.state}-${record.district}`) {
                if (numRecords < limit) {
                    thisState = `${record.state}-${record.district}`;

                    numRecords += 1;

                    return (
                        <ResultRecord updateHouseWidget={props.updateHouseWidget} states={neededStates} records={props.records} setRecords={props.setRecords} district={record.district} state={record.state} type={props.type} needRunoff={needRunoff} year={props.year}/>
                    );
                }
            } else {
                return (<></>);
            }
        });
    }

    return (
        <div className={'resultsRecords'}>
            <h3>{props.year} {props.type} RACES</h3>
            <div>
                <span className={'spanText'}>Showing Results for</span>
                <select ref={stateSelect} value={currentState} onChange={(e) => {setCurrentState(e.currentTarget.value)}}>
                    {(props.page === 'LIVE' || props.page === 'CALLSIM') &&
                        <option>Top Races</option>
                    }
                    {neededStates.map((state) => {
                        return (
                            <option>{state}</option>
                        );
                    })}
                </select>
            </div>
            <table id='resultsTable'>
                <thead>
                    <tr>
                        <th>State</th>
                        <th>Name</th>
                        <th>Party</th>
                        <th>Vote</th>
                        <th>Percent</th>
                        {needRunoff === true &&
                        <>
                            <th>First Round Vote</th>
                            <th>First Round Percent</th>
                            <th>Runoff Vote</th>
                            <th>Runoff Percent</th>
                        </>
                        }
                    </tr>
                </thead>
                <tbody>
                    {recordList()}
                </tbody>
            </table>
            {displayedList.length > 5 &&
            <>
                <hr style={{margin: '20px 0px 0px 10px', width:'50%'}}/>
                <button id='showMore' onClick={(e) => {showMore(e.currentTarget)}}>SHOW MORE</button>
            </>
            }
        </div>
    );
}
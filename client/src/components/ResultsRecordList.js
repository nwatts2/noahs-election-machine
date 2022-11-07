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
                            {(props.page === 'LIVE' || props.page === 'CALLSIM') &&
                                <td className={`${'percentLabel'}`} rowSpan={stateSpecialCandidates.length}>{`${candidate.percentIn}%`}</td>
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
                            {(props.page === 'LIVE' || props.page === 'CALLSIM') &&
                                <td className={`${'percentLabel'}`} rowSpan={stateCandidates.length}>{`${candidate.percentIn}%`}</td>
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
    const [updateAnimation, setUpdateAnimation] = useState(0);
    const [limitStyle, setLimitStyle] = useState({maxHeight: '1000px'});
    const [displayedList, setDisplayedList] = useState([]);
    const [neededStates, setNeededStates] = useState([]);
    const [thisHeight, setThisHeight] = useState([0, 0])

    const stateSelect = useRef(null);

    const stateList = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

    useEffect(() => {
        let elem = document.getElementsByClassName('resultsRecords')[0];

        let endHeight = window.getComputedStyle(elem).height;
        endHeight = Number(endHeight.slice(0, endHeight.length - 2));

        if (endHeight !== thisHeight[1]) {
            setThisHeight([thisHeight[0], endHeight]);
        }

        //window.alert(thisHeight[0] + ' ' + thisHeight[1])

        if (thisHeight[1] !== 0) {
            //elem.style.maxHeight = endHeight + 'px';
        }
        

        //setLimitStyle({maxHeight: Number(startHeight.slice(0, startHeight.length-2)) + 100 + 'px'});
        //setLimitStyle({maxHeight: Number(endHeight.slice(0, endHeight.length-2)) + 100 + 'px'});

    }, [updateAnimation]);

    useEffect(() => {
        if (limit === 1000 && document.getElementById('showMore')) {
            //if (limitStyle.maxHeight === '1500px' && document.getElementById('showMore')) {
                //setLimitStyle({maxHeight: '1000px'});
                showMore(document.getElementById('showMore'));
        }

    }, [currentState, props.year, props.type]);
    
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
        let elem = document.getElementsByClassName('resultsRecords')[0];
        let startHeight = window.getComputedStyle(elem).height;
        startHeight = Number(startHeight.slice(0, startHeight.length - 2));
        
        if (thisHeight[0] !== startHeight) {
            setThisHeight([startHeight, thisHeight[1]]);
        }

        if (thisHeight[0] !== 0) {
            //elem.style.maxHeight = startHeight + 'px';
        }

        if (limit !== 1000) {
        //if (limitStyle.maxHeight !== '1500px') {

            setLimit(1000);

            //setLimitStyle({maxHeight: '10000px'})
            e.innerHTML = 'SHOW LESS';
        } else {
            setLimit(5);

            //setLimitStyle({maxHeight: '1000px'})
            e.innerHTML = 'SHOW MORE';
        }
    }

    function recordList() {
        let thisState = '', thisList = [], needsUpdate = false;
        const printedStates = [];
        const topSenate = ['PA', 'WI', 'NC', 'OH', 'AZ', 'NV', 'GA', 'CO', 'NH', 'FL'];
        const topGovernor = ['PA', 'WI', 'NV', 'AZ', 'KS', 'OR', 'TX'];
        const topHouse = ['AK-1st', 'AZ-2nd', 'CA-22nd', 'CA-27th', 'IA-3rd', 'IL-17th', 'ME-2nd', 'MI-3rd', 'NH-1st', 'NV-1st','NY-19th', 'NY-22nd', 'OR-5th', 'PA-7th', 'PA-17th', 'RI-2nd', 'TX-15th', 'TX-34th', 'VA-2nd', 'VA-7th'];

        let numRecords = 0;

        props.records.map((record) => {
            if (currentState === 'Top Races') {
                if (record.year === props.year && record.type === props.type && thisState !== `${record.state}-${record.district}` && printedStates.includes(`${record.state}-${record.district}`) === false) {
                    thisState = `${record.state}-${record.district}`;
                    printedStates.push(thisState);

                    if (props.type === 'SENATE' && topSenate.includes(record.state)) {
                        thisList.push(record);

                    } else if (props.type === 'GOVERNOR' && topGovernor.includes(record.state)) {
                        thisList.push(record);

                    } else if (props.type === 'HOUSE' && topHouse.includes(thisState)) {
                        thisList.push(record);

                    }
                    
                   
                }
            }
            else if (record.state === currentState && record.year === props.year && record.type === props.type && thisState !== `${record.state}-${record.district}` && printedStates.includes(`${record.state}-${record.district}`) === false) {
                thisState = `${record.state}-${record.district}`;
                printedStates.push(thisState);

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
                        if (numRecords === limit - 1 && updateAnimation !== numRecords) {setUpdateAnimation(numRecords);}
                        return <ResultRecord page={props.page} updateHouseWidget={props.updateHouseWidget} states={neededStates} records={props.records} setRecords={props.setRecords} district={record.district} state={record.state} type={props.type} needRunoff={needRunoff} year={props.year}/>
    
                    }
                   
                }
            }
            else if (record.state === currentState && thisState !== `${record.state}-${record.district}`) {
                if (numRecords < limit) {
                    thisState = `${record.state}-${record.district}`;

                    numRecords += 1;
                    if (numRecords === limit - 1 && updateAnimation !== numRecords) {setUpdateAnimation(numRecords);}

                    return (
                        <ResultRecord page={props.page} updateHouseWidget={props.updateHouseWidget} states={neededStates} records={props.records} setRecords={props.setRecords} district={record.district} state={record.state} type={props.type} needRunoff={needRunoff} year={props.year}/>
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
                        {(props.page === 'LIVE' || props.page === 'CALLSIM') &&
                            <th>% In</th>
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
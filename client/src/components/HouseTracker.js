import { useState, useEffect } from 'react';
import '../css/HouseTracker.css';
import Graph from '../components/Graph';
import { Popover, Whisper } from 'rsuite';
import Popup from '../components/Popup';
import useMousePosition from '../components/useMousePosition';

function HouseButton ({resultsYear, updateHouseWidget, setUpdateHouseWidget, page, resultsRecords, state, district, popupState, enablePopups, mouseposition, raceRecords, setPopupState, topHouse}) {
    const candidates = [], names = [], thisState=`${state}-${district}`;
    const demColor = 'rgba(0, 71, 255, 1)', repColor = 'rgb(253, 3, 83)', indColor = 'green';

    useEffect(() => {
        setHouseFill();

    }, [updateHouseWidget]);

    resultsRecords.map((record) => {
        if (record.type === 'HOUSE' && record.year === resultsYear && record.state === state && record.district === district) {
            if (thisState === 'AK-1st' && resultsYear === 2022) {
                if (record.caucus === 'Democratic' || record.name === 'Sarah Palin') {
                    candidates.push(record);
                }
            } else if (thisState === 'MN-2nd' && resultsYear === 2020) {
                if (record.caucus === 'Republican' || record.name === 'Angie Craig') {
                    candidates.push(record);
                }
            } else {
                candidates.push(record);

            }
        }
    });

    for (let candidate of candidates) {
        let tempArray = candidate.name.split(' ');
        let name = '';

        let i = 1;
        while (i < tempArray.length) {
            name += tempArray[i] + ' ';
            i++;
        }

        candidate.lname = name.toString().trim().toUpperCase();
    }

    let i = 0;
    while (i < candidates.length) {
        let j = 0;
        while (j < candidates.length) {
            if (candidates[i].caucus === 'Republican' && candidates[j].caucus === 'Democratic' && j < i) {
                let tempObj = candidates[j];
                candidates[j] = candidates[i];
                candidates[i] = tempObj;
            }
            j++;
        }
        
        i++;
    }

    function setHouseFill () {
        candidates.map((candidate) => {
            candidate.style = {};
            if (candidate.caucus === 'Democratic') {
                candidate.style.borderColor = demColor;

            } else if (candidate.caucus === 'Republican') {
                candidate.style.borderColor = repColor;
            } else {
                candidate.style.borderColor = indColor;
            }

            if (candidate.called === 'Democratic') {candidate.style.backgroundColor = demColor}
            else if (candidate.called === 'Republican') {candidate.style.backgroundColor = repColor}
        })
    }

    function handleClick(candidate, candidates) {
        if (page === 'CALLSIM') {
            for (let x of candidates) {
                x.called = '';
            }
    
            if (candidate.caucus === 'Democratic') {candidate.called = 'Democratic'}
            else if (candidate.caucus === 'Republican') {candidate.called = 'Republican'}
    
            candidate.manuallyCalled = true;
    
            setUpdateHouseWidget((c) => c + 1);
        }
    }

    function handleMouseEnter(e) {
        setPopupState('');

        for (let state of topHouse) {
            if (state === e.currentTarget.id) {
                setPopupState(e.currentTarget.id);
            }
        }
        
    }

    function handleMouseLeave(e) {
        setPopupState('');
    }

    setHouseFill();

    return (
        <div className='houseButton'>
            <h3>{thisState.slice(0, thisState.length - 2)}</h3>
            {candidates.map((candidate) => {
                return (
                    <>
                    <input type='radio' onClick={() => {handleClick(candidate, candidates)}} id={`radio-${thisState}-${candidate.name}`} name={`radio-${thisState}`} className={`candidate${candidate.caucus}`} defaultChecked={candidate.called !== '' ? 'checked':false}/>
                    <Whisper trigger='hover' speaker={
                        <Popover className={(popupState !== thisState || enablePopups === false) ? 'invisible' : 'visible'}>
                            <Popup resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={'HOUSE'} state={popupState} mouseposition={mouseposition}/>
                        </Popover>
                    }>
                        <label for={`radio-${thisState}-${candidate.name}`} style={candidate.style} id={thisState} onMouseOver={(e) => {handleMouseEnter(e)}} onMouseLeave={(e) => {handleMouseLeave(e)}}>{candidate.lname}</label>
                    </Whisper>
                    </>
                );
                
            })}
        </div>
    );
}

function HouseTracker ({page, resultsRecords, resultsYear, setResultsRecords, raceRecords, houseCount, setHouseCount, updateHouseWidget, setUpdateHouseWidget}) {
    const [graphData, setGraphData] = useState([
        {value: houseCount[0], party: 'DEMS'}, 
        {value: (435 - houseCount[0] - houseCount[1]), party: ''},
        {value: houseCount[1], party: 'GOP'}
    ]);
    const [calledHouseRaces, setCalledHouseRaces] = useState([]);
    const [popupState, setPopupState] = useState('');
    const [enablePopups, setEnablePopups] = useState(true);

    const mouseposition = useMousePosition();

    let topHouse = '';

    if (page === 'LIVE' || page === 'CALLSIM') {
        topHouse = ['AK-1st', 'AZ-2nd', 'CA-22nd', 'CA-27th', 'CO-8th', 'IA-3rd', 'IL-17th', 'KS-3rd', 'MD-6th', 'ME-2nd', 'NC-13th', 'NJ-7th', 'NM-2nd', 'NV-3rd', 'NY-18th', 'NY-19th', 'NY-22nd', 'PA-7th', 'TX-15th', 'VA-2nd'];
    } else if (page === 'PAST') {
        topHouse = ['IA-2nd', 'NY-22nd', 'CA-25th', 'CA-21st', 'UT-4th', 'CA-39th', 'NJ-7th', 'SC-1st', 'TX-24th', 'IL-14th', 'IA-3rd', 'VA-7th', 'CA-48th', 'MN-2nd', 'PA-17th', 'MI-11th', 'IA-1st', 'WI-3rd', 'FL-27th', 'GA-7th'];
    }
    const displayedList = [];

    useEffect(() => {
        if (page === 'CALLSIM' || page === 'LIVE') {
            resetRaces();
        }
    }, []);

    useEffect(() => {
        getHouseCount();
        return;
    }, [updateHouseWidget]);

    useEffect(() => {
        setGraphData([
            {value: houseCount[0], party: 'DEMS'}, 
            {value: (435 - houseCount[0] - houseCount[1]), party: ''},
            {value: houseCount[1], party: 'GOP'}
        ]);
    }, [houseCount]);
    

    function resetRaces() {
        for (let record of resultsRecords) {
            if (record.type === 'HOUSE') {record.called = '';}
        }

        setUpdateHouseWidget((c) => {return c + 1})
        setHouseCount([0,0]);
    }

    function autoCallRaces(rating) {
        for (let record of resultsRecords) {
            if (record.type === 'HOUSE') {
                for (let race of raceRecords) {
                    if (race.type === 'HOUSE') {
                        if (race.year === record.year && race.state === record.state && Number(race.district) === Number(record.district.slice(0, record.district.length - 2))) {
                            record.ratingRank = race.ratingRank;
                            record.margin = race.margin;
                        }
                    }
                }
            }
        }

        for (let record of resultsRecords) {
            if (record.type === 'HOUSE' && record.manuallyCalled && record.year === resultsYear) {
                record.called = '';
                record.manuallyCalled = false;
            }
        }

        const calledRaces = [];
        
        if (calledHouseRaces.length !== 0) {
            for (let race of calledHouseRaces) {
                calledRaces.push(race);
            }
        }

        setUpdateHouseWidget((c) => {return c + 1});
        let houseDems = houseCount[0], houseReps = houseCount[1];

        if (rating === 'ALL' || rating === 'SOLID') {
            houseDems += 1;
            houseReps += 5;
            for (let record of resultsRecords) {
                if (record.called !== '' && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                    calledRaces.push(`${record.state}-${record.district}`);
                } else if (record.called === '' && Math.abs(record.ratingRank) === 3 && record.type === 'HOUSE' && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                    if (record.caucus === 'Democratic' && record.margin > 0 && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                        record.called = 'Democratic';
                        houseDems++;
                        calledRaces.push(`${record.state}-${record.district}`);
                    } else if (record.caucus === 'Republican' && record.margin <= 0 && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                        record.called = 'Republican';
                        houseReps++;
                        calledRaces.push(`${record.state}-${record.district}`);
                    } else if (record.caucus === 'Republican' && record.margin > 0) {
                        record.called = '';
                    } else if (record.caucus === 'Democratic' && record.margin <= 0) {
                        record.called = '';
                    }
                }
            }
        }

        if (rating === 'ALL' || rating === 'LIKELY') {
            for (let record of resultsRecords) {
                if (record.called !== '' && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                    calledRaces.push(`${record.state}-${record.district}`);
                } else if (record.called === '' && Math.abs(record.ratingRank) === 2 && record.type === 'HOUSE' && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                    if (record.caucus === 'Democratic' && record.margin > 0 && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                        record.called = 'Democratic';
                        houseDems++;
                        calledRaces.push(`${record.state}-${record.district}`);
                    } else if (record.caucus === 'Republican' && record.margin <= 0 && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                        record.called = 'Republican';
                        houseReps++;
                        calledRaces.push(`${record.state}-${record.district}`);
                    } else if (record.caucus === 'Republican' && record.margin > 0) {
                        record.called = '';
                    } else if (record.caucus === 'Democratic' && record.margin <= 0) {
                        record.called = '';
                    }
                }      
            }
        }

        if (rating === 'ALL' || rating === 'LEAN') {
            for (let record of resultsRecords) {
                if (record.called !== '' && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                    calledRaces.push(`${record.state}-${record.district}`);
                } else if (record.called === '' && Math.abs(record.ratingRank) === 1 && record.type === 'HOUSE' && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                    if (record.caucus === 'Democratic' && record.margin > 0 && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                        record.called = 'Democratic';
                        houseDems++;
                        calledRaces.push(`${record.state}-${record.district}`);
                    } else if (record.caucus === 'Republican' && record.margin <= 0 && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                        record.called = 'Republican';
                        houseReps++;
                        calledRaces.push(`${record.state}-${record.district}`);
                    } else if (record.caucus === 'Republican' && record.margin > 0) {
                        record.called = '';
                    } else if (record.caucus === 'Democratic' && record.margin <= 0) {
                        record.called = '';
                    }
                }          
            }
        }

        if (rating === 'ALL' || rating === 'TILT') {
            for (let record of resultsRecords) {
                if (record.called !== '' && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                    calledRaces.push(`${record.state}-${record.district}`);
                } else if (record.called === '' && Math.abs(record.ratingRank) === 0 && record.type === 'HOUSE' && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                    if (record.caucus === 'Democratic' && record.margin > 0 && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                        record.called = 'Democratic';
                        houseDems++;
                        calledRaces.push(`${record.state}-${record.district}`);
                    } else if (record.caucus === 'Republican' && record.margin <= 0 && calledRaces.includes(`${record.state}-${record.district}`) === false) {
                        record.called = 'Republican';
                        houseReps++;
                        calledRaces.push(`${record.state}-${record.district}`);
                    } else if (record.caucus === 'Republican' && record.margin > 0) {
                        record.called = '';
                    } else if (record.caucus === 'Democratic' && record.margin <= 0) {
                        record.called = '';
                    }

                    /*if () {
                        calledRaces.push(`${record.state}-${record.district}`);
                    }*/
                }          
            }
        }

        //setHouseCount([houseDems, houseReps]);

        let text = '', totaldistricts = 0, called=[];
        for (let state of calledRaces) {
            text += state.slice(0, 2) + '-';
            let numDistricts = 0;
            for (let district of calledRaces) {
                if (state.slice(0, 2) === district.slice(0, 2)) {
                    numDistricts += 1;
                }
            }
            if (called.includes(state.slice(0,2)) === false) {totaldistricts += numDistricts;}
            called.push(state.slice(0, 2));

            text += numDistricts + '\n';
        }
        //window.alert(totaldistricts);
        //window.alert(calledRaces.length);

        //if (calledHouseRaces.length !== calledRaces.length) {setCalledHouseRaces(calledRaces);}
    }

    function enablePops(e) {
        if (enablePopups) {
            setEnablePopups(false);
            e.currentTarget.innerHTML = 'ENABLE POPUPS';
        }
        else {
            setEnablePopups(true);
            e.currentTarget.innerHTML = 'DISABLE POPUPS';
        }
    }

    function getHouseCount() {
        let houseDem = 0, houseRep = 0;
        if (page === 'CALLSIM' || page === 'LIVE') {houseDem = 1; houseRep = 5;}


        for (let record of resultsRecords) {
            if (record.called !== '' && record.year === resultsYear) {
                if (record.type === 'HOUSE') {
                    if (record.called === 'Democratic') {
                        houseDem += 1;
                    } else if (record.called === 'Republican') {
                        houseRep += 1;
                    }
                }
            }
        }

        setHouseCount([houseDem, houseRep]);
    }

    return (
        <>
            {page === 'CALLSIM' &&
                <div className='mapButtons'>
                    <button onClick={() => {autoCallRaces('ALL')}}>CALL ALL RACES</button>
                    <button onClick={() => {autoCallRaces('SOLID')}}>CALL SOLID</button>
                    <button onClick={() => {autoCallRaces('LIKELY')}}>CALL LIKELY</button>
                    <button onClick={() => {autoCallRaces('LEAN')}}>CALL LEAN</button>
                    <button onClick={() => {autoCallRaces('TILT')}}>CALL TILT</button>

                    <button onClick={resetRaces}>RESET RACES</button>
                    <button onClick={(e) => {enablePops(e)}}>DISABLE POPUPS</button>
                </div>
            }
            <div className='houseTracker'>
                <div className='graphSection'>
                    <h2>SEAT BREAKDOWN</h2>
                    <div className='row'>
                        <h3 style={{textAlign: 'center'}}>GOP: {houseCount[1]}</h3>
                        <h3 style={{textAlign: 'center'}}>DEM: {houseCount[0]}</h3>
                    </div>
                    <Graph data={graphData} />
                </div>
                <div className='infoSection'>
                    <h2>CRITICAL HOUSE RACES</h2>
                    {(page === 'LIVE' || page === 'CALLSIM') &&
                        <span>These essential races will give us a good idea of who will control the house this cycle.</span>
                    }
                    <div className='houseButtonSection'>
                        {resultsRecords.map((record) => {
                            const thisState = `${record.state}-${record.district}`
                            if (topHouse.includes(thisState) && displayedList.includes(thisState) === false) {
                                displayedList.push(thisState)
                                return (<HouseButton 
                                    mouseposition={mouseposition} popupState={popupState} enablePopups={enablePopups} 
                                    raceRecords={raceRecords}resultsYear={resultsYear} updateHouseWidget={updateHouseWidget} 
                                    setUpdateHouseWidget={setUpdateHouseWidget} page={page} resultsRecords={resultsRecords} 
                                    state={record.state} district={record.district} setPopupState={setPopupState} topHouse={topHouse}/>)
                            }
                        })}
                    </div>
                </div>

            </div>
        </>
    );
}

export default HouseTracker;
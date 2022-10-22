import React, { useEffect, useState, useRef } from 'react';
import SenateTracker from '../components/SenateTracker';
import HouseTracker from '../components/HouseTracker';
import ResultsRecordList from '../components/ResultsRecordList';
import MyMap from '../components/MyMap';
import '../css/index.css';

const CallSimulator = () => {
    const [records, setRecords] = useState([]);
    const [raceRecords, setRaceRecords] = useState([]);
    const [resultsRecords, setResultsRecords] = useState([]);
    const [simulatedResults, setSimulatedResults] = useState([])
    const [senateCount, setSenateCount] = useState([36, 29]);
    const [govCount, setGovCount] = useState([6, 8]);
    const [houseCount, setHouseCount] = useState([1, 5]);
    const [mode, setMode] = useState('SENATE');
    const [resultsYear, setResultsYear] = useState(2022);

    const [updateHouseWidget, setUpdateHouseWidget] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const page = 'CALLSIM';

    useEffect(() => {
        async function getRecords() {
            if (isLoading === false) {setIsLoading(true)}
            const candidatesResponse = await fetch(`http://localhost:3001/candidatesRecord/`);

            if (!candidatesResponse.ok) {
                const message = `An error occurred: ${candidatesResponse.statusText}`;
                window.alert(message);
                return;
            } else {
                setIsLoading(false);
            }

            const candidatesList = await candidatesResponse.json(), records = [];

            for (let x of candidatesList) {
                if (x.type === 'SENATE') {
                    records.push(x)
                }
            }
            
            setRecords(rankSort(records));

        }

        async function getResults() {
            if (isLoading === false) {setIsLoading(true)}
            const resultsResponse = await fetch(`http://localhost:3001/resultsRecord/`);

            if (!resultsResponse.ok) {
                const message = `An error occurred: ${resultsResponse.statusText}`;
                window.alert(message);
                return;
            } else {
                setIsLoading(false);
            }

            const resultsList = await resultsResponse.json(), resultsRecords = [];

            for (let x of resultsList) {
                if (x.type === 'GOVERNOR' || x.type === 'SENATE' || x.type === 'HOUSE') {
                    resultsRecords.push(x);
                }
            }
            
            setResultsRecords(resultsRecords);

            if (simulatedResults.length !== resultsRecords) {
                setSimulatedResults(resultsRecords);
            }

        }

        async function getRaces() {
            if (isLoading === false) {setIsLoading(true)}
            const racesResponse = await fetch(`http://localhost:3001/racesRecord/`);

            if (!racesResponse.ok) {
                const message = `An error occurred: ${racesResponse.statusText}`;
                window.alert(message);
                return;
            } else {
                setIsLoading(false);
            }

            const racesList = await racesResponse.json(), raceRecords = [];

            for (let x of racesList) {
                if (/*(x.type === 'GOVERNOR' || x.type === 'SENATE') &&*/ x.year === resultsYear) {
                    raceRecords.push(x);
                }
            }
            
            setRaceRecords(raceRecords);

        }

        function getCounts() {
            let houseDem = 0, houseRep = 0, senateDem = 0, senateRep = 0, govDem = 0, govRep = 0;

            for (let record of simulatedResults) {
                if (record.called !== '' && record.year === resultsYear) {
                    if (record.type === 'SENATE') {
                        if (record.called === 'Democratic') {
                            senateDem += 1;
                        } else if (record.called === 'Republican') {
                            senateRep += 1;
                        }
                    } else if (record.type === 'HOUSE') {
                        if (record.called === 'Democratic') {
                            houseDem += 1;
                        } else if (record.called === 'Republican') {
                            houseRep += 1;
                        }
                    } else if (record.type === 'GOVERNOR') {
                        if (record.called === 'Democratic') {
                            govDem += 1;
                        } else if (record.called === 'Republican') {
                            govRep += 1;
                        }
                    }
                }
            }

            setHouseCount([houseDem, houseRep]);
            setSenateCount([senateDem + 36, senateRep + 29]);
            setGovCount([govDem + 6, govRep + 8]);
        }

        getRecords();
        getResults();
        getRaces();
        getCounts();

        return;

    }, [mode]);

    function rankSort(array) {
        const length = array.length;
      
        for (let i = 0; i < length; i++) {
          for (let j = 0; j < length; j++) {
            if (array[i].ratingRank > array[j].ratingRank) {
              const temp = array[i];
              array[i] = array[j];
              array[j] = temp;
            } else if (array[i].ratingRank === array[j].ratingRank) {
              if (array[i].state < array[j].state) {
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
              }
            }
          }
        }
      
        return array;
    }

    return (
        <div className="mainPage">
            <h1>NOAH'S CALL SIMULATOR</h1>
            <p>&emsp;Welcome to the Call Simulator! Here you can play around with different scenarios for the 2022 US midterm elections. Click on a state to call that race, or click it again to switch parties.
                The call buttons below will automatically call a race based on its FiveThirtyEight rating.
            </p>
            <div className='typeInfo'>
                <div className="senateTitleBG">
                    <div className="senateTitle">
                        <h3>GOP - <span id="repSeats">{mode === 'SENATE' ? senateCount[1] : mode === 'HOUSE' ? houseCount[1] : govCount[1] }</span></h3>
                        <h2>{mode} ELECTION TRACKER</h2>
                        <h3>DEMS - <span id="demSeats">{mode === 'SENATE' ? senateCount[0] : mode === 'HOUSE' ? houseCount[0] : govCount[0]}</span></h3>
                    </div>
                </div>
            </div>
            <div className='modeButtons'>
                <button onClick={() => {setMode('SENATE');}}>SENATE</button>
                <button onClick={() => {setMode('HOUSE')}}>HOUSE</button>
                <button onClick={() => {setMode('GOVERNOR')}}>GOVERNORS</button>
            </div>
            {mode === 'HOUSE' &&
                <HouseTracker resultsYear={resultsYear} updateHouseWidget={updateHouseWidget} setUpdateHouseWidget={setUpdateHouseWidget} page={page} resultsRecords={simulatedResults} setResultsRecords={setSimulatedResults} raceRecords={raceRecords} houseCount={houseCount} setHouseCount={setHouseCount}/>
            }
            {mode !== 'HOUSE' &&
                <MyMap page={page} isLoading={isLoading} resultsYear={resultsYear} raceRecords={raceRecords} resultsRecords={simulatedResults} setSenateCount={setSenateCount} setGovCount={setGovCount} mode={mode} setMode={setMode}/>
            }
            {mode !== 'HOUSE' &&
            <hr />
            }
            {//<SenateTracker records={records} className={'senateTrackerFull'}/>}
}
            <ResultsRecordList updateHouseWidget={updateHouseWidget} page={page} year={resultsYear} records={simulatedResults} setRecords={setSimulatedResults} raceRecords={raceRecords} type={mode}/>
        </div>
    );
}

export default CallSimulator;
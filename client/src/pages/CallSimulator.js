import React, { useEffect, useState, useRef } from 'react';
import CollapseText from '../components/CollapseText';
import HouseTracker from '../components/HouseTracker';
import ResultsRecordList from '../components/ResultsRecordList';
import MyMap from '../components/MyMap';

const CallSimulator = () => {
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
        async function getResults() {
            if (isLoading === false) {setIsLoading(true)}
            const resultsResponse = await fetch(`/resultsRecord/`);

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
            const racesResponse = await fetch(`/racesRecord/`);

            if (!racesResponse.ok) {
                const message = `An error occurred: ${racesResponse.statusText}`;
                window.alert(message);
                return;
            } else {
                setIsLoading(false);
            }

            const racesList = await racesResponse.json(), raceRecords = [];

            for (let x of racesList) {
                if (x.year === resultsYear) {
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

        getResults();
        getRaces();
        getCounts();

        return;

    }, [mode]);

    return (
        <div className="mainPage">
            <h1>NOAH'S CALL SIMULATOR</h1>
            <CollapseText text={"Welcome to the Call Simulator! Here you can play around with different scenarios for the 2022 US midterm elections. Click on a state to call that race, or click it again to switch parties. " +
                "The call buttons below will automatically call a race based on its FiveThirtyEight rating."}/>
            <div className='typeInfo'>
                <div className="senateTitleBG">
                    <div className="senateTitle">
                        <h2>{mode} ELECTION TRACKER</h2>
                    </div>
                </div>
            </div>
            <div className='modeButtons'>
                <button onClick={() => {setMode('SENATE');}}>SENATE</button>
                <button onClick={() => {setMode('HOUSE')}}>HOUSE</button>
                <button onClick={() => {setMode('GOVERNOR')}}>GOVERNORS</button>
            </div>
            {mode === 'HOUSE' &&
                <HouseTracker mode={mode} resultsYear={resultsYear} updateHouseWidget={updateHouseWidget} setUpdateHouseWidget={setUpdateHouseWidget} page={page} resultsRecords={simulatedResults} setResultsRecords={setSimulatedResults} raceRecords={raceRecords} houseCount={houseCount} setHouseCount={setHouseCount}/>
            }
            {mode !== 'HOUSE' &&
                <MyMap page={page} isLoading={isLoading} resultsYear={resultsYear} raceRecords={raceRecords} resultsRecords={simulatedResults} senateCount={senateCount} setSenateCount={setSenateCount} govCount={govCount} setGovCount={setGovCount} mode={mode} setMode={setMode}/>
            }
            {mode !== 'HOUSE' &&
            <hr />
            }
            <ResultsRecordList updateHouseWidget={updateHouseWidget} page={page} year={resultsYear} records={simulatedResults} setRecords={setSimulatedResults} raceRecords={raceRecords} type={mode}/>
        </div>
    );
}

export default CallSimulator;
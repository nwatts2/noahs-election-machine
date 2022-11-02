import React, { useEffect, useState } from 'react';
import CollapseText from '../components/CollapseText';
import HouseTracker from '../components/HouseTracker';
import ResultsRecordList from '../components/ResultsRecordList';
import MyMap from '../components/MyMap';
import GoogleAds from '../components/GoogleAds';

const PastResults = () => {
    const [raceRecords, setRaceRecords] = useState([]);
    const [resultsRecords, setResultsRecords] = useState([]);
    const [senateCount, setSenateCount] = useState([0, 0]);
    const [govCount, setGovCount] = useState([0, 0]);
    const [houseCount, setHouseCount] = useState([0, 0]);
    const [president, setPresident] = useState([0, 0]);
    const [mode, setMode] = useState('SENATE');
    const [resultsYear, setResultsYear] = useState(2020);

    const [seatHistory, setSeatHistory] = useState({});

    const [updateHouseWidget, setUpdateHouseWidget] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const page = 'PAST';

    const govYears = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
    const senateYears = [2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016, 2018, 2020];
    const houseYears = [2020];

    const stateList = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

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
                if (x._id === 'seatHeldHistory') {
                    if (!seatHistory['2020']) {
                        setSeatHistory(x);
                    }
                } else {
                    resultsRecords.push(x);
                } 
            }

            setResultsRecords(resultsRecords);

            updateCount();
        }

        async function convertRacesToResults () {
            const races = [];
            for (let thisState of stateList) {
                let candidate = {}, altCandidate = {}, called, ratingRank, candidates = [];
    
                for (let x of resultsRecords) {
                    if (x.type === mode && x.state.includes(thisState)) {
                        candidates.push(x)
                    }
                }

                let i = 1;
                while (i < candidates.length) {
                    if (Number(candidates[i].percent.slice(0, candidates[i].length - 1)) > Number(candidates[i - 1].percent.slice(0, candidates[i].length - 1))) {
                        let tempObj = candidates[i];
                        candidates[i] = candidates[i - 1];
                        candidates[i - 1] = tempObj;
                    }
                    
                    i++;
                }
                
                if (candidates.length >= 2) {
                    candidate = candidates[0];
                    altCandidate = candidates[1];
                }

                if (candidate !== {} && altCandidate !== {} && candidate.percent && altCandidate.percent) {
                    if (Math.abs(Number(candidate.percent.slice(0, candidate.percent.length - 1)) - Number(altCandidate.percent.slice(0, altCandidate.percent.length - 1))) > 15) {
                        if (candidate.caucus === 'Democratic') {ratingRank = 3; called = 'Democratic'}
                        else {ratingRank = -3; called = 'Republican'}
                    } else if (Math.abs(Number(candidate.percent.slice(0, candidate.percent.length - 1)) - Number(altCandidate.percent.slice(0, altCandidate.percent.length - 1))) > 5) {
                        if (candidate.caucus === 'Democratic') {ratingRank = 2; called = 'Democratic'}
                        else {ratingRank = -2; called='Republican'}
                    } else if (Math.abs(Number(candidate.percent.slice(0, candidate.percent.length - 1)) - Number(altCandidate.percent.slice(0, altCandidate.percent.length - 1))) > 1) {
                        if (candidate.caucus === 'Democratic') {ratingRank = 1; called = 'Democratic'}
                        else {ratingRank = -1; called = 'Republican'}
                    } else if (Math.abs(Number(candidate.percent.slice(0, candidate.percent.length - 1)) - Number(altCandidate.percent.slice(0, altCandidate.percent.length - 1))) > 0) {
                        if (candidate.caucus === 'Democratic') {ratingRank = 0; called = 'Democratic'}
                        else {ratingRank = 0; called = 'Republican'}
                    } 
                }

                let currentRace = {state: candidate.state, called: called, hasElection: true, ratingRank: ratingRank};
    
                if (currentRace.state) {
                    races.push(currentRace);
                }
    
            }

            setRaceRecords(races);

            return;

        }

        function updateCount () {    
            let demCount = 0, repCount = 0;

            setPresident(seatHistory[`${resultsYear}`][3]);

            if (mode === 'SENATE') {
                demCount = seatHistory[`${resultsYear}`][0][0];
                repCount = seatHistory[`${resultsYear}`][0][1];

                setSenateCount([demCount, repCount]);

            } else if (mode === 'HOUSE') {
                demCount = seatHistory[`${resultsYear}`][1][0];
                repCount = seatHistory[`${resultsYear}`][1][1];

                setHouseCount([demCount, repCount]);

            } else if (mode === 'GOVERNOR') {
                demCount = seatHistory[`${resultsYear}`][2][0];
                repCount = seatHistory[`${resultsYear}`][2][1];

                setGovCount([demCount, repCount]);

            }
        }

        if (mode === 'HOUSE' && resultsYear !== 2020) {
            setResultsYear(2020);
        }

        getResults();
        convertRacesToResults();   

        return;

    }, [mode, resultsYear, seatHistory]);

    return (
        <div className="mainPage">
            <GoogleAds />
            <h1>PAST ELECTIONS</h1>
            <CollapseText 
                text={"Here you can view results from past November elections for the US Senate, House of Representatives, and governorships."}
                subtext={"You can currently view senate and gubernatorial results dating back to the year 2000, but more data will " +
                    "become available in the future, as will for the house."}/>
            <div className='typeInfo'>
                <div className="senateTitleBG">
                    <div className="senateTitle">
                        <h2>{resultsYear} {mode} ELECTIONS</h2>
                    </div>
                </div>
            </div>
            <div className='modeButtons'>
                <button onClick={() => {setMode('SENATE')}}>SENATE</button>
                <button onClick={() => {setMode('HOUSE')}}>HOUSE</button>
                <button onClick={() => {setMode('GOVERNOR')}}>GOVERNORS</button>
            </div>
            <div className='yearSelector'>
                <span>Showing results for the</span>
                <select onChange={(e) => {setResultsYear(Number(e.currentTarget.value))}}>
                    { mode === 'SENATE' &&
                        senateYears.map((thisYear) => {
                            if (thisYear === resultsYear) {
                                return (<option selected='selected'>{thisYear}</option>);
                            }
                            return (<option>{thisYear}</option>);
                        })

                    } { mode === 'GOVERNOR' &&
                        govYears.map((thisYear) => {
                            if (thisYear === resultsYear) {
                                return (<option selected='selected'>{thisYear}</option>);
                            }
                            return (<option>{thisYear}</option>);
                        })
                    } { mode === 'HOUSE' &&
                        houseYears.map((thisYear) => {
                            if (thisYear === resultsYear) {
                                return (<option selected='selected'>{thisYear}</option>);
                            }
                            return (<option>{thisYear}</option>);
                        })
                    }
                </select>
                <span>election cycle</span>
            </div>

            {mode !== 'HOUSE' &&
                <MyMap page={page} president={president} resultsYear={resultsYear} raceRecords={raceRecords} resultsRecords={resultsRecords} senateCount={senateCount} setSenateCount={setSenateCount} govCount={govCount} setGovCount={setGovCount} mode={mode} />
            }
            {mode !== 'HOUSE' &&
            <hr />
            }
            {mode === 'HOUSE' &&
                <HouseTracker page={page} resultsYear={resultsYear} updateHouseWidget={updateHouseWidget} setUpdateHouseWidget={setUpdateHouseWidget} resultsRecords={resultsRecords} raceRecords={raceRecords} houseCount={houseCount} setHouseCount={setHouseCount}/>
            }
            <ResultsRecordList page={page} year={resultsYear} records={resultsRecords} setRecords={setResultsRecords} type={mode}/>
            <GoogleAds />
        </div>
    );
}

export default PastResults;
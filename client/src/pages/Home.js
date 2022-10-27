import React, { useEffect, useState } from 'react';
import CollapseText from '../components/CollapseText';
import HouseTracker from '../components/HouseTracker';
import ResultsRecordList from '../components/ResultsRecordList';
import MyMap from '../components/MyMap';

const Home = () => {
    const [raceRecords, setRaceRecords] = useState([]);
    const [resultsRecords, setResultsRecords] = useState([]);
    const [senateCount, setSenateCount] = useState([36, 29]);
    const [govCount, setGovCount] = useState([6, 8]);
    const [houseCount, setHouseCount] = useState([0, 0]);
    const [mode, setMode] = useState('SENATE');
    const [resultsYear, setResultsYear] = useState(2022);

    const [updateHouseWidget, setUpdateHouseWidget] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const page = 'LIVE';

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

            const resultsList = await resultsResponse.json(), tempResultsRecords = [];

            for (let x of resultsList) {
                if ((x.type === 'GOVERNOR' || x.type === 'SENATE' || x.type === 'HOUSE') && (x.year === resultsYear)) {
                    tempResultsRecords.push(x);
                }
            }
            
            if (JSON.stringify(resultsRecords) !== JSON.stringify(tempResultsRecords)) {setResultsRecords(tempResultsRecords);}

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

            for (let record of resultsRecords) {
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
            <h1>THE 2022 US MIDTERM ELECTIONS</h1>
            <CollapseText 
                text={`Welcome to Noah's Election Machine! Here you can view live election results for every U.S. Senate, House of Representatives, and Governor ` +
                    "election for the 2022 midterms. Check back on November 8th to view results for every election all in one place!"}
                subtext = { "You can " +
                    "also check out our Call Simulator to see how each race impacts control of the Senate, House, and Governorships, or you can " +
                    "visit our Past Results page to view previous election results for every state."} />
            
            <div className='typeInfo'>
                <div className="senateTitleBG">
                    <div className="senateTitle">
                        <h2>{mode} ELECTION TRACKER</h2>
                    </div>
                </div>
                <CollapseText 
                    text={mode === 'SENATE' ? "The U.S. senate elections are shaping up to be an interesting deviation from the typical " +
                        "midterm year. Since Democrats control the White House, Republicans would " +
                        "normally be expected to reclaim the senate. However, the Democrats have a shot at retaining control, despite the pendulum starting to swing back in favor of Republicans " +
                        "over the last couple weeks. Republicans' chances have been suppressed largely due to the selection of weak GOP candidates across several key swing states. " : 

                    (mode === 'GOVERNOR' ? "The race for control of the most governorships looks to be following a similar path to the senate elections. " +
                        "Candidate quality is what seems to matter most here, moreso than the national environment." : 

                        "The 2022 U.S. House of Representatives elections are much more in line with what we would expect for a midterm year " +
                        "when compared to the senate and governorships. Republicans are favored to take back the house this November, primarily due to " +
                        "the national environment, along with recent redistricting wins in key states.")}
                    
                    subtext={mode === 'SENATE' ? "As it stands, the GOP's keys to the senate will be through Nevada and Georgia, " +
                        "assuming the Democrats are able to pick up a seat in Pennsylvania, which they are favored to do at time of writing." : 
                    
                    (mode === 'GOVERNOR' ? "Republicans are favored to hold the " +
                        "most governorships, as is normally the case, but if things go well for the Democrats, we could possibly see a " +
                        "25-25 split between the two parties, though this would be quite unlikely. This will ultimately come down to the most competitive races in Wisconsin, " +
                        "Oregon, Arizona, and Nevada." :

                        "Still, this is not set in stone, and there are plenty of tight races that Democrats have a shot at winning in states like " +
                        "New York, Arizona, and California, although a Democratic house is seeming more unlikely as we get closer to election day." )}
                />
            </div>
            <div className='modeButtons'>
                <button onClick={() => {setMode('SENATE');}}>SENATE</button>
                <button onClick={() => {setMode('HOUSE')}}>HOUSE</button>
                <button onClick={() => {setMode('GOVERNOR')}}>GOVERNORS</button>
            </div>
            {mode === 'HOUSE' &&
                <HouseTracker page={page} resultsYear={resultsYear} updateHouseWidget={updateHouseWidget} setUpdateHouseWidget={setUpdateHouseWidget} resultsRecords={resultsRecords} raceRecords={raceRecords} houseCount={houseCount} setHouseCount={setHouseCount}/>
            }
            {mode !== 'HOUSE' &&
                <MyMap page={page} isLoading={isLoading} resultsYear={resultsYear} raceRecords={raceRecords} resultsRecords={resultsRecords} senateCount={senateCount} setSenateCount={setSenateCount} govCount={govCount} setGovCount={setGovCount} mode={mode} setMode={setMode}/>
            }
            {mode !== 'HOUSE' &&
            <hr />
            }
            <ResultsRecordList page={page} year={resultsYear} records={resultsRecords} setRecords={setResultsRecords} raceRecords={raceRecords} type={mode}/>
        </div>
    );
}

export default Home;
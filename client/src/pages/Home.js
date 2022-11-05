import React, { useEffect, useState } from 'react';
import CollapseText from '../components/CollapseText';
import HouseTracker from '../components/HouseTracker';
import ResultsRecordList from '../components/ResultsRecordList';
import MyMap from '../components/MyMap';
import LastRefresh from '../components/LastRefresh';
import ControlBanner from '../components/ControlBanner';
import GoogleAds from '../components/GoogleAds';

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
    const [refreshCount, setRefreshCount] = useState(0);

    const page = 'LIVE';

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();

            if ((date.getSeconds() >= 30 && date.getSeconds() < 40) || (date.getSeconds() < 10)) {
                setRefreshCount((c) => c + 1);
            }
        }, 10000);

        return () => {clearInterval(interval)};
    }, [])

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

    }, [mode, refreshCount]);

    return (
        <div className="mainPage">
            <h1>THE 2022 US MIDTERM ELECTIONS</h1>
            <CollapseText 
                text={`Welcome to Noah's Election Machine! Here you can view live election results for every U.S. Senate, House of Representatives, and gubernatorial ` +
                    "election for the 2022 midterms. Check back on November 8th to view results for every election all in one place!"}
                subtext = { "You can " +
                    "also check out our Call Simulator to see how each race impacts control of the senate, house, and governorships, or you can " +
                    "visit our Past Results page to view previous election results for every state."} />

            <div className='typeInfo'>
                <div className="senateTitleBG">
                    <div className="senateTitle">
                        <h2>{mode} ELECTION TRACKER</h2>
                    </div>
                </div>
                <CollapseText 
                    text={mode === 'SENATE' ? "The U.S. senate elections are shaping up to be extremely competitive this midterm season. " +
                        "Since Democrats control the White House, Republicans would " +
                        "normally be expected to reclaim the senate without much trouble. However, the Democrats have a reasonable shot at retaining control, despite the pendulum swinging back in favor of Republicans " +
                        "over the last several weeks. Republicans' chances have been suppressed largely due to the selection of weak GOP candidates across key swing states. " : 

                    (mode === 'GOVERNOR' ? "The sprint for control of the nation's governorships looks to be taking a similar path to the senate elections. " +
                        "Candidate quality is what seems to matter most here, moreso than the overall national environment." : 

                        "This year's elections for the U.S. House of Representatives are much more in line with what we would expect for a midterm year. " +
                        "Republicans are favored to take back the house this November, primarily due to " +
                        "a favorable national environment, along with recent redistricting wins in key states.")}
                    
                    subtext={mode === 'SENATE' ? "The three narrowest states are expected to be Pennsylvania, Georgia, and Nevada, and whichever party wins at least two will very likely control the chamber. " + 
                        "Early voting data and higher-than-average youth turnout are promising signs for Democrats, but current polling has been more beneficial for the Republican party. As it stands, the senate is a coin flip." :
                    
                    (mode === 'GOVERNOR' ? "Republicans are favored to hold the " +
                        "most governorships, as is normally the case, but if things go well for the Democrats, we could possibly see a " +
                        "25-25 split between the two parties, though this appears to be increasingly unlikely as the election draws closer. This will ultimately come down to the most competitive races in Wisconsin, " +
                        "Oregon, Arizona, and Nevada." :

                        "Still, this is not set in stone, and there are plenty of tight races that Democrats have a chance at winning in states like " +
                        "New York, Arizona, and California. However, the possibility of a house majority is falling further and further away from the Democrats as we near election day." )}
                />
            </div>
            <ControlBanner mode={mode} count={mode === 'SENATE' ? senateCount : (mode === 'HOUSE' ? houseCount : govCount)} />
            <div className='modeButtons'>
                <button onClick={() => {setMode('SENATE');}}>SENATE</button>
                <button onClick={() => {setMode('HOUSE')}}>HOUSE</button>
                <button onClick={() => {setMode('GOVERNOR')}}>GOVERNORS</button>
            </div>
            {mode === 'HOUSE' &&
                <HouseTracker page={page} resultsYear={resultsYear} updateHouseWidget={updateHouseWidget} setUpdateHouseWidget={setUpdateHouseWidget} resultsRecords={resultsRecords} raceRecords={raceRecords} houseCount={houseCount} setHouseCount={setHouseCount}/>
            }
            {mode !== 'HOUSE' &&
                <MyMap page={page} resultsYear={resultsYear} setResultsYear={setResultsYear} raceRecords={raceRecords} resultsRecords={resultsRecords} senateCount={senateCount} setSenateCount={setSenateCount} govCount={govCount} setGovCount={setGovCount} mode={mode} />
            }
            <LastRefresh refreshCount={refreshCount} setRefreshCount={setRefreshCount} />
            {mode !== 'HOUSE' &&
            <hr />
            }
            <ResultsRecordList page={page} year={resultsYear} records={resultsRecords} setRecords={setResultsRecords} raceRecords={raceRecords} type={mode}/>
        </div>
    );
}

export default Home;
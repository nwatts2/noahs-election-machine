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
    }, []);

    useEffect(() => {
        getCounts();

    }, [JSON.stringify(resultsRecords), JSON.stringify(senateCount), JSON.stringify(govCount)]);

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

        getResults();
        getRaces();
        getCounts();

        return;

    }, [mode, refreshCount]);

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

    return (
        <div className="mainPage">
            <h1>THE 2022 US MIDTERM ELECTIONS</h1>
            <CollapseText 
                text={`Welcome to Noah's Election Machine! Here you can view live election results for every U.S. Senate, House of Representatives, and gubernatorial ` +
                    "election for the 2022 midterms. The midterms have passed, but check back on December 6th to view results for the Georgia runoff Senate election!"}
                subtext = { "You can " +
                    "also check out our Call Simulator to see how each race impacted control of the Senate, House, and governorships, or you can " +
                    "visit our Past Results page to view previous election results for every state."} />

            <div className='typeInfo'>
                <div className="senateTitleBG">
                    <div className="senateTitle">
                        <h2>{mode} ELECTION TRACKER</h2>
                    </div>
                </div>
                <CollapseText 
                    text={mode === 'SENATE' ? "The U.S. Senate elections ended up being extremely competitive this midterm season. " +
                        "Since Democrats control the White House, Republicans normally " +
                        "would have been expected to reclaim the Senate without much trouble. However, the Democrats ultimately outperformed the expectations of most analysts and held on, despite the flood of favorable polling for the Republicans in the last month of the campaign season. " +
                        "Republicans' chances of victory were suppressed largely due to the selection of weak GOP candidates across key swing states. " : 

                    (mode === 'GOVERNOR' ? "The sprint for control of the nation's governorships took a similar path to the Senate elections this year. " +
                        "Candidate quality is what mattered most here, moreso than the overall national environment." : 

                        "This year's elections for the U.S. House of Representatives were expected to be much more favorable for the Republican party, and although they still took back the House, the margin of victory was not impressive. " +
                        "The Democrats overperformed in most of the nation, with exceptions in states such as Florida and New York. These states seem to be the only places where the red wave ended up manifesting itself, " +
                        "quite possibly saving the Republicans and giving them just enough seats to flip the House.")}
                    
                    subtext={mode === 'SENATE' ? "Pennsylvania, Nevada, and Georgia were the three most impactful races going into election night, and the GOP would have needed to win at least two of them to take back the Senate. But, " + 
                        "the Democrats were blessed with strong early voting performace and higher-than-average youth turnout, which led them to victory in all three states. And so, the Democratic Party is officially projected to win the U.S. Senate." :
                    
                    (mode === 'GOVERNOR' ? "Democrats held on to four of the five most competitive gubernatorial elections, which brings the total to 24-26, with Republicans just barely holding a majority of the governor's mansions. " +
                        "This outcome is owed to Democratic overperformance in Wisconsin and Arizona, especially, where Tony Evers and Katie Hobbs won their races. However, despite these wins for the Democrats, the Republican party is officially projected to win the majority of the nation's governorships. " :

                        "It appears the Dobbs decision and the redistricting process had a great impact on this year's House elections, potentially causing the massive upsets we saw in WA-03, PA-08, and CO-08. However, despite " +
                        "their performance, it still wasn't enough for the Democrats to hold onto the House. The Republican Party is officially projected to win the U.S. House of Representatives." )}
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
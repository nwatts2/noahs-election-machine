import { useState, useEffect, useRef } from 'react';
import { Popover, Whisper } from 'rsuite';
import Popup from '../components/Popup';
import useMousePosition from '../hooks/useMousePosition';
import '../css/Map.css';

function MyMap ({resultsYear, page, president, raceRecords, resultsRecords, senateCount, setSenateCount, govCount, setGovCount, mode}) {
    const [states, setStates] = useState([]);
    const [specialStates, setSpecialStates] = useState([]);
    const [enablePopups, setEnablePopups] = useState(true);
    const [enableRatings, setEnableRatings] = useState(true);
    const [resetCount, setResetCount] = useState(0);
    const [popupState, setPopupState] = useState('');
    const [isSpecial, setIsSpecial] = useState(false);
    const [senateWinner, setSenateWinner] = useState('');
    const [govWinner, setGovWinner] = useState('');
    const mouseposition = useMousePosition();

    const prediction = useRef(null);

    const safeDemColor = 'rgba(0, 71, 255, 0.8)', likelyDemColor = 'rgba(0, 100, 255, 0.85)', leanDemColor = 'rgb(0, 127, 255)', tiltDemColor = 'rgba(180, 210, 255, 0.60)';
    const safeRepColor = 'rgba(253, 3, 83, 0.9)', likelyRepColor = 'rgb(249, 90, 112)', leanRepColor = 'rgb(249, 140, 162)', tiltRepColor = 'rgba(255, 180, 195, 1)';
    const calledDemColor = 'rgba(0, 71, 255, 0.65)', calledRepColor = 'rgba(253, 3, 83, 0.75)';
    const uncalledColor = 'rgba(60, 60, 62, 1)';
    const noRaceColor = 'rgba(36, 36, 37, .1)';

    const letterColor = 'white';
    const letterFont = '14px';
    const strokeWidth = 1.5;
    const strokeColor = 'darkgrey';

    const stateList = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

    useEffect(() => {
        resetMap();
    }, [mode, resultsYear, prediction.current ? prediction.current.value : ''])

    useEffect(() => {
        getWinners();
        
    }, [JSON.stringify(resultsRecords)])

    useEffect(() => {
        const newStates = [];
        const tempSpecialStates = [];

        for (let record of resultsRecords) {
            if (record.year === resultsYear && record.type === mode) {
                for (let race of raceRecords) {
                    if (record.state === race.state && race.year === resultsYear && race.type === mode && (race.candidateA === record.name || race.candidateB === record.name)) {
                        if (record.isSpecial === true) {
                            race.isSpecial = true;
        
                        } else {
                            race.isSpecial = false;
                        }
                    } else if (record.state === race.state && race.year === resultsYear && race.type === mode) {
                        if (record.isSpecial === true) {
                            race.isSpecial = true;
        
                        } else {
                            race.isSpecial = false;
                        }
                    }
                }
            }
        }

        for (let race of raceRecords) {
            if (race.state === 'OK' && race.district === 'S3') {race.isSpecial = false;}
        }

        if (resultsYear === 2022) {
            for (let thisState of stateList) {
                let currentRace = {};
                const races = [];
                const stateElement = document.getElementById(thisState);

                stateElement.style.fill = noRaceColor;
    
                for (let x of raceRecords) {
                    if (x.type === mode && x.state.includes(thisState)) {
                        let called = '', margin = x.margin;

                        for (let candidate of resultsRecords) {
                            if (candidate.year === resultsYear && candidate.state.includes(thisState) && candidate.type === mode && candidate.isSpecial === x.isSpecial) {

                                if (candidate.called === 'Democratic') {
                                    called = 'Democratic';
                
                                } else if (candidate.called === 'Republican') {
                                    called = 'Republican';
                
                                }
                            }
                        }

                        currentRace = {state: x.state, called: called, hasElection: true, ratingRank: x.ratingRank, margin: margin, isSpecial: x.isSpecial, noahRank: x.noahRank, noahMargin: x.noahMargin};
                        races.push(currentRace);
                    }
                }

                for (let race of races) {
                    if (!race.state) {
                        race = {state: thisState, hasElection: false, called: '', isSpecial: false};
                    }
        
                    if (newStates.findIndex((element) => {if(element.state === race.state) {return true;} return false;}) === -1 && race.isSpecial === false) {
                        if (race.hasElection) {
                            newStates.push(race);
                        }
                    }

                    if (race.called === 'Democratic') {
                        stateElement.style.fill = calledDemColor;
                    } else if (race.called === 'Republican') {
                        stateElement.style.fill = calledRepColor;
                    }
                }

                for (let race of races) {        
                    if (newStates.findIndex((element) => {if(element.state === race.state) {return true;} return false;}) === -1) {
                        if (race.hasElection) {
                            newStates.push(race);

                            if (race.called === 'Democratic') {
                                stateElement.style.fill = calledDemColor;
                            } else if (race.called === 'Republican') {
                                stateElement.style.fill = calledRepColor;
                            }

                        }
                    } else if (race.isSpecial) {
                        race.state = `${race.state}-SPECIAL`;
                        tempSpecialStates.push(race);

                        const specialElement = document.getElementById(`SPECIAL${tempSpecialStates.indexOf(race) + 1}`);

                        if (race.called === 'Democratic') {
                            specialElement.style.fill = calledDemColor;
                        } else if (race.called === 'Republican') {
                            specialElement.style.fill = calledRepColor;
                        }

                    }
                }

            }

        } else {
            for (let thisState of stateList) {
                let candidate = {}, altCandidate = {}, specialCandidate = {}, specialAltCandidate = {}, called = '', ratingRank, margin = 0, specialCalled = '', specialRatingRank, specialMargin = 0;
                let vote = 0, candidatePercent = 0, altPercent = 0, specialCandidatePercent = 0, specialAltPercent = 0;
                const races = [];
    
                for (let x of resultsRecords) {
                    if (x.type === mode && x.state.includes(thisState) && x.year === resultsYear && x.isSpecial === false && (Number(x.vote) >= vote || Number(x.runoffVote) >= vote)) {
                        candidate = x;
                        if (candidate.vote !== '' && candidate.runoffVote === '') {
                            vote = Number(candidate.vote);
                            candidatePercent = Number(candidate.percent.slice(0, candidate.percent.length - 1));
                        }
                        else if (candidate.vote === '' && candidate.runoffVote !== '') {
                            vote = Number(candidate.runoffVote);
                            candidatePercent = Number(candidate.runoffPercent.slice(0, candidate.runoffPercent.length - 1));
                        } 
                    }
                }

                vote = 0;

                for (let x of resultsRecords) {
                    if (x.type === mode && x.state.includes(thisState) && x.year === resultsYear && x.isSpecial === false && x !== candidate && (Number(x.vote) >= vote || Number(x.runoffVote) >= vote)) {
                        altCandidate = x;
                        if (altCandidate.vote !== '' && altCandidate.runoffVote === '') {
                            vote = Number(altCandidate.vote);
                            altPercent = Number(altCandidate.percent.slice(0, altCandidate.percent.length - 1));
                        }
                        else if (altCandidate.vote === '' && altCandidate.runoffVote !== '') {
                            vote = Number(altCandidate.runoffVote);
                            altPercent = Number(altCandidate.runoffPercent.slice(0, altCandidate.runoffPercent.length - 1));
                        } 

                    }
                }

                vote = 0;

                for (let x of resultsRecords) {
                    if (x.type === mode && x.state.includes(thisState) && x.year === resultsYear && x.isSpecial === true && (Number(x.vote) >= vote || Number(x.runoffVote) >= vote)) {
                        specialCandidate = x;
                        if (specialCandidate.vote !== '' && specialCandidate.runoffVote === '') {
                            vote = Number(specialCandidate.vote);
                            specialCandidatePercent = Number(specialCandidate.percent.slice(0, specialCandidate.percent.length - 1));
                        }
                        else if (specialCandidate.vote === '' && specialCandidate.runoffVote !== '') {
                            vote = Number(specialCandidate.runoffVote);
                            specialCandidatePercent = Number(specialCandidate.runoffPercent.slice(0, specialCandidate.runoffPercent.length - 1));
                        }
                    }
                }

                vote = 0;

                for (let x of resultsRecords) {
                    if (x.type === mode && x.state.includes(thisState) && x.year === resultsYear && x.isSpecial === true && x !== specialCandidate  && (Number(x.vote) >= vote || Number(x.runoffVote) >= vote)) {
                        specialAltCandidate = x;
                        if (specialAltCandidate.vote !== '' && specialAltCandidate.runoffVote === '') {
                            vote = Number(specialAltCandidate.vote);
                            specialAltPercent = Number(specialAltCandidate.percent.slice(0, specialAltCandidate.percent.length - 1));
                        }
                        else if (specialAltCandidate.vote === '' && specialAltCandidate.runoffVote !== '') {
                            vote = Number(specialAltCandidate.runoffVote);
                            specialAltPercent = Number(specialAltCandidate.runoffPercent.slice(0, specialAltCandidate.runoffPercent.length - 1));
                        } 
                    }
                }

                if (candidate !== {}) {
                    if (candidate.called === 'Democratic') {called = 'Democratic'}
                    else if (candidate.called === 'Republican') {called = 'Republican'}
                }

                if (altCandidate !== {}) {
                    if (altCandidate.called === 'Democratic') {called = 'Democratic'}
                    else if (altCandidate.called === 'Republican') {called = 'Republican'}
                }

                if (specialCandidate !== {}) {
                    if (specialCandidate.called === 'Democratic') {specialCalled = 'Democratic'}
                    else if (specialCandidate.called === 'Republican') {specialCalled = 'Republican'}
                }

                if (specialAltCandidate !== {}) {
                    if (specialAltCandidate.called === 'Democratic') {specialCalled = 'Democratic'}
                    else if (specialAltCandidate.called === 'Republican') {specialCalled = 'Republican'}
                }

                if (candidate !== {} && altCandidate !== {} && candidatePercent !== 0 && altPercent !== 0) {
                    margin = candidatePercent - altPercent;
                    if (Math.abs(margin) > 15) {
                        if (candidate.caucus === 'Democratic') {ratingRank = 3; margin = Math.abs(margin)}
                        else {ratingRank = -3; margin = -1 * Math.abs(margin)}

                    } else if (Math.abs(margin) > 5) {
                        if (candidate.caucus === 'Democratic') {ratingRank = 2; margin = Math.abs(margin)}
                        else {ratingRank = -2; margin = -1 * Math.abs(margin)}

                    } else if (Math.abs(margin) > 1) {
                        if (candidate.caucus === 'Democratic') {ratingRank = 1; margin = Math.abs(margin)}
                        else {ratingRank = -1; margin = -1 * Math.abs(margin)}

                    } else if (Math.abs(margin) > 0) {
                        if (candidate.caucus === 'Democratic') {ratingRank = 0; margin = Math.abs(margin)}
                        else {ratingRank = 0; margin = -1 * Math.abs(margin)}
                    } 
                } else if (candidate !== {} && candidate.percent && candidatePercent > 65) {
                    if (candidate.caucus === 'Democratic') {ratingRank = 3; margin = 100;}
                    else if (candidate.caucus === 'Republican') {ratingRank = -3; margin = -100;}
                }

                if (specialCandidate !== {} && specialAltCandidate !== {} && specialCandidatePercent !== 0 && specialAltPercent !== 0) {
                    specialMargin = specialCandidatePercent - specialAltPercent;
                    if (Math.abs(specialMargin) > 15) {
                        if (specialCandidate.caucus === 'Democratic') {specialRatingRank = 3; specialMargin = Math.abs(specialMargin)}
                        else {specialRatingRank = -3; specialMargin = -1 * Math.abs(specialMargin)}

                    } else if (Math.abs(specialMargin) > 5) {
                        if (specialCandidate.caucus === 'Democratic') {specialRatingRank = 2; specialMargin = Math.abs(specialMargin)}
                        else {specialRatingRank = -2; specialMargin = -1 * Math.abs(specialMargin)}

                    } else if (Math.abs(specialMargin) > 1) {
                        if (specialCandidate.caucus === 'Democratic') {specialRatingRank = 1; specialMargin = Math.abs(specialMargin)}
                        else {specialRatingRank = -1; specialMargin = -1 * Math.abs(specialMargin)}

                    } else if (Math.abs(specialMargin) > 0) {
                        if (specialCandidate.caucus === 'Democratic') {specialRatingRank = 0; specialMargin = Math.abs(specialMargin)}
                        else {specialRatingRank = 0; specialMargin = -1 * Math.abs(specialMargin)}
                    } 
                } else if (specialCandidate !== {} && specialCandidate.percent && specialCandidatePercent > 65) {
                    if (specialCandidate.caucus === 'Democratic') {specialRatingRank = 3; specialMargin = 100;}
                    else if (specialCandidate.caucus === 'Republican') {specialRatingRank = -3; specialMargin = -100;}
                }

                let currentRace = {state: candidate.state, called: called, hasElection: true, ratingRank: ratingRank, margin: margin, isSpecial: candidate.isSpecial};
    
                if (!currentRace.state) {
                    currentRace = {state: thisState, hasElection: false, called: called, isSpecial: false};
                }

                races.push(currentRace);

                if (specialCandidate !== {}) {
                    let currentRace = {state: specialCandidate.state, called: specialCalled, hasElection: true, ratingRank: specialRatingRank, margin: specialMargin, isSpecial: specialCandidate.isSpecial};
    
                    if (!currentRace.state) {
                        currentRace = {state: thisState, hasElection: false, called: specialCalled, isSpecial: false};
                    }

                    races.push(currentRace);
                }
    
                for (let race of races) {
        
                    if (newStates.findIndex((element) => {if(element.state === race.state) {return true;} return false;}) === -1) {
                        if (race.hasElection) {
                            newStates.push(race);
                        }
                    } else if (race.isSpecial) {
                        race.state = `${race.state}-SPECIAL`;
                        tempSpecialStates.push(race);
                    }
                }
            }
        }

        if (page === 'PAST') {
            for (let thisState of stateList) {
                const stateElement = document.getElementById(thisState);
    
                if (stateElement) {stateElement.style.fill = noRaceColor;}
            }
        }
        
        const specialElem1 = document.getElementById('SPECIAL1');
        const specialElem2 = document.getElementById('SPECIAL2');
        const specialElem3 = document.getElementById('SPECIAL3');
        const specialElem4 = document.getElementById('SPECIAL4');

        if (specialElem1 && page === 'PAST') {specialElem1.style.fill = noRaceColor;}
        if (specialElem2 && page === 'PAST') {specialElem2.style.fill = noRaceColor;}
        if (specialElem3 && page === 'PAST') {specialElem3.style.fill = noRaceColor;}
        if (specialElem4 && page === 'PAST') {specialElem4.style.fill = noRaceColor;}


        newStates.map((state) => {
            const elem = document.getElementById(state.state.toString());

            if (state.hasElection && elem && enableRatings) {
                let rank, margin;

                if (prediction.current.value === 'FiveThirtyEight') {rank = state.ratingRank; margin = state.margin;}
                else {rank = state.noahRank; margin = state.noahMargin;}

                if ((state.called === 'Democratic' || state.called === 'Republican') && page === 'LIVE') {
                    callRace(elem);

                } else if (state.called !== '' && (page === 'LIVE' || page === 'CALLSIM')) {

                } else if (rank === 3 && state.hasElection) {
                    elem.style.fill = safeDemColor;

                } else if (rank === 2 && state.hasElection) {
                    elem.style.fill = likelyDemColor;

                } else if (rank === 1 && state.hasElection) {
                    elem.style.fill = leanDemColor;

                } else if (rank === -1 && state.hasElection) {
                    elem.style.fill = leanRepColor;

                } else if (rank === -2 && state.hasElection) {
                    elem.style.fill = likelyRepColor;

                } else if (rank === -3 && state.hasElection) {
                    elem.style.fill = safeRepColor;

                } else if (rank === 0 && state.hasElection) {
                    if (margin && margin > 0) {
                        elem.style.fill = tiltDemColor;
                    } else if (margin && margin < 0) {
                        elem.style.fill = tiltRepColor;
                    }

                } else if (state.hasElection) {
                    elem.style.fill = uncalledColor;

                }
            } else if (state.hasElection && elem) {
                if ((state.called === 'Democratic' || state.called === 'Republican') && page === 'LIVE') {
                    callRace(elem);

                } else if (state.called === '') {
                    elem.style.fill = uncalledColor;
                }

            } else if (elem) {
                elem.style.fill = noRaceColor;
            }

            return;
           
        });

        tempSpecialStates.map((state) => {
            const elem = document.getElementById(`SPECIAL${tempSpecialStates.indexOf(state) + 1}`);
            const elemText = document.getElementById(`SPECIAL${tempSpecialStates.indexOf(state) + 1}-text`);

            if (elemText) {elemText.innerHTML = `${state.state.slice(0, 2)} Special`;}
            if (elem) {elem.attributes['data-id'].value = state.state}

            if (state.hasElection && elem && enableRatings) {
                let rank, margin;

                if (prediction.current.value === 'FiveThirtyEight') {rank = state.ratingRank; margin = state.margin;}
                else {rank = state.noahRank; margin = state.noahMargin;}

                if ((state.called === 'Democratic' || state.called === 'Republican') && page === 'LIVE') {
                    callRace(elem);

                } else if (state.called !== '' && (page === 'LIVE' || page === 'CALLSIM')) {

                } else if (rank === 3 && state.hasElection) {
                    elem.style.fill = safeDemColor;

                } else if (rank === 2 && state.hasElection) {
                    elem.style.fill = likelyDemColor;

                } else if (rank === 1 && state.hasElection) {
                    elem.style.fill = leanDemColor;

                } else if (rank === -1 && state.hasElection) {
                    elem.style.fill = leanRepColor;

                } else if (rank === -2 && state.hasElection) {
                    elem.style.fill = likelyRepColor;

                } else if (rank === -3 && state.hasElection) {
                    elem.style.fill = safeRepColor;

                } else if (rank === 0 && state.hasElection) {
                    if (margin && margin > 0) {
                        elem.style.fill = tiltDemColor;
                    } else if (margin && margin < 0) {
                        elem.style.fill = tiltRepColor;
                    }

                } else if (state.hasElection) {
                    elem.style.fill = uncalledColor;

                }
            } else if (state.hasElection && elem) {
                if ((state.called === 'Democratic' || state.called === 'Republican') && page === 'LIVE') {
                    callRace(elem);

                } else if (state.called === '') {
                    elem.style.fill = uncalledColor;
                }

            } else if (elem) {
                elem.style.fill = noRaceColor;
            }

            return;
           
        });

        getWinners();

        setStates(newStates);
        setSpecialStates(tempSpecialStates);

    }, [raceRecords, resultsRecords, resetCount, enableRatings]);

    function getWinners () {
        if (resultsYear === 2022) {
            if (senateCount[0] >= 50) {
                setSenateWinner('Democratic');
            } else if (senateCount[1] > 50) {
                setSenateWinner('Republican');
            } else if (senateWinner !== '') {
                setSenateWinner('')
            }

        } else {
            if (senateCount[0] > 50) {
                setSenateWinner('Democratic');
            } else if (senateCount[1] > 50) {
                setSenateWinner('Republican');
            } else if (senateCount[0] === 50) {
                if (president[1] === 1) {
                    setSenateWinner('Republican');
                } else if (president[0] === 1) {
                    setSenateWinner('Democratic');
                }

            } else if (senateWinner !== '') {
                setSenateWinner('')
            }

        }

        if (govCount[0] > 25) {
            setGovWinner('Democratic');
        } else if (govCount[1] > 25) {
            setGovWinner('Republican');
        } else if (govWinner !== '') {
            setGovWinner('')
        }

        return;
    }

    function resetMap() {
        const hoverObj = document.getElementById('topObj');

        hoverObj.attributes['calledpath'].value = '';
        hoverObj.attributes['d'].value = '';

        if (page === 'LIVE' || page === 'CALLSIM') {
            setSenateCount([36, 29]);
            setGovCount([6, 8]);
        } else if (page === 'PAST') {
            setSenateCount([0, 0]);
            setGovCount([0, 0]);
        }
        
        setResetCount((c) => c + 1);

        if (page === 'CALLSIM') {
            for (let record of resultsRecords) {
                if (record.year === resultsYear) {
                    record.called = '';
                }
            }
        }
    }

    function callRace(target) {
        let id = target.id, currentState, special = false;

        if (id === 'SPECIAL1' || id === 'SPECIAL2' || id === 'SPECIAL3' || id === 'SPECIAL4') {
            id = target.attributes['data-id'].value;
            currentState = specialStates.find(item => item.state === id);
            special = true;
        } else {
            currentState = states.find(item => item.state === id);
        }

        let rank, margin;

        if (prediction.current.value === 'FiveThirtyEight') {rank = currentState.ratingRank; margin = currentState.margin;}
        else {rank = currentState.noahRank; margin = currentState.noahMargin;}

        let demCount, repCount;
        if (mode === 'SENATE') {demCount = 36; repCount = 29;}
        else if (mode === 'GOVERNOR') {demCount = 6; repCount = 8;}

        if (currentState && currentState.hasElection) {
            const hoverObj = document.getElementById('topObj');

            if (!hoverObj.attributes['calledpath'].value.includes(target.attributes['d'].value)) {
                hoverObj.attributes['calledpath'].value += target.attributes['d'].value + ` M 0,0 z `;
                hoverObj.attributes['d'].value = hoverObj.attributes['calledpath'].value;
            }
            
            if (page === 'LIVE') {
                if (currentState.called === 'Democratic') {
                    target.style.fill = calledDemColor;

                } else if (currentState.called === 'Republican') {
                    target.style.fill = calledRepColor;
                    
                }
            }
            else if (rank > 0 && rank < 4 && currentState.called === '') {
                target.style.fill = calledDemColor;
                currentState.called = 'Democratic';
                updateState(currentState, special);

            } else if (rank < 0 && rank > -4 && currentState.called === ''){
                target.style.fill = calledRepColor;
                currentState.called = 'Republican';
                updateState(currentState, special);
            } else if (rank === 0 && currentState.called === '') {
                if (margin > 0) {
                    target.style.fill = calledDemColor;
                    currentState.called = 'Democratic';
                } else {
                    target.style.fill = calledRepColor;
                    currentState.called = 'Republican';
                }

                updateState(currentState, special);

            } else if (currentState.called === 'Democratic'){
                target.style.fill = calledRepColor;
                currentState.called = 'Republican';
                updateState(currentState, special);
            } else if (currentState.called === 'Republican'){
                target.style.fill = calledDemColor;
                currentState.called = 'Democratic';
                updateState(currentState, special);
            }

            if (page === 'CALLSIM') {
                for (let record of resultsRecords) {
                    if (record.state === currentState.state.slice(0, 2) && record.type === mode && record.year === resultsYear && record.isSpecial === currentState.isSpecial) {
                        if (currentState.called === 'Democratic' && record.caucus === 'Republican') {
                            record.called = '';

                        } else if (currentState.called === 'Republican' && record.caucus === 'Democratic') {
                            record.called = '';

                        }
                    }
                }

                for (let record of resultsRecords) {
                    if (record.state === currentState.state.slice(0, 2) && record.type === mode && record.year === resultsYear && record.isSpecial === currentState.isSpecial) {
                        if (currentState.called === 'Democratic' && record.caucus === 'Democratic') {
                            record.called = 'Democratic';
                            break;

                        } else if (currentState.called === 'Republican' && record.caucus === 'Republican') {
                            record.called = 'Republican';
                            break;

                        }
                    }
                }
            }
        }

        states.map((state) => {
            if (state.called === 'Democratic') demCount += 1;
            else if (state.called === 'Republican') repCount += 1;
            return;
        });

        specialStates.map((state) => {
            if (state.called === 'Democratic') demCount += 1;
            else if (state.called === 'Republican') repCount += 1;
            return;
        });

        if (mode === 'SENATE') {setSenateCount([demCount, repCount]);}
        else if (mode === 'GOVERNOR') {setGovCount([demCount, repCount]);}
        
    }

    function autoCallRaces(rating) {
        const solid = [], lean = [], likely = [], tilt = [];
        const specialSolid = [], specialLean = [], specialLikely = [], specialTilt = [];

        for (let state of states) {
            if (Math.abs(state.ratingRank) === 3) {
                solid.push(state)
            } else if (Math.abs(state.ratingRank) === 2) {
                likely.push(state)
            } else if (Math.abs(state.ratingRank) === 1) {
                lean.push(state)
            } else if (Math.abs(state.ratingRank) === 0) {
                tilt.push(state)
            }
        }

        for (let state of specialStates) {
            if (Math.abs(state.ratingRank) === 3) {
                specialSolid.push(state)
            } else if (Math.abs(state.ratingRank) === 2) {
                specialLikely.push(state)
            } else if (Math.abs(state.ratingRank) === 1) {
                specialLean.push(state)
            } else if (Math.abs(state.ratingRank) === 0) {
                specialTilt.push(state)
            }
        }

        if (rating === 'ALL' || rating === 'SOLID') {
            for (let state of solid) {
                if (state.called === '') {
                    callRace(document.getElementById(state.state));
                } else {
                    state.called = '';
                    callRace(document.getElementById(state.state));
                }
            }
            for (let state of specialSolid) {
                if (state.called === '') {
                    callRace(document.getElementById(`SPECIAL${specialStates.indexOf(state) + 1}`));
                } else {
                    state.called = '';
                    callRace(document.getElementById(`SPECIAL${specialStates.indexOf(state) + 1}`));
                }
            }
        }

        if (rating === 'ALL' || rating === 'LIKELY') {
            for (let state of likely) {
                if (state.called === '') {
                    callRace(document.getElementById(state.state));
                } else {
                    state.called = '';
                    callRace(document.getElementById(state.state));
                }            }
            for (let state of specialLikely) {
                if (state.called === '') {
                    callRace(document.getElementById(`SPECIAL${specialStates.indexOf(state) + 1}`));
                } else {
                    state.called = '';
                    callRace(document.getElementById(`SPECIAL${specialStates.indexOf(state) + 1}`));
                }
            }
        }

        if (rating === 'ALL' || rating === 'LEAN') {
            for (let state of lean) {
                if (state.called === '') {
                    callRace(document.getElementById(state.state));
                } else {
                    state.called = '';
                    callRace(document.getElementById(state.state));
                }            }
            for (let state of specialLean) {
                if (state.called === '') {
                    callRace(document.getElementById(`SPECIAL${specialStates.indexOf(state) + 1}`));
                } else {
                    state.called = '';
                    callRace(document.getElementById(`SPECIAL${specialStates.indexOf(state) + 1}`));
                }
            }
        }

        if (rating === 'ALL' || rating === 'TILT') {
            for (let state of tilt) {
                if (state.called === '') {
                    callRace(document.getElementById(state.state));
                } else {
                    state.called = '';
                    callRace(document.getElementById(state.state));
                }            }
            for (let state of specialTilt) {
                if (state.called === '') {
                    callRace(document.getElementById(`SPECIAL${specialStates.indexOf(state) + 1}`));
                } else {
                    state.called = '';
                    callRace(document.getElementById(`SPECIAL${specialStates.indexOf(state) + 1}`));
                }
            }
        }
        
    }

    const updateState = (newState, special) => {
        if (special) {
            const newStateArray = specialStates.map(obj => {
                if (obj.state === newState.state) {
                    return {...obj, called: newState.called};
                } else {
                    return obj;
                }
            });
    
            setSpecialStates(newStateArray);

        } else {
            const newStateArray = states.map(obj => {
                if (obj.state === newState.state) {
                    return {...obj, called: newState.called};
                } else {
                    return obj;
                }
            });
    
            setStates(newStateArray);
        }
    };

    function enablePops(e) {
        if (enablePopups) {
            setEnablePopups(false);
            e.currentTarget.innerHTML = 'ENABLE INFO';
        }
        else {
            setEnablePopups(true);
            e.currentTarget.innerHTML = 'DISABLE INFO';
        }
    }

    function enableRate(e) {
        if (enableRatings) {
            setEnableRatings(false);
            e.currentTarget.innerHTML = 'ENABLE RATINGS';
        }
        else {
            setEnableRatings(true);
            e.currentTarget.innerHTML = 'DISABLE RATINGS';
        }
    }

    function handleClick(e) {
        if (page === 'CALLSIM') {
            let id = e.currentTarget.id;
            callRace(e.currentTarget);
        }
    }

    function handleMouseEnter(e) {
        setPopupState('');
        const id = e.currentTarget.id;

        for (let state of states) {
            if (state.state === e.currentTarget.id && state.hasElection) {
                const hoverObj = document.getElementById('topObj');
                hoverObj.attributes['d'].value = hoverObj.attributes['calledpath'].value + e.currentTarget.attributes['d'].value;

                if (state.state === e.currentTarget.id) {
                    if (state.isSpecial === false && isSpecial !== false) {setIsSpecial(false)}
                    else if (state.isSpecial === true && isSpecial !== true) {setIsSpecial(true)}
                }
                

                if (page === "LIVE" || page === 'PAST' || page === 'CALLSIM') {setPopupState(e.currentTarget.id);}
            }
        }

        if (id === 'SPECIAL1' || id === 'SPECIAL2' || id === 'SPECIAL3' || id === 'SPECIAL4') {
            for (let state of specialStates) {
                const thisState = e.currentTarget.attributes['data-id'].value;
                if (state.state === thisState && state.hasElection) {
                    const hoverObj = document.getElementById('topObj');
                    hoverObj.attributes['d'].value = hoverObj.attributes['calledpath'].value + e.currentTarget.attributes['d'].value;
    
                    if (state.state !== e.currentTarget.id) {
                        if (state.isSpecial === true && isSpecial !== true) {setIsSpecial(true)}
                    }
    
                    if (page === "LIVE" || page === 'PAST' || page === 'CALLSIM') {setPopupState(state.state.slice(0,2));}
                }
            }
        }        
    }

    function handleMouseLeave(e) {
        if (page === "LIVE" || page === 'PAST' || page === 'CALLSIM') {
            setPopupState('');
            const hoverObj = document.getElementById('topObj');
            hoverObj.attributes['d'].value = hoverObj.attributes['calledpath'].value;
        }
    }

   
    
    return (
        <>
        {(page === 'CALLSIM' || page === 'LIVE') &&
            <div className='predictionText'>
                <span className={'spanText'}>Showing predictions from</span>
                <select ref={prediction}>
                    <option>FiveThirtyEight</option>
                    <option>Noah's brain</option>
                </select>
            </div>
        }
        <div className='map'>
        <div className='mapButtons'>
            {page === 'CALLSIM' &&
                <>
                    <h2>CALL RACES</h2>
                    <button onClick={() => {autoCallRaces('ALL')}}>ALL</button>
                    <button onClick={() => {autoCallRaces('SOLID')}}>SOLID</button>
                    <button onClick={() => {autoCallRaces('LIKELY')}}>LIKELY</button>
                    <button onClick={() => {autoCallRaces('LEAN')}}>LEAN</button>
                    <button onClick={() => {autoCallRaces('TILT')}}>TILT</button>
                </>
            }
            {(page === 'PAST' || page === 'LIVE') &&
                <>
                    <h2>SEAT BREAKDOWN</h2>
                    <div className='seatBreakdown'>
                        <h3 id='demCount' className={((mode === 'SENATE' && senateWinner === 'Democratic') || (mode === 'GOVERNOR' && govWinner === 'Democratic')) ? 'demWin' : 'dem'}>DEMS: {mode === 'SENATE' ? senateCount[0] : govCount[0] }</h3>
                        <h3 id='repCount' className={((mode === 'SENATE' && senateWinner === 'Republican') || (mode === 'GOVERNOR' && govWinner === 'Republican')) ? 'repWin' : 'rep'}>GOP: {mode === 'SENATE' ? senateCount[1] : govCount[1] }</h3>
                    </div>
                </>
            }
        </div>
        <br />
        <div className='mapContainer'>
            <svg
                enable_background="new 0 0 1000 589"
                pretty_print="False"
                style={{strokeLinejoin: 'round', stroke: strokeColor, fill: 'none', fontSize:letterFont, color:letterColor}}
                version="1.1"
                viewBox="65 0 1000 589"
                id="svg">
                <defs
                    id="defs4">
                    <style
                    type="text/css"
                    id="style6"></style>
                </defs>
                <metadata
                    id="metadata8">
                    <views
                    id="views10">
                    <view
                        h="589.235294118"
                        padding="0"
                        w="1000"
                        id="view12">
                        <proj
                        id="laea-usa"
                        lat0="45"
                        lon0="-100" />
                        <bbox
                        h="321.97"
                        w="589.33"
                        x="690.09"
                        y="918.69"
                        id="bbox15" />
                    </view>
                    </views>
                </metadata>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'MA' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="MA"
                    data-name="Massachusetts"
                    data-id="MA"
                    d="m 923.01913,132.86173 -0.67944,0.29119 -5.5326,1.65007 -1.94126,0.67944 -2.23245,0.67944 -0.7765,0.29119 v 0.29119 l 0.29118,5.04728 0.29119,4.65903 0.29119,4.27078 0.48532,0.29119 1.74714,-0.48532 7.86211,-2.32951 0.19412,0.48531 13.97709,-5.33847 0.0971,0.19413 1.26182,-0.48532 4.4649,-1.74713 4.27078,5.14434 v 0 l 0.58238,-0.48531 0.29119,-1.45595 -0.0971,2.32952 v 0 h 0.97063 l 0.29119,1.16475 0.87357,1.65008 v 0 l 4.56197,-5.5326 3.78546,1.26182 0.87357,-1.94126 6.21204,-3.30015 -2.62071,-5.14435 0.67945,3.30015 -3.20309,2.42658 -3.59133,0.29119 -7.18267,-7.66799 -3.20309,-4.85315 3.20309,-3.39721 -3.30015,-0.19413 -1.35888,-3.20308 -0.0971,-0.19413 -5.53259,6.01791 -12.22996,4.07666 -3.97959,1.26182 v 0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'MN' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="MN"
                    data-name="Minnesota"
                    data-id="MN"
                    d="m 558.54712,73.847349 1.94126,6.891482 4.07665,24.848159 1.94126,9.90044 0.58238,8.73568 2.23246,5.24141 0.48531,4.4649 0.38825,1.45595 -0.0971,0.29119 -3.88252,6.40616 2.52364,4.27078 4.85315,34.16622 0.19413,4.4649 4.85315,-0.29119 19.12144,-1.06769 47.75505,-3.97959 4.7561,-0.48532 0,-0.48531 -1.35889,-7.47386 -5.92085,-3.00896 -4.65903,-4.85315 -7.37679,-4.46491 -2.32952,-0.19412 -3.59133,-2.71777 0.97063,-13.39471 -3.39721,-3.10602 1.16476,-5.43554 6.21204,-5.62966 -1.0677,-11.64757 2.23245,-2.52364 0,0 7.57093,-7.95918 8.63861,-11.065195 3.30015,-2.329514 5.82379,-2.814831 6.11497,-4.561967 -4.07665,0.776505 -2.42658,-1.844199 -9.31806,1.261821 -1.45594,-1.747136 -8.34743,3.397209 -6.69736,-2.814831 -1.84419,-2.232452 -5.33848,0.388253 -3.59133,-1.844199 1.16476,-1.358884 -4.56197,-1.455947 -4.07665,0 -6.50323,2.814831 -1.26182,-1.941263 -10.28869,-1.455947 -3.49427,-8.73568 -0.38826,-2.620705 -4.4649,-1.26182 0.38825,7.47386 -11.8417,0.873568 -14.65653,0.582379 -0.97063,0.09706 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'MT' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="MT"
                    data-name="Montana"
                    data-id="MT"
                    d="m 465.65771,72.973781 -32.12789,-2.135389 -23.39221,-2.232451 -23.29515,-2.717768 -14.46241,-1.941262 -23.10102,-3.591336 -11.55051,-1.941262 -25.81879,-4.950219 -2.71777,-0.582379 -4.17371,19.800877 1.8442,3.591335 1.45595,5.532598 -0.87357,0.776505 1.8442,5.047282 2.52364,2.135389 7.18267,12.035829 0.67944,2.03832 2.91189,-0.19412 -3.39721,15.91835 -1.35888,0.38825 -1.8442,5.33847 9.60925,0.67944 0.77651,4.46491 5.43553,13.29765 0.97063,0.7765 3.78546,7.76505 0.97063,-0.7765 8.05624,-0.0971 10.19163,1.0677 2.52364,-3.30015 3.00896,5.43553 0.58238,0.29119 0.0971,-0.58237 1.35888,-9.51219 33.19559,4.07665 26.49823,2.52364 13.97709,1.16476 24.94522,1.45595 1.26182,0.0971 0.29119,0 0.0971,-1.35888 0.29119,-6.69736 0.38825,-8.83274 0.0971,-2.23246 0.19413,-3.88252 1.55301,-30.47782 1.26182,-23.683401 0.0971,-3.882525 -1.8442,-0.09706 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>

                
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'ND' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="ND"
                    data-name="North Dakota"
                    data-id="ND"
                    d="m 556.50879,73.847349 -29.31306,0.582379 -20.48032,-0.09706 -17.56842,-0.388253 -20.57738,-0.776505 -1.0677,-0.09706 -0.0971,3.882525 -1.26182,23.683405 -1.55301,30.47782 -0.19413,3.88252 3.78546,0.19413 42.80484,1.16476 39.50469,-0.29119 16.40367,-0.48532 3.30014,-0.19412 -0.38825,-1.45595 -0.48531,-4.4649 -2.23246,-5.24141 -0.58238,-8.73568 -1.94126,-9.90044 -4.07665,-24.848163 -1.94126,-6.891482 -2.03833,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'HI' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="HI"
                    data-name="Hawaii"
                    data-id="HI"
                    d="m 416.34965,514.99923 -3.00896,-2.23245 -2.6207,0.67944 0.58238,5.43553 -3.59134,4.46491 3.10602,7.08561 0.87357,7.27973 3.59133,2.32951 2.23246,-3.59133 3.97958,-2.91189 4.85316,-1.26183 5.33847,-4.56196 -5.24141,-4.46491 -0.0971,-2.71776 -9.9975,-5.5326 z m -17.66549,-7.86211 -1.45595,-1.26182 -1.35888,1.8442 z m -7.27973,-4.17372 0.38825,-3.59133 -1.8442,-0.29119 z m 6.11497,-5.92085 -1.65007,0.77651 1.16476,3.6884 2.52364,0.19412 0.7765,3.20308 2.71777,1.16476 6.01791,-2.81483 -5.62966,-4.65903 z m -12.42408,-3.97959 -0.87356,2.62071 4.17371,-0.0971 3.88252,0.97063 -2.03832,-3.20309 -5.14435,-0.29119 z m -12.22995,-7.66798 -2.23245,-2.13539 -4.27078,3.30015 2.71777,5.04728 1.94126,-2.03833 5.5326,1.16476 -0.48532,-2.32952 z m -43.48428,-4.27078 0.58238,-1.35888 1.65007,-0.87357 z m 15.43304,-8.83274 -6.79442,2.52364 -0.67944,1.8442 2.71777,1.94126 3.78546,0.97063 2.71776,-5.33847 z"
                    style={{strokeWidth:strokeWidth}}
                    /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'ID' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="ID"
                    data-name="Idaho"
                    data-id="ID"
                    d="m 309.0949,52.881715 -8.63862,-1.747136 -2.81483,-0.679442 -1.26182,-0.291189 -11.25932,50.666952 0.48532,4.17371 -0.38826,4.36784 0.19413,0.97063 0,0.0971 0.0971,1.84419 3.30015,3.59134 -4.75609,11.93876 -10.09457,13.20059 -0.29119,2.42658 2.62071,6.21204 -9.221,38.24287 -0.38825,2.03832 2.71776,0.58238 27.46887,5.43553 10.96813,2.03833 2.81483,0.48532 2.71777,0.48531 13.97709,2.23245 25.04228,3.78546 2.81483,0.38826 0.38825,-3.20309 0.87357,-6.3091 3.30015,-25.23641 1.74714,-12.52114 0.38825,-3.20309 -0.58238,-0.29119 -3.00896,-5.43553 -2.52364,3.30015 -10.19163,-1.0677 -8.05624,0.0971 -0.97063,0.7765 -3.78546,-7.76505 -0.97063,-0.7765 -5.43553,-13.29765 -0.77651,-4.46491 -9.60925,-0.67944 1.8442,-5.33847 1.35888,-0.38825 3.39721,-15.91835 -2.91189,0.19412 -0.67944,-2.03832 -7.18267,-12.035829 -2.52364,-2.135389 -1.8442,-5.047282 0.87357,-0.776505 -1.45595,-5.532598 -1.8442,-3.591335 4.17371,-19.800877 -0.0971,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'WA' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="WA"
                    data-name="Washington"
                    data-id="WA"
                    d="m 192.13384,77.050432 0.0971,-1.650073 -0.19412,0.09706 0.0971,1.55301 z m 20.67445,-8.832744 0.58237,-0.970631 -0.67944,-0.09706 0.0971,1.067694 z m -1.8442,-1.747136 0.58237,-1.941262 -0.58237,-0.194127 z m 7.0856,-2.814831 -0.0971,-1.941262 -1.65007,2.523641 1.74713,-0.582379 z m 0.19413,-4.076651 0.29119,-1.941262 -0.19413,-0.485316 -0.0971,2.426578 z m 0.29119,-9.512185 -0.0971,-1.067695 -0.38826,-0.09706 0.48532,1.164758 z m -17.56843,34.84566 3.49428,3.785461 -0.58238,7.279734 0.67944,1.8442 5.24141,2.81483 14.75359,1.35888 0.58238,1.74714 6.98855,0.0971 6.60029,0.87357 10.774,-1.16476 5.33848,0.87357 1.45594,-0.67944 27.27474,6.21204 1.8442,0.38825 -0.19413,-0.97063 0.38826,-4.36784 -0.48532,-4.17371 11.25932,-50.666952 -1.55301,-0.29119 -22.71277,-5.338471 -19.80087,-5.047282 -22.42159,-6.21204 -6.69735,-1.650073 1.55301,8.444491 -1.45595,2.717768 -2.6207,-1.358884 2.52364,11.744637 -2.71777,3.882525 -1.26182,3.591336 v 3.688398 l -5.72672,3.979588 -2.42658,-1.55301 -2.32952,1.164758 4.27078,-5.532598 -1.06769,3.785462 2.42658,-2.620705 1.94126,0.388253 -0.58238,-4.853156 1.26182,0.194126 2.6207,-5.823787 -0.87356,-0.873568 -3.39721,4.36784 -2.23246,0.09706 2.42658,-2.717767 2.71777,-0.679442 -0.97063,-4.950219 -2.71777,-0.679442 -1.35888,-2.329515 -1.65008,0.873568 -8.9298,-3.882524 -7.86211,-6.114977 -2.13539,5.92085 -0.19413,2.523641 1.65007,4.464904 -1.06769,14.462405 -0.77651,2.232452 4.36784,0.388252 -4.36784,3.10602 2.32952,1.164757 -1.8442,6.21204 -0.87357,-4.853156 -1.65007,5.629661 2.23245,2.717767 2.42658,-0.194126 2.91189,1.747136 1.45595,2.814831 h 1.74713 v 0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'AZ' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="AZ"
                    data-name="Arizona"
                    data-id="AZ"
                    d="m 372.18593,309.90486 -32.71027,-4.07665 -17.56843,-2.52365 -25.04228,-3.97958 -2.52364,-0.38826 0,0.19413 -4.27078,18.83025 -2.23245,-0.0971 -3.39721,-3.00895 -4.27078,3.59133 -0.0971,15.43304 -1.55301,3.30014 0,0.29119 0,0.0971 -0.19413,2.42657 3.39721,9.12394 3.00896,4.07665 -5.43554,3.20308 -2.13539,3.97959 -3.49427,8.54155 -1.74713,0.38826 -0.0971,7.0856 3.00896,2.23246 -1.55301,4.27077 -3.49427,0.19413 0,0 -2.03833,3.78546 6.98855,4.36784 13.20058,7.3768 40.76651,21.64507 34.55447,4.27078 0.38825,0 2.71777,-28.63362 0.67944,-7.08561 7.27974,-75.12685 0.38825,-3.49427 -2.52364,-0.29119 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'CA' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="CA"
                    data-name="California"
                    data-id="CA"
                    d="m 222.99991,179.84028 -3.78546,-0.97064 -41.54301,-11.45344 -15.43304,-4.65903 v 0.38825 l -0.87357,9.60925 -4.07665,11.35638 -6.79442,8.44449 -0.19412,4.27078 3.30014,5.92085 1.65008,7.76505 -2.32952,6.3091 0.38825,6.30911 -1.16475,2.6207 3.97958,8.63862 2.52364,3.30015 -0.19412,9.41512 6.01791,5.72672 3.49427,-5.82378 3.78547,3.00895 1.45594,-1.35888 -5.24141,0.97063 -0.0971,4.95022 1.0677,6.21204 -2.9119,-2.81483 -1.65007,-3.78546 -0.48532,5.2414 1.35889,10.38576 5.43553,6.69735 -3.59133,4.65903 0.58237,5.92085 3.88253,6.01792 6.79442,18.63612 2.13539,1.16475 -0.67945,12.9094 1.0677,1.55301 14.55947,5.24141 4.4649,4.75609 1.55301,3.10602 4.27078,2.42658 4.65903,0.87357 1.94126,5.33847 3.88252,1.8442 5.82379,6.89148 5.43554,9.02687 -0.38826,8.34743 3.00896,3.97958 39.69882,3.88253 v 0 l 3.49427,-0.19413 1.55301,-4.27077 -3.00896,-2.23246 0.0971,-7.0856 1.74713,-0.38826 3.49427,-8.54155 2.13539,-3.97959 5.43554,-3.20308 -3.00896,-4.07665 -3.39721,-9.12394 0.19413,-2.42657 v -0.0971 l -2.52364,-3.39721 -7.76505,-10.38575 -15.04479,-21.15976 -20.96563,-30.08957 -11.8417,-16.40366 -11.45345,-16.50074 13.20058,-56.00542 0.87357,-3.68839 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'CO' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="CO"
                    data-name="Colorado"
                    data-id="CO"
                    d="m 489.6323,255.54951 0.38826,-19.02437 -4.65903,-0.19413 -23.6834,-0.87357 -2.32952,-0.0971 -1.94126,-0.0971 -28.82775,-1.8442 -19.2185,-1.55301 -23.97459,-2.32952 -2.32951,-0.29119 -0.29119,2.52365 -5.24141,50.56988 -1.8442,17.66549 -0.7765,7.66799 -0.19413,2.52364 3.00896,0.29119 48.91981,4.27077 21.54801,1.35889 21.45095,0.97063 3.10602,0.0971 1.94126,0.0971 4.07665,0.0971 1.94127,0.0971 6.11497,0.19413 1.55301,0 0,-1.94127 1.0677,-51.34639 0.0971,-5.72672 0,-1.8442 0.0971,-1.26182 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'NV' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="NV"
                    data-name="Nevada"
                    data-id="NV"
                    d="m 294.82662,295.8307 10.09457,-62.79983 5.14434,-31.44846 0.58238,-3.10601 -2.81483,-0.48532 -10.96813,-2.03833 -27.46887,-5.43553 -2.71776,-0.58238 -2.71777,-0.58238 -13.6859,-3.00895 -24.55697,-5.82379 -2.71777,-0.67944 -0.87357,3.68839 -13.20058,56.00542 11.45345,16.50074 11.8417,16.40366 20.96563,30.08957 15.04479,21.15976 7.76505,10.38575 2.52364,3.39721 0,-0.29119 1.55301,-3.30014 0.0971,-15.43304 4.27078,-3.59133 3.39721,3.00895 2.23245,0.0971 4.27078,-18.83025 0,-0.19413 0.48531,-3.10602 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'NM' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="NM"
                    data-name="New Mexico"
                    data-id="NM"
                    d="m 472.45213,324.75551 0.0971,-2.52364 0.0971,-2.52364 0.0971,-2.52364 -3.10602,-0.0971 -21.45095,-0.97063 -21.54801,-1.35889 -48.91981,-4.27077 -3.00896,-0.29119 -0.38825,3.49427 -7.27974,75.12685 -0.67944,7.08561 -2.71777,28.63362 0.38826,0.0971 13.39471,1.26183 1.26182,-6.79442 2.42658,-1.94127 27.17767,2.42658 0.19413,0 -2.42658,-4.75609 12.32701,0.87357 30.76901,1.74713 19.2185,0.87357 3.30015,-91.0452 0.67944,0.0971 0.0971,-2.62071 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'OR' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="OR"
                    data-name="Oregon"
                    data-id="OR"
                    d="m 162.2384,162.75717 15.43304,4.65903 41.54301,11.45344 3.78546,0.97064 2.71777,0.67944 24.55697,5.82379 13.6859,3.00895 2.71777,0.58238 0.38825,-2.03832 9.221,-38.24287 -2.62071,-6.21204 0.29119,-2.42658 10.09457,-13.20059 4.75609,-11.93876 -3.30015,-3.59134 -0.0971,-1.84419 0,-0.0971 -1.8442,-0.38825 -27.27474,-6.21204 -1.45594,0.67944 -5.33848,-0.87357 -10.774,1.16476 -6.60029,-0.87357 -6.98855,-0.0971 -0.58238,-1.74714 -14.75359,-1.35888 -5.24141,-2.81483 -0.67944,-1.8442 0.58238,-7.279734 -3.49428,-3.785461 -0.29118,0.09706 -0.67945,0.485315 -4.85315,-2.523641 -2.9119,0.873568 -1.94126,-0.970631 -2.03832,8.347429 -1.35889,2.329514 -6.01791,14.656531 -1.74714,8.05624 -1.06769,0.0971 -5.62966,13.39471 -3.78546,5.72672 -1.35889,0.97063 -3.49427,6.79442 -0.67944,7.18267 -2.13539,6.40617 1.26182,5.82378 0,0.0971 z m 35.5251,-79.688825 -0.29119,-0.873568 -0.0971,0.679442 0.38825,0.194126 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'UT' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="UT"
                    data-name="Utah"
                    data-id="UT"
                    d="m 352.38505,204.97962 -25.04228,-3.78546 -13.97709,-2.23245 -2.71777,-0.48531 -0.58238,3.10601 -5.14434,31.44846 -10.09457,62.79983 -0.48531,3.10602 2.52364,0.38826 25.04228,3.97958 17.56843,2.52365 32.71027,4.07665 2.52364,0.29119 0.19413,-2.52364 0.7765,-7.66799 1.8442,-17.66549 5.24141,-50.56988 0.29119,-2.52365 -1.94126,-0.19412 -24.7511,-3.00896 -3.78546,-0.48531 2.42658,-18.92731 0.19412,-1.26182 -2.81483,-0.38826 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'WY' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="WY"
                    data-name="Wyoming"
                    data-id="WY"
                    d="m 461.38694,192.16729 0.7765,-15.14184 0.97063,-20.38326 0.0971,-2.52364 -1.26182,-0.0971 -24.94522,-1.45595 -13.97709,-1.16476 -26.49823,-2.52364 -33.19559,-4.07665 -1.35888,9.51219 -0.0971,0.58237 -0.38825,3.20309 -1.74714,12.52114 -3.30015,25.23641 -0.87357,6.3091 -0.38825,3.20309 -0.19412,1.26182 -2.42658,18.92731 3.78546,0.48531 24.7511,3.00896 1.94126,0.19412 2.32951,0.29119 23.97459,2.32952 19.2185,1.55301 28.82775,1.8442 1.94126,0.0971 0.0971,-2.52364 0.48532,-10.19163 0.87357,-17.76255 0.38825,-7.57092 0.0971,-2.52364 0.0971,-2.62071 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'AR' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="AR"
                    data-name="Arkansas"
                    data-id="AR"
                    d="m 690.4559,328.05566 -10.48282,1.55301 4.27078,-6.79442 -1.8442,-3.78546 -36.98105,3.59134 -31.25432,2.52364 -4.56197,0.29119 0.58238,2.71776 3.78546,19.60675 0.0971,4.36784 1.0677,26.40117 0.0971,4.36784 0.29119,0.0971 1.45595,1.55301 5.82378,-0.19413 0.58238,8.54155 0.19413,2.42658 3.00896,-0.29119 9.22099,-0.67944 36.5928,-3.39721 0.19412,0 -0.0971,-2.13539 0.97063,-0.67944 -1.74713,-3.30014 3.6884,-15.5301 -1.45595,-1.74714 5.5326,-6.11498 -0.38826,-5.2414 4.07665,-6.79442 0,-0.0971 -0.19412,-0.19412 3.49427,-3.20309 -0.97063,-3.88252 2.71777,-4.27078 -0.58238,-3.97959 2.91189,-5.62966 0,-0.0971 -0.0971,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'IA' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="IA"
                    data-name="Iowa"
                    data-id="IA"
                    d="m 661.53109,197.69989 -5.33847,-2.81483 -2.9119,-3.97959 -0.97063,-5.72672 0.77651,-2.62071 -2.81483,-3.39721 0,0 -4.7561,0.48532 -47.75505,3.97959 -19.12144,1.06769 -4.85315,0.29119 -2.03833,0.0971 1.65008,10.77401 -1.35889,5.14435 2.13539,3.20308 0,0.67944 0.67944,0.0971 3.10602,9.12394 3.00896,4.75609 0.19413,5.43554 3.30014,4.56196 -0.58238,1.94126 3.00896,12.22996 0,0.29119 0,0 19.89794,-0.58238 21.25682,-1.8442 20.86857,-2.62071 4.7561,4.17372 0.19412,0.19412 0.87357,-0.38825 -0.67944,-3.78546 3.59133,-2.23245 1.45595,-9.90044 -1.45595,-0.67944 0.87357,-5.04728 4.36784,-0.87357 4.85316,-3.49427 2.13539,-6.11498 0.0971,-3.10602 -3.88252,-3.6884 -1.16476,-2.32951 -3.6884,-2.32952 0.19413,-0.48531 0.0971,-0.48532 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'KS' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="KS"
                    data-name="Kansas"
                    data-id="KS"
                    d="m 608.92288,312.71969 -2.42658,-41.0577 -4.36784,-2.52364 -0.38825,-1.94127 -3.49428,-3.10602 3.39721,-4.17371 -1.35888,-2.42658 -2.52364,0.0971 -2.32952,-1.65008 -0.97063,-0.7765 -3.30014,0.19412 -35.81629,1.35889 -16.40367,0.38825 -32.61321,0 -13.10352,-0.19413 -3.6884,-0.0971 0,1.8442 -0.0971,5.72672 -1.0677,51.34639 0,1.94127 4.17372,0.0971 22.51864,0.29119 52.70528,-0.77651 37.56342,-1.74713 3.6884,-0.29119 -0.0971,-2.52364 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'MO' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="MO"
                    data-name="Missouri"
                    data-id="MO"
                    d="m 653.66898,242.44599 -4.7561,-4.17372 -20.86857,2.62071 -21.25682,1.8442 -19.89794,0.58238 0,0 -0.0971,0.58238 2.42657,4.65903 2.23246,1.553 2.6207,4.65903 0.38825,0.38826 0.97063,0.7765 2.32952,1.65008 2.52364,-0.0971 1.35888,2.42658 -3.39721,4.17371 3.49428,3.10602 0.38825,1.94127 4.36784,2.52364 2.42658,41.0577 0.0971,2.52364 0.19413,2.52364 0.0971,2.52364 0.19413,2.6207 0.0971,2.52365 4.56197,-0.29119 31.25432,-2.52364 36.98105,-3.59134 1.8442,3.78546 -4.27078,6.79442 10.48282,-1.55301 0.0971,0 0,-0.7765 0.19413,-4.46491 1.94126,-2.42658 -0.58238,-2.71776 -0.0971,-0.0971 -0.0971,-0.0971 0.38825,-1.26182 0.58238,0.19413 0.29119,0.7765 -0.0971,0.29119 0,0.0971 0,0.77651 0.38826,0.0971 0.7765,-0.97063 0,-0.0971 0.0971,-0.29119 2.52364,-1.55301 0.38826,-0.19413 0.87357,-7.95917 -0.19413,-0.38826 -0.29119,-0.0971 -6.89148,-5.62966 1.06769,-2.03833 -1.94126,-5.53259 -3.49427,-2.71777 -6.60029,-2.9119 -4.17372,-3.3972 0.48532,-6.98855 1.26182,-6.50323 -6.98855,0.38825 -2.13539,-2.23245 -0.97063,-4.4649 -11.06519,-9.31806 -3.10602,-8.63862 0.7765,-4.27078 0,0 -0.19412,-0.19412 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'NE' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="NE"
                    data-name="Nebraska"
                    data-id="NE"
                    d="m 572.33008,204.68843 -3.00895,-3.00895 -10.57988,-3.10602 -3.39721,-0.0971 -5.14435,1.45594 -6.11498,-3.88252 -19.12143,0.19412 -27.85712,-0.29119 -32.90439,-1.06769 -2.9119,-0.0971 -0.0971,2.52364 -0.38825,7.57092 -0.87357,17.76255 -0.48532,10.19163 -0.0971,2.52364 2.32952,0.0971 23.6834,0.87357 4.65903,0.19413 -0.38826,19.02437 -0.0971,1.26182 3.6884,0.0971 13.10352,0.19413 32.61321,0 16.40367,-0.38825 35.81629,-1.35889 3.30014,-0.19412 -0.38825,-0.38826 -2.6207,-4.65903 -2.23246,-1.553 -2.42657,-4.65903 0.0971,-0.58238 0,-0.29119 -3.00896,-12.22996 0.58238,-1.94126 -3.30014,-4.56196 -0.19413,-5.43554 -3.00896,-4.75609 -3.10602,-9.12394 -0.67944,-0.0971 -1.8442,-0.19413 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'OK' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="OK"
                    data-name="Oklahoma"
                    data-id="OK"
                    d="m 609.50526,322.91131 -0.19413,-2.6207 -0.0971,-2.52364 -0.19413,-2.52364 -3.6884,0.29119 -37.56342,1.74713 -52.70528,0.77651 -22.51864,-0.29119 -4.17372,-0.0971 -1.55301,0 -6.11497,-0.19413 -1.94127,-0.0971 -4.07665,-0.0971 -1.94126,-0.0971 -0.0971,2.52364 -0.0971,2.52364 -0.0971,2.52364 -0.0971,2.62071 0.58238,0 23.48927,0.58238 24.84816,0.29119 0.29119,33.19558 1.74714,5.82379 3.88252,3.6884 4.17372,0.19413 0.87356,-1.74714 5.72673,5.24141 7.47386,0.7765 1.35888,1.55301 2.71777,-1.26182 6.79442,3.20309 0,1.84419 2.52364,-0.0971 2.6207,-2.23245 4.85316,3.10602 4.56197,1.65007 3.10601,-4.27077 9.90044,4.65902 3.6884,-3.00895 3.00896,-1.16476 2.42658,0.58238 9.12393,-2.6207 4.85316,2.03832 4.36784,2.81483 3.78546,0.67944 0.0971,0 -0.0971,-4.36784 -1.0677,-26.40117 -0.0971,-4.36784 -3.78546,-19.60675 -0.58238,-2.71776 -0.0971,-2.52365 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>   
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'SD' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="SD"
                    data-name="South Dakota"
                    data-id="SD"
                    d="m 566.89455,135.57949 -16.40367,0.48532 -39.50469,0.29119 -42.80484,-1.16476 -3.78546,-0.19413 -0.0971,2.23246 -0.38825,8.83274 -0.29119,6.69736 -0.0971,1.35888 -0.29119,0 -0.0971,2.52364 -0.97063,20.38326 -0.7765,15.14184 -0.0971,2.62071 2.9119,0.0971 32.90439,1.06769 27.85712,0.29119 19.12143,-0.19412 6.11498,3.88252 5.14435,-1.45594 3.39721,0.0971 10.57988,3.10602 3.00895,3.00895 1.8442,0.19413 0,-0.67944 -2.13539,-3.20308 1.35889,-5.14435 -1.65008,-10.77401 2.03833,-0.0971 -0.19413,-4.4649 -4.85315,-34.16622 -2.52364,-4.27078 3.88252,-6.40616 0.0971,-0.29119 -3.30014,0.19412 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'LA' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="LA"
                    data-name="Louisiana"
                    data-id="LA"
                    d="m 702.00641,462.68221 -0.29119,0.19412 h 0.48532 z m -34.36034,0.29119 1.45594,-1.8442 -3.97959,-1.0677 -1.74713,1.45595 z m 40.28119,-8.44449 -0.38825,-0.38826 -0.0971,0.19413 0.48532,0.19413 z m 1.06769,-1.74714 -0.97063,-0.29119 0.29119,0.97063 z m -0.58237,-7.47386 -0.19413,0.19413 h 0.0971 l 0.0971,-0.19413 z m -35.8163,-54.35535 h -0.19412 l -36.5928,3.39721 -9.22099,0.67944 -3.00896,0.29119 0.0971,2.32952 1.94126,18.73318 3.20309,4.4649 0.0971,2.62071 3.10602,5.43553 2.52364,7.95918 -0.87357,4.4649 -0.67944,11.0652 -1.45594,3.59133 h 0.19412 l 0.29119,2.52364 -1.65007,2.32952 12.03582,-1.35889 9.41513,2.62071 6.69735,0.87357 3.39721,-2.42658 -1.8442,-2.42658 6.21204,-1.94126 -0.19412,2.13539 3.20308,-0.77651 2.6207,4.07665 2.23245,-0.7765 5.82379,3.97959 -3.59133,1.26182 8.25036,2.42657 h 3.10602 l 1.8442,-2.23245 3.97959,-2.13539 2.81483,4.07666 1.94126,-3.6884 -0.58238,-5.82379 5.24141,2.03833 0.58238,1.74713 6.21204,0.77651 3.10602,2.52364 -0.38825,2.03832 4.36784,-4.07665 -1.65008,-2.13539 -7.27973,-1.8442 -2.71777,-1.55301 -0.0971,-2.91189 3.00896,0.38825 2.32951,-4.75609 -3.00896,-4.17371 -1.65007,3.97958 -3.78546,-0.67944 2.6207,-4.27078 -1.74713,-0.48531 -4.27078,3.00896 -6.11498,0.38825 -1.74713,-1.35889 2.81483,-4.95021 3.30014,-0.0971 5.62967,1.8442 4.07665,0.38825 v 0 l -2.23245,-2.81483 -4.27078,-8.34742 1.16476,-4.65903 -33.48678,3.68839 1.26182,-1.26182 -1.35888,-3.49427 2.03832,-3.00896 1.16476,-7.57092 7.3768,-12.6182 -3.59134,-4.36784 0.19413,-3.20309 -2.23246,-5.24141 v -0.67944 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'TX' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="TX"
                    data-name="Texas"
                    data-id="TX"
                    d="m 573.98015,536.93549 -4.65902,-17.56842 0,3.30015 4.65902,14.26827 z m -1.06769,-30.86607 -3.30015,6.21204 -0.38825,2.03833 3.6884,-8.25037 z m 2.6207,-4.56196 3.10602,-4.07666 -2.23245,1.35889 -0.87357,2.71777 z m 10.96814,-9.90044 -7.27974,3.78546 2.03833,-0.38825 5.24141,-3.39721 z m 0.97063,-1.35889 2.03832,-1.65007 -0.7765,0.19413 -1.26182,1.45594 z m -115.11686,-162.87191 -0.67944,-0.0971 -3.30015,91.0452 -19.2185,-0.87357 -30.76901,-1.74713 -12.32701,-0.87357 2.42658,4.75609 0.0971,0.0971 10.48282,10.48281 6.01791,7.08561 7.95917,5.92085 5.62967,10.28869 2.13538,10.77401 4.56197,3.00895 3.59134,3.97959 5.14434,1.8442 7.47386,4.75609 3.39721,1.26183 4.65903,-4.65903 1.45595,-4.95022 2.42658,-4.7561 7.57092,-3.00895 2.91189,1.45594 8.44449,0.67945 7.66799,4.75609 5.24141,0.97063 -1.45595,2.71777 3.00896,1.94126 2.81483,3.39721 0.58238,3.59133 1.8442,2.42658 4.27077,10.28869 4.27078,3.59134 3.30015,5.43553 4.17371,4.27078 1.8442,0.58238 1.55301,11.06519 4.56197,2.52365 0.19412,3.49427 1.16476,-0.29119 7.95918,9.70631 3.97959,0.87357 5.04728,3.00896 7.76505,0 5.62966,3.10601 6.69735,-1.45594 -3.00895,-2.81483 -2.71777,-8.1533 -1.06769,-7.08561 -1.55301,-2.32952 0.67944,-4.75609 -2.03833,-0.19413 -2.71777,-4.4649 3.10602,3.30015 3.59134,-1.26182 1.94126,-5.14435 -3.88252,-5.24141 5.82378,0.67944 2.71777,-4.17371 -0.38825,-1.45595 2.42658,-3.20308 -0.58238,2.81483 2.71777,-2.13539 -1.0677,-3.78546 3.49427,1.8442 4.46491,-2.52364 -4.36784,-4.56197 2.71776,1.0677 5.04729,0.29119 6.60029,-1.45595 7.3768,-4.95022 4.4649,-3.6884 0.67944,-2.71777 2.71777,-2.81483 -1.45595,-4.65903 0.29119,-2.91189 4.85316,-2.13539 -0.38826,5.14435 2.9119,0 -3.20308,2.71776 12.90939,-6.79441 2.13539,-0.0971 1.35888,-6.21204 0.38826,0 1.45594,-3.59133 0.67944,-11.0652 0.87357,-4.4649 -2.52364,-7.95918 -3.10602,-5.43553 -0.0971,-2.62071 -3.20309,-4.4649 -1.94126,-18.73318 -0.0971,-2.32952 -0.19413,-2.42658 -0.58238,-8.54155 -5.82378,0.19413 -1.45595,-1.55301 -0.29119,-0.0971 -0.0971,0 -3.78546,-0.67944 -4.36784,-2.81483 -4.85316,-2.03832 -9.12393,2.6207 -2.42658,-0.58238 -3.00896,1.16476 -3.6884,3.00895 -9.90044,-4.65902 -3.10601,4.27077 -4.56197,-1.65007 -4.85316,-3.10602 -2.6207,2.23245 -2.52364,0.0971 0,-1.84419 -6.79442,-3.20309 -2.71777,1.26182 -1.35888,-1.55301 -7.47386,-0.7765 -5.72673,-5.24141 -0.87356,1.74714 -4.17372,-0.19413 -3.88252,-3.6884 -1.74714,-5.82379 -0.29119,-33.19558 -24.84816,-0.29119 -23.48927,-0.58238 -0.58238,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'CT' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="CT"
                    data-name="Connecticut"
                    data-id="CT"
                    d="m 936.99622,143.34454 -13.97709,5.33847 -0.19412,-0.48531 -7.86211,2.32951 -1.74714,0.48532 0.19413,0.97063 3.68839,14.26828 1.16476,1.45595 -2.52364,3.10602 1.74714,1.65007 0,0 5.62966,-5.43554 3.00895,-4.17371 0.58238,1.16476 14.17122,-6.30911 0.29119,-0.29118 -0.0971,-2.32952 -0.58237,-2.03833 -3.00896,-8.44449 -0.38825,-1.06769 -0.0971,-0.19413 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'NH' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="NH"
                    data-name="New Hampshire"
                    data-id="NH"
                    d="m 923.8927,75.982738 -1.26182,1.55301 -1.45594,-0.29119 -0.77651,6.406166 0,0.09706 2.32952,8.735681 -0.19413,1.747136 -4.17372,5.532598 1.0677,5.047281 0,6.30911 -0.77651,5.82378 4.36784,15.91836 0,0 0,0 3.97959,-1.26182 12.22996,-4.07666 5.53259,-6.01791 0,0 0,-1.55301 0.29119,-2.52364 -0.67944,0.29119 -0.0971,-0.58238 -6.11498,-7.47386 -0.19413,-0.67944 -14.07415,-33.001465 0,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'RI' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="RI"
                    data-name="Rhode Island"
                    data-id="RI"
                    d="m 946.50841,152.08022 -0.0971,-2.03832 -0.29119,0.7765 0.38825,1.26182 z m 1.94126,-1.55301 -1.26182,-2.42657 -0.0971,2.52364 1.35888,-0.0971 z m -0.58238,-3.00895 0.67944,1.74713 0.87357,1.55301 0.58238,-1.16475 -0.87357,-1.65008 -0.29119,-1.16475 -0.97063,0 0,0.67944 z m -10.774,-3.97959 0.38825,1.06769 3.00896,8.44449 0.58237,2.03833 0.0971,2.32952 0.19412,-0.29119 4.65903,-3.6884 -0.87356,-6.60029 1.94126,-0.38826 0,0 -4.27078,-5.14434 -4.4649,1.74713 -1.26182,0.48532 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'VT' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="VT"
                    data-name="Vermont"
                    data-id="VT"
                    d="m 923.01913,132.86173 -4.36784,-15.91836 0.77651,-5.82378 0,-6.30911 -1.0677,-5.047278 4.17372,-5.532598 0.19413,-1.747136 -2.32952,-8.735681 -1.26182,0.485316 -5.33847,1.941262 -5.24141,2.038326 -12.03583,4.36784 -0.67944,0.194126 4.36784,10.191633 1.45595,9.60924 5.14434,8.05624 4.85316,15.91835 0.19413,-0.0971 0.7765,-0.29119 2.23245,-0.67944 1.94126,-0.67944 5.5326,-1.65007 0.67944,-0.29119 0,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'AL' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="AL"
                    data-name="Alabama"
                    data-id="AL"
                    d="m 718.31301,344.84758 0.38826,0.77651 1.35888,0.87356 0.58238,39.79588 0.19413,21.8392 4.95021,29.89545 0.38826,-0.0971 4.36784,0.87357 1.16475,-8.63862 1.94127,4.85316 3.30014,3.00896 6.30911,-3.6884 -0.67945,-0.58238 0.19413,0.0971 -4.36784,-9.9975 41.93127,-6.79442 2.81483,-0.48531 0,-0.0971 -2.62071,-4.95022 -0.19412,-7.0856 -2.13539,-3.88253 1.06769,-7.57092 1.74714,-1.94126 -7.18267,-12.81234 -13.00646,-39.60175 -0.0971,-0.19413 -2.9119,0.48532 -15.5301,2.52364 -7.76504,0.97063 -16.30661,2.23245 0.0971,0.19413 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'FL' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="FL"
                    data-name="Florida"
                    data-id="FL"
                    d="m 882.64092,517.81397 v -0.0971 l -0.19413,0.38825 0.19413,-0.29119 z m -2.03833,-0.77651 h -0.29119 l -0.0971,0.0971 0.38825,-0.0971 z m 0.77651,-0.48531 v 0 h -0.0971 z m -8.15331,0.38825 v -0.19412 l -0.0971,0.19412 z m 0.87357,-0.29119 h -0.29119 l 0.29119,0.58238 z m -2.32951,0.0971 v -0.58238 l -0.48532,0.0971 0.48532,0.48532 z m -1.35889,-0.97064 0.48532,0.48532 v -0.19413 z m 14.26828,0.58238 -1.74713,0.77651 0.58237,0.0971 1.16476,-0.87357 z m -13.58883,-0.87356 h -0.58238 v 0.19412 z m 15.33597,-4.85316 0.0971,-0.48532 0.0971,-1.26182 -0.19412,1.74714 z m -40.47528,-16.30661 -0.77651,-1.16475 0.29119,0.87357 z m 3.00895,1.94127 -1.35888,-3.10602 -0.97063,-0.29119 z m -3.88252,-3.88253 -0.29119,-0.7765 -0.19413,-0.48532 z m -8.05624,-10.774 -1.74714,-1.26182 0.67945,0.67944 z m 43.6784,-6.50323 -7.0856,-11.8417 h -0.38826 z m -92.79234,-30.86612 2.91189,-2.23245 -3.20308,2.13539 0.29119,0.0971 z m 5.82379,-4.65902 0.29119,-0.29119 -1.16476,0.48531 z m -36.88399,-6.50323 -10.57988,3.39721 5.82379,-1.65008 z m 26.30411,-16.50073 -2.81483,0.48531 -41.93127,6.79442 4.36784,9.9975 0.29119,0.0971 -1.06769,3.97959 3.10602,-1.35888 3.3972,-3.00896 5.82379,-0.19412 6.69736,-2.42658 4.56196,0.67944 -1.06769,1.65007 8.34743,2.81483 7.18267,3.49428 1.65007,3.88252 5.33847,-1.16476 12.61821,-10.28869 4.65903,0.19413 19.02437,14.36534 3.88252,-0.77651 4.07666,5.43554 0.7765,8.63862 -1.26182,5.43553 0.58238,2.71777 3.39721,6.79442 -1.55301,-5.33847 4.36784,-0.0971 0.38825,3.88253 -2.32951,6.01791 8.05624,11.0652 3.00895,0.0971 -2.52364,-3.39721 3.10602,0.38825 1.8442,-1.16475 -0.7765,6.21204 4.17371,3.30014 2.81483,7.57093 3.78546,2.32951 4.85316,1.26182 6.69735,8.54156 3.49428,1.84419 -4.65903,0.29119 2.13538,2.42658 7.66799,-2.52364 3.78546,-2.13539 3.49427,-12.22995 -1.74713,-19.02437 -0.38825,-1.94127 -9.31806,-15.53009 -7.95918,-11.25933 -4.4649,-9.22099 3.78546,3.20308 0.7765,-0.58238 1.65008,8.05624 4.27077,6.11498 -4.17371,-8.1533 0.19413,-3.88253 -12.52115,-15.23891 -3.00895,-4.75609 -3.97959,-8.05624 -2.71777,-6.79442 -2.13539,-2.42658 -0.48531,-3.10602 -0.0971,-0.0971 -6.69735,-0.38825 -2.62071,2.03832 -1.45594,7.47386 -1.35889,-3.49427 -45.81379,5.72672 -3.30014,-5.14434 0.0971,-0.0971 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'GA' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="GA"
                    data-name="Georgia"
                    data-id="GA"
                    d="m 845.85395,396.09691 -0.0971,-2.9119 -0.67944,2.52364 0.7765,0.38826 z m 1.0677,-4.46491 -0.38825,-2.23245 -0.29119,1.35889 0.67944,0.87356 z m -45.42554,-61.14976 -1.26182,0.29119 -3.6884,0.7765 -13.58884,2.81483 -1.26182,0.29119 -1.35888,0.19413 -7.57093,1.45595 -2.03832,0.38825 -8.25037,1.55301 -1.74713,0.19412 0.0971,0.19413 13.00646,39.60175 7.18267,12.81234 -1.74714,1.94126 -1.06769,7.57092 2.13539,3.88253 0.19412,7.0856 2.62071,4.95022 0,0.0971 -0.0971,0.0971 3.30014,5.14434 45.81379,-5.72672 1.35889,3.49427 1.45594,-7.47386 2.62071,-2.03832 6.69735,0.38825 0,0 -0.58237,-10.48282 1.26182,-2.23245 -0.67945,-4.17371 1.35889,-3.97959 2.03832,-2.23245 -1.45594,-1.35889 3.39721,-4.17371 -0.0971,0 -5.82378,-5.43554 -7.95918,-11.35638 -4.36784,-2.03833 -18.73318,-15.72422 -4.56197,-5.82379 -8.83274,-3.6884 -0.48532,-1.94126 2.71777,-5.33847 0,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'MS' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="MS"
                    data-name="Mississippi"
                    data-id="MS"
                    d="m 716.76,442.78427 -0.48531,0.0971 0,0.0971 0.48531,-0.19412 z m 9.02687,-1.16476 -1.35888,0 1.26182,0.0971 0.0971,-0.0971 z m -11.25932,0.97063 -0.38825,0.38825 0.0971,0.0971 0.29119,-0.48532 z m 9.12394,-0.7765 -3.6884,0 3.49427,0.0971 0.19413,-0.0971 z m -40.47533,-92.50116 0,0.0971 -4.07665,6.79442 0.38826,5.2414 -5.5326,6.11498 1.45595,1.74714 -3.6884,15.5301 1.74713,3.30014 -0.97063,0.67944 0.0971,2.13539 0,0.67944 2.23246,5.24141 -0.19413,3.20309 3.59134,4.36784 -7.3768,12.6182 -1.16476,7.57092 -2.03832,3.00896 1.35888,3.49427 -1.26182,1.26182 33.48678,-3.68839 -1.16476,4.65903 4.27078,8.34742 2.23245,2.81483 0,-0.0971 3.59133,-4.07665 7.57093,-1.65007 6.98854,0.7765 1.06769,-1.35888 0,-0.0971 -4.95021,-29.89545 -0.19413,-21.8392 -0.58238,-39.79588 -1.35888,-0.87356 -0.38826,-0.77651 -0.19412,0 -4.85316,0.67944 -8.54155,1.16476 -19.41263,2.42658 -2.13539,0.19412 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'SC' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="SC"
                    data-name="South Carolina"
                    data-id="SC"
                    d="m 801.49611,330.48224 0,0 -2.71777,5.33847 0.48532,1.94126 8.83274,3.6884 4.56197,5.82379 18.73318,15.72422 4.36784,2.03833 7.95918,11.35638 5.82378,5.43554 0,0 0.97063,-4.4649 -1.55301,-4.27078 4.17372,3.10602 2.32951,-1.8442 -3.97959,-3.30015 4.85316,-0.29119 7.57092,-6.40616 -0.87356,-1.65008 4.65903,-3.59133 -0.48532,-1.74714 3.39721,-2.13539 0.19413,-4.95022 5.33847,-9.90043 3.59133,-4.56197 0.38826,-0.19413 -21.64508,-13.6859 -8.05624,1.55301 -10.96813,-0.38825 -5.43554,-2.81483 -32.22495,10.19163 -0.29119,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'IL' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="IL"
                    data-name="Illinois"
                    data-id="IL"
                    d="m 661.43403,198.18521 -0.19413,0.48531 3.6884,2.32952 1.16476,2.32951 3.88252,3.6884 -0.0971,3.10602 -2.13539,6.11498 -4.85316,3.49427 -4.36784,0.87357 -0.87357,5.04728 1.45595,0.67944 -1.45595,9.90044 -3.59133,2.23245 0.67944,3.78546 -0.87357,0.38825 0,0 -0.7765,4.27078 3.10602,8.63862 11.06519,9.31806 0.97063,4.4649 2.13539,2.23245 6.98855,-0.38825 -1.26182,6.50323 -0.48532,6.98855 4.17372,3.3972 6.60029,2.9119 3.49427,2.71777 1.94126,5.53259 -1.06769,2.03833 6.89148,5.62966 0.29119,0.0971 -0.58238,-0.58238 1.94126,-4.56196 7.47386,2.03832 1.8442,-2.13539 -1.45594,-4.27077 6.11497,-3.59134 -1.65007,-2.32951 1.45595,-3.30015 0,-0.29119 -0.38826,-0.0971 0.0971,-8.63862 2.13539,-1.55301 3.68839,-8.63862 -0.7765,-3.78546 -2.42658,-4.56196 1.35888,-5.14435 -6.79441,-47.85212 -0.97064,-1.06769 -2.52364,-5.72673 -2.03832,-2.13539 -0.87357,-5.62966 0,-0.19412 -13.10352,1.8442 -7.86211,0.97063 -21.15976,2.42658 0,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'IN' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="IN"
                    data-name="Indiana"
                    data-id="IN"
                    d="m 750.34384,200.22353 -14.85065,2.62071 -3.39721,0.67944 -12.03583,1.94126 -2.52364,2.03833 -3.78546,1.74713 -1.45595,-0.0971 -1.74714,-0.87357 -0.58237,-0.58238 6.79441,47.85212 -1.35888,5.14435 2.42658,4.56196 0.7765,3.78546 -3.68839,8.63862 -2.13539,1.55301 -0.0971,8.63862 0.38826,0.0971 0.38825,-0.0971 1.45595,-2.71777 3.59133,0 4.36784,-1.45595 5.43554,2.03833 0.58237,-2.23245 3.10602,-2.32952 4.65903,0.67945 2.52365,-4.95022 6.89148,0.58237 -0.0971,-2.81483 6.11498,-8.05623 -0.97063,-3.6884 4.27078,-0.0971 5.2414,-4.17371 -1.26182,-4.75609 0.19413,-0.19413 -0.19413,-1.65007 -5.82378,-34.36035 -2.62071,-14.65653 -0.29119,-1.55301 -0.29119,-1.26182 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'KY' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="KY"
                    data-name="Kentucky"
                    data-id="KY"
                    d="m 693.17367,317.18459 -0.29119,-0.7765 -0.58238,-0.19413 -0.38825,1.26182 0.0971,0.0971 1.06769,-0.0971 0.0971,-0.29119 z m 66.39117,-63.47928 -0.19413,0.19413 1.26182,4.75609 -5.2414,4.17371 -4.27078,0.0971 0.97063,3.6884 -6.11498,8.05623 0.0971,2.81483 -6.89148,-0.58237 -2.52365,4.95022 -4.65903,-0.67945 -3.10602,2.32952 -0.58237,2.23245 -5.43554,-2.03833 -4.36784,1.45595 -3.59133,0 -1.45595,2.71777 -0.38825,0.0971 0,0.29119 -1.45595,3.30015 1.65007,2.32951 -6.11497,3.59134 1.45594,4.27077 -1.8442,2.13539 -7.47386,-2.03832 -1.94126,4.56196 0.58238,0.58238 0.19413,0.38826 -0.87357,7.95917 -0.38826,0.19413 -2.52364,1.55301 -0.0971,0.29119 2.81483,-0.38826 19.60675,-2.6207 -0.97063,-3.88252 3.30015,-0.0971 39.50469,-5.24141 27.76005,-4.65903 0.38825,-0.29119 0.67944,-0.7765 7.27974,-3.88252 5.62966,-7.3768 0.7765,-2.52364 3.6884,-2.9119 4.65903,-5.92085 0.67944,-0.97063 -0.29119,-0.0971 -2.42657,0 -3.10602,-1.74714 -5.5326,-6.69735 -1.94126,-6.79442 0,-0.19413 -0.19413,-0.19412 -4.07665,-2.32952 -1.8442,-3.10602 -3.6884,3.59134 -2.32951,0.58238 -2.9119,-1.16476 -2.52364,1.94126 -5.24141,-2.32951 -1.35888,0.58237 -4.95022,-4.27077 -2.52364,-1.26182 -4.75609,0.58238 -0.77651,0.7765 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'NC' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="NC"
                    data-name="North Carolina"
                    data-id="NC"
                    d="m 890.2118,332.22937 -1.06769,1.0677 0.19412,0.19413 z m 0.7765,-5.62966 -0.48531,0.77651 0.19413,0.7765 z m 5.82379,-9.02687 -1.45594,0.97063 -0.77651,1.16476 z m 12.52114,-6.11497 -0.58237,-0.38826 -1.26182,-0.0971 1.84419,0.48532 z m -2.6207,-0.58238 h -0.87357 l -1.45594,0.7765 z m 3.00896,1.06769 2.81483,-6.98854 -1.94126,2.91189 z m -1.26182,-40.76651 -0.77651,0.19413 v 0 l 0.19413,0.0971 c 1.51574,0.45962 1.19168,-0.33845 1.45594,-0.58238 v 0 l -0.29118,0.0971 h -0.29119 v 0 0.19412 l -0.19413,0.0971 -0.0971,-0.0971 v 0 z m -89.78339,22.13039 -0.48532,1.45595 0.0971,4.17371 -1.0677,-0.0971 -2.52364,5.14435 -2.81483,0.29119 -5.24141,5.14434 -2.32951,-0.87357 -3.00896,4.46491 -7.95917,7.18267 -3.88253,0.97063 -4.07665,3.78546 -0.19413,2.52364 -3.59133,1.94126 0.0971,4.27078 v 0.97063 l 1.26182,-0.29119 13.58884,-2.81483 3.6884,-0.7765 1.26182,-0.29119 h 0.29119 l 32.22495,-10.19163 5.43554,2.81483 10.96813,0.38825 8.05624,-1.55301 21.64508,13.6859 0.38825,-0.29119 9.9975,-4.07665 0.0971,-5.33847 3.59134,-6.50323 3.88252,-3.6884 8.05624,-5.33847 1.0677,-1.94126 2.13538,0.97063 0.97064,-6.40616 -1.16476,2.23245 -4.07665,1.35888 -3.88253,0.0971 4.7561,-3.49427 -1.45595,-1.55301 1.65007,-3.49427 -9.12393,-1.45595 -0.38825,-0.48531 7.76505,-1.45595 2.52364,1.26182 3.20308,-0.29119 2.6207,-1.94126 1.94127,-3.78546 1.74713,-0.48532 -0.29119,-5.33847 -2.23245,-2.13539 -2.23245,2.03833 0.48531,5.14434 -1.65007,-6.3091 -1.26182,-0.29119 -9.60925,3.97959 4.27078,-4.17372 0.19413,-1.65007 4.4649,-1.06769 1.26182,-3.30015 3.00896,1.74714 -3.20309,-4.7561 -2.23245,-1.94126 v 0 l -38.82525,11.0652 -24.75109,6.3091 -25.04229,4.65903 -0.0971,-0.19413 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'OH' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="OH"
                    data-name="Ohio"
                    data-id="OH"
                    d="m 818.19096,206.6297 -2.42657,-10.48282 -0.48532,-2.13539 -2.71777,-11.93876 -3.49427,2.23245 -7.47386,5.72672 -4.85315,5.92085 -3.78547,0.58238 -6.98854,3.97959 -3.88253,-2.32951 -11.74463,-1.35889 0,0 -6.21204,1.55301 -6.11498,1.45595 -6.40617,1.35888 -0.97063,0.29119 0.29119,1.55301 2.62071,14.65653 5.82378,34.36035 0.19413,1.65007 0.77651,-0.7765 4.75609,-0.58238 2.52364,1.26182 4.95022,4.27077 1.35888,-0.58237 5.24141,2.32951 2.52364,-1.94126 2.9119,1.16476 2.32951,-0.58238 3.6884,-3.59134 1.8442,3.10602 4.07665,2.32952 0.19413,0.19412 0,0 4.17371,-2.03832 1.45595,-3.20309 -1.16476,-3.30014 3.30014,-5.04728 2.42658,-0.38826 -0.29119,-4.27077 3.97959,-5.43554 0.67944,0.77651 3.59134,-2.71777 3.10602,-4.65903 0.48531,-21.25682 0.19413,-0.0971 -0.48532,-2.03832 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'TN' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="TN"
                    data-name="Tennessee"
                    data-id="TN"
                    d="m 786.2572,300.48973 -27.76005,4.65903 -39.50469,5.24141 -3.30015,0.0971 0.97063,3.88252 -19.60675,2.6207 -2.81483,0.38826 0,0.0971 -0.7765,0.97063 -0.38826,-0.0971 0,-0.77651 0,-0.0971 -1.06769,0.0971 0.0971,0.0971 0.58238,2.71776 -1.94126,2.42658 -0.19413,4.46491 0,0.7765 0,0.0971 -2.91189,5.62966 0.58238,3.97959 -2.71777,4.27078 0.97063,3.88252 -3.49427,3.20309 0.19412,0.19412 2.13539,-0.19412 19.41263,-2.42658 8.54155,-1.16476 4.85316,-0.67944 0.19412,0 -0.0971,-0.19413 16.30661,-2.23245 7.76504,-0.97063 15.5301,-2.52364 2.9119,-0.48532 1.74713,-0.19412 8.25037,-1.55301 2.03832,-0.38825 7.57093,-1.45595 1.35888,-0.19413 0,-0.97063 -0.0971,-4.27078 3.59133,-1.94126 0.19413,-2.52364 4.07665,-3.78546 3.88253,-0.97063 7.95917,-7.18267 3.00896,-4.46491 2.32951,0.87357 5.24141,-5.14434 2.81483,-0.29119 2.52364,-5.14435 1.0677,0.0971 -0.0971,-4.17371 0.48532,-1.45595 -1.55301,0.29119 -5.5326,1.55301 -6.60029,1.35889 -16.59779,3.39721 -1.74714,0.29118 -0.38825,0.29119 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'VA' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="VA"
                    data-name="Virginia"
                    data-id="VA"
                    d="m 908.75086,270.98255 h 0.29119 l 0.29118,-0.0971 v 0 l -0.19412,-0.48531 -0.38825,0.58238 v 0 z m 0.77653,-31.54552 -1.26182,0.48532 -1.94126,0.87357 -0.67944,0.87356 0.29119,0.0971 -2.32952,14.4624 0.87357,2.32952 1.35888,-6.01792 2.52364,-7.86211 1.16476,-5.14435 v -0.0971 z m -99.4897,36.39867 -0.67944,0.97063 -4.65903,5.92085 -3.6884,2.9119 -0.7765,2.52364 -5.62966,7.3768 -7.27974,3.88252 -0.67944,0.7765 1.74714,-0.29118 16.59779,-3.39721 6.60029,-1.35889 5.5326,-1.55301 1.55301,-0.29119 0.0971,0.19413 25.04229,-4.65903 24.75109,-6.3091 38.82525,-11.0652 v 0 l -0.29119,-0.48531 -0.0971,-0.29119 0.67944,0.67944 v 0 0 l 0.77651,-0.19413 -0.0971,-0.0971 -0.67944,-3.30015 0.48532,0.0971 1.55301,2.91189 v 0 0 l 0.29119,-0.0971 0.19412,-0.0971 -0.38825,-0.7765 -3.97959,-6.11498 -4.95022,0.87357 -2.23245,1.8442 -2.13539,-1.94126 -7.27973,-2.42658 -5.04728,-0.19413 9.80337,-0.87357 5.43554,3.6884 1.55301,-2.42658 -4.36784,-5.53259 3.10602,0.19412 -1.65008,-4.4649 -3.88252,0.19413 -9.221,-7.47386 h -1.16476 l 13.00646,6.40616 -0.87357,-4.4649 0.87357,-1.45595 -6.60029,-2.52364 -5.72672,-0.38825 -2.81483,-2.52364 -2.32952,1.45594 -0.87357,-6.69735 0.97063,0.19412 -0.19412,-5.43553 -0.19413,-0.19413 -0.19413,0.0971 -0.19412,-0.0971 -0.48532,-0.38825 -0.29119,-0.29119 -3.10602,-1.35888 -3.20308,-2.32952 -4.4649,-1.16475 -0.29119,-0.0971 v 0.0971 l -0.58238,4.07665 -9.02687,-3.88253 0.19413,5.62966 -4.95022,9.41513 -3.00896,3.30014 -1.94126,5.72673 -5.92085,-2.03833 -2.9119,13.20058 -2.32951,4.46491 -0.38825,5.82379 -1.74714,2.81483 -6.50323,1.94126 -5.33847,4.17371 -2.52364,0.38825 -2.42658,2.13539 -6.11498,-2.23245 -1.06769,-3.00896 -0.19413,-0.0971 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'WI' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="WI"
                    data-name="Wisconsin"
                    data-id="WI"
                    d="m 705.79187,134.80299 -2.42658,3.00896 -1.45594,4.36784 0.67944,2.42657 z m -74.64154,-20.57738 -2.23245,2.52364 1.0677,11.64757 -6.21204,5.62966 -1.16476,5.43554 3.39721,3.10602 -0.97063,13.39471 3.59133,2.71777 2.32952,0.19412 7.37679,4.46491 4.65903,4.85315 5.92085,3.00896 1.35889,7.47386 v 0.48531 0 l 2.81483,3.39721 -0.77651,2.62071 0.97063,5.72672 2.9119,3.97959 5.33847,2.81483 -0.0971,0.48532 v 0 l 21.15976,-2.42658 7.86211,-0.97063 13.10352,-1.8442 -0.38825,-1.45595 v -4.56197 l -2.62071,-4.85315 -0.67944,-6.11498 1.26182,-6.79442 -0.67944,-5.24141 2.32952,-6.50322 -0.87357,-1.0677 0.19412,-6.01791 1.26182,-4.56197 -1.45594,-1.55301 -2.81483,0.97063 -1.55301,4.07665 -3.6884,2.13539 1.16476,-5.14434 3.30014,-4.36784 0.19413,-1.94127 0.0971,-0.0971 -4.65903,-4.65903 v -6.60029 l -5.24141,-4.27078 -7.18267,-0.48531 -7.3768,-1.94127 -15.91835,-4.85315 -3.10602,-1.74714 -0.29119,0.29119 -4.95022,-0.67944 -1.65007,0.97063 0.67944,-7.08561 -7.95917,4.07665 -9.70631,1.55301 -0.0971,-0.19412 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'WV' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="WV"
                    data-name="West Virginia"
                    data-id="WV"
                    d="m 836.73002,223.71281 -13.78296,3.39721 -4.27078,-18.442 0,0 -0.19413,0.0971 -0.48531,21.25682 -3.10602,4.65903 -3.59134,2.71777 -0.67944,-0.77651 -3.97959,5.43554 0.29119,4.27077 -2.42658,0.38826 -3.30014,5.04728 1.16476,3.30014 -1.45595,3.20309 -4.17371,2.03832 0,0 0,0.19413 1.94126,6.79442 5.5326,6.69735 3.10602,1.74714 2.42657,0 0.29119,0.0971 0.19413,0.0971 1.06769,3.00896 6.11498,2.23245 2.42658,-2.13539 2.52364,-0.38825 5.33847,-4.17371 6.50323,-1.94126 1.74714,-2.81483 0.38825,-5.82379 2.32951,-4.46491 2.9119,-13.20058 5.92085,2.03833 1.94126,-5.72673 3.00896,-3.30014 4.95022,-9.41513 -0.19413,-5.62966 9.02687,3.88253 0.58238,-4.07665 0,-0.0971 0,0 -2.81483,-4.85315 -5.82379,-0.67945 -3.39721,2.62071 0,1.94126 -2.91189,0.67944 -4.27078,3.00896 -2.23245,0.48532 -4.46491,6.3091 -2.23245,-10.19163 -1.94126,0.48532 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'DE' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="DE"
                    data-name="Delaware"
                    data-id="DE"
                    d="m 893.80314,207.69739 0.38825,1.45595 8.05624,23.00396 9.22099,-2.71777 -0.0971,-0.19413 0.19413,0 0.29119,0.0971 0,0 0.19412,-0.0971 -0.19412,-0.38825 -2.32952,-6.21204 -11.35638,-10.774 0.48531,-7.47386 0,0 -2.32951,0 -1.74714,1.35888 -0.7765,1.94126 0,0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'DC' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="DC"
                    data-name="District of Columbia"
                    data-id="DC"
                    d="m 878.17597,229.14834 0.48532,0.38825 0.19412,0.0971 0.19413,-0.0971 0.19413,0.0971 0.67944,0.38825 0.19413,0.29119 0,0.67944 0.19412,0.38825 1.26182,-2.32951 -1.35888,-0.77651 -1.65007,0.0971 -0.38826,0.7765 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'MD' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="MD"
                    data-name="Maryland"
                    data-id="MD"
                    d="m 912.051,229.2454 -0.19412,0.0971 0.19412,0.58238 v 1.16475 -1.8442 0 z m -73.37972,-6.01791 2.23245,10.19163 4.46491,-6.3091 2.23245,-0.48532 4.27078,-3.00896 2.91189,-0.67944 v -1.94126 l 3.39721,-2.62071 5.82379,0.67945 2.81483,4.85315 v 0 l 0.29119,0.0971 4.4649,1.16475 3.20308,2.32952 3.10602,1.35888 0.29119,0.29119 0.38826,-0.7765 1.65007,-0.0971 1.35888,0.77651 -1.26182,2.32951 v 0.0971 l -1.8442,5.62966 6.01792,3.88252 6.01791,0.29119 3.97959,1.8442 -1.65008,-4.65903 -5.14434,-1.74714 -1.26182,-3.97958 3.20308,4.27077 2.62071,0.38826 -2.32952,-2.32952 -1.8442,-6.89148 0.48532,-3.97959 -2.03833,-4.36784 2.13539,-1.74713 1.55301,-5.62967 -0.58238,8.34743 1.65007,2.81483 1.55301,-3.30014 0.87357,5.43553 -1.65007,3.97959 4.75609,1.74714 -4.07665,1.35888 2.13539,3.97959 3.49427,1.16475 1.94126,-3.3972 -0.19412,4.75609 3.30014,-0.0971 2.13539,2.42657 h 0.0971 l 0.67944,-0.87356 1.94126,-0.87357 1.26182,-0.48532 -0.0971,-0.19412 2.52364,-7.47386 v -0.29119 l -0.48532,-1.94127 v -0.0971 l -9.22099,2.71777 -8.05624,-23.00396 -0.38825,-1.45595 -1.65008,0.48532 -6.89148,2.13539 -37.95168,10.57988 -6.89148,1.8442 -1.74714,0.48531 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'NJ' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="NJ"
                    data-name="New Jersey"
                    data-id="NJ"
                    d="m 913.79814,173.91943 -10.19163,-2.52365 -1.74714,-0.48531 -1.65007,-0.38825 v 0 l -4.07665,9.02687 1.74714,2.13539 -0.0971,6.50322 1.8442,0.29119 3.78546,9.90044 -0.19412,0.29119 -4.75609,6.98855 0.48531,5.33847 11.45345,3.88252 0.0971,4.46491 2.62071,-3.6884 0.38825,-5.33847 2.71777,-1.8442 -1.0677,-3.97959 2.03833,-4.75609 v -10.38576 l -0.67944,-3.39721 -4.56197,0.0971 1.16476,-4.65903 0.67944,-7.47386 v 0 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'NY' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="NY"
                    data-name="New York"
                    data-id="NY"
                    d="m 913.50695,181.78154 -1.45595,2.03832 -0.38825,0.58238 z m 13.39471,-4.75609 4.85316,-4.27078 v -0.19413 z m -12.71527,3.00895 v -3.30014 l -0.29119,1.74713 z m 22.42158,-17.18013 -6.50323,6.01791 -9.9975,4.27078 -2.6207,2.23245 -0.19413,2.13539 -2.71777,2.23245 0.38826,2.9119 4.17371,-1.65008 6.11498,-4.95022 6.79441,-3.59133 10.2887,-9.70631 -7.27974,5.53259 -2.32951,0.97064 z m 3.00896,-4.07665 0.38825,-0.58238 -1.16476,1.35888 z m -109.09895,-3.59134 -1.55301,-0.19412 1.16476,1.55301 z m -8.34743,18.442 0.67944,2.91189 5.14435,1.26182 29.50719,-8.05624 29.70131,-8.92981 5.43554,4.17372 1.06769,2.42658 6.3091,2.71776 0.19413,0.38826 1.65007,0.38825 1.74714,0.48531 10.19163,2.52365 -0.19413,-0.48532 0.87357,3.97959 1.94126,-0.48532 1.0677,-4.36784 v -0.0971 l -1.74714,-1.65007 2.52364,-3.10602 -1.16476,-1.45595 -3.68839,-14.26828 -0.19413,-0.97063 -0.48532,-0.29119 -0.29119,-4.27078 -0.29119,-4.65903 -0.29118,-5.04728 v -0.29119 l -0.19413,0.0971 -4.85316,-15.91835 -5.14434,-8.05624 -1.45595,-9.60924 -4.36784,-10.191633 -0.58238,0.29119 -20.28619,6.794418 -4.07665,4.367845 -4.56197,8.73568 0.19413,1.94126 -6.01791,9.12393 3.68839,1.26182 1.0677,6.89148 -4.27078,5.62967 -12.81233,7.76504 -2.42658,-0.97063 -9.51218,1.35889 -8.83275,5.33847 0.48532,2.81483 3.10602,2.71777 -1.74714,8.54155 -6.98854,8.1533 -0.0971,0.0971 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'PA' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="PA"
                    data-name="Pennsylvania"
                    data-id="PA"
                    d="m 900.01517,170.13396 -6.3091,-2.71776 -1.06769,-2.42658 -5.43554,-4.17372 -29.70131,8.92981 -29.50719,8.05624 -5.14435,-1.26182 -0.67944,-2.91189 -1.65007,1.26182 -2.6207,1.8442 -4.7561,4.85315 -0.58238,0.48532 2.71777,11.93876 0.48532,2.13539 2.42657,10.48282 0.48532,2.03832 0,0 4.27078,18.442 13.78296,-3.39721 1.94126,-0.48532 1.74714,-0.48531 6.89148,-1.8442 37.95168,-10.57988 6.89148,-2.13539 1.65008,-0.48532 0,0 0.7765,-1.94126 1.74714,-1.35888 2.32951,0 0.29119,-0.87357 3.78546,-4.27078 0.38825,-0.67944 0.29119,-0.19413 -3.78546,-9.90044 -1.8442,-0.29119 0.0971,-6.50322 -1.74714,-2.13539 4.07665,-9.02687 0,0 -0.19413,-0.38826 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'ME' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="ME"
                    data-name="Maine"
                    data-id="ME"
                    d="m 980.28638,61.326198 h -0.87357 l 0.97063,0.291189 -0.0971,-0.291189 z m 1.45594,0.970631 -0.29119,-1.747136 -0.7765,-0.09706 1.06769,1.8442 z m -1.55301,-1.55301 -0.19412,-1.844199 -0.67945,1.26182 z m -56.29661,15.23891 14.07415,33.001461 0.19413,0.67944 6.11498,7.47386 v -0.0971 l 0.97063,-0.29119 0.19413,-5.5326 1.55301,-1.94126 0.97063,-5.14435 -0.87357,-0.87357 1.65007,-5.047277 5.62966,-2.620704 3.6884,-4.464904 1.35888,-7.765049 5.92085,-0.388253 -0.7765,-3.979588 7.3768,-2.81483 0.48531,-4.36784 1.74714,0.388252 4.85315,-3.979588 2.13539,-5.144345 -4.95022,-4.950219 -5.2414,-1.067695 -1.94127,-3.979588 V 50.74628 l -3.20308,0.970632 -3.59134,-1.261821 v -3.979588 l -9.70631,-20.965634 -7.0856,-3.688398 -7.86212,6.600292 -2.13539,-0.388253 -1.8442,-3.397209 -2.52364,0.970631 -3.59133,17.859614 1.26182,5.823788 1.06769,11.8417 -2.81483,9.123934 1.94126,1.455946 -2.32951,4.464904 -2.52364,-0.388253 -0.19413,0.194127 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'MI' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="MI"
                    data-name="Michigan"
                    data-id="MI"
                    d="m 720.06015,205.46494 12.03583,-1.94126 3.39721,-0.67944 14.85065,-2.62071 0.29119,1.26182 0.97063,-0.29119 6.40617,-1.35888 6.11498,-1.45595 6.21204,-1.55301 -0.0971,-0.29119 3.20309,-6.3091 -0.29119,-5.24141 3.59133,-9.02687 2.81483,1.65007 1.0677,-2.03832 -0.29119,-7.76505 -2.62071,-4.85316 -3.88252,-10.28869 -3.39721,-3.78546 -1.74714,-0.48531 -6.3091,4.36784 0.67944,0.87356 -3.30014,6.21204 -3.20309,-0.58238 -0.97063,-6.50322 1.35889,-0.48532 2.81483,-6.50323 0.29119,-11.45345 -4.36784,-9.70631 -9.70632,-1.65007 -0.97063,-1.45595 -9.02687,-2.6207 -4.07665,5.04728 0.38825,4.36784 -3.10602,3.88252 0.67945,6.01792 -3.00896,2.13539 v -7.57093 l -2.71777,5.72673 -3.20308,5.04728 -2.13539,1.65007 1.06769,5.33847 -1.35888,5.5326 0.77651,6.89148 -0.97064,3.39721 6.98855,13.39471 0.87357,5.14435 -0.87357,9.51218 -4.65903,10.67695 -0.58238,0.38825 z m 20.77151,-87.45387 -2.52364,0.19412 1.55301,1.16476 z m 2.23245,-9.80338 -0.97063,-1.55301 -0.38825,0.0971 1.35888,1.45594 z m -87.93919,7.08561 3.10602,1.74714 15.91835,4.85315 7.3768,1.94127 7.18267,0.48531 5.24141,4.27078 v 6.60029 l 4.65903,4.65903 v -0.0971 l 3.78546,-10.96814 4.56197,-3.20308 3.49427,-3.88252 0.58238,3.49427 3.59134,-5.5326 8.63861,-3.30014 0.67945,-1.35889 8.73568,1.0677 3.39721,1.74713 1.65007,-4.27077 1.55301,0.97063 6.79442,-1.0677 -1.65008,-2.71777 -3.00895,-1.74713 0.58238,-6.3091 -5.92085,3.30014 -5.43554,-0.67944 -1.74714,-4.17371 0.58238,-1.358888 -7.37679,3.494268 -4.7561,0.29119 -8.54155,5.24141 -0.97063,1.94126 -5.24141,-1.26182 -3.30015,1.45595 -6.60029,-5.72672 -14.65653,-4.46491 -0.29119,-1.747133 -9.41512,9.026873 -5.33847,1.35888 -7.57093,5.72673 -0.29119,0.19412 z m 34.36035,-22.033327 -11.35639,5.629661 3.78546,3.688396 1.45595,-3.688396 3.88253,-4.756093 z M 676.77,79.962326 l -7.76505,5.338471 -0.38825,2.620704 6.11497,-4.464903 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                <Whisper trigger='hover'  speaker={<Popover className={(popupState !== 'AK' || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                    className = 'mapState'
                    onClick={(e) => {handleClick(e)}}
                    onMouseEnter={(e) => {handleMouseEnter(e)}}
                    onMouseOut={(e) => {handleMouseLeave(e)}}
                    id="AK"
                    data-name="Alaska"
                    data-id="AK"
                    d="m 159.03532,548.77728 0.0971,-0.19413 -0.19413,-0.0971 0.0971,0.29119 z m -2.42658,-0.87357 -3.39721,3.00895 2.42658,-0.19412 2.81483,-2.23245 z m 6.11498,1.06769 -0.67945,-0.19412 0.48532,0.38825 z m 1.35888,0.0971 -1.0677,-0.29118 -0.19412,0.0971 1.26182,0.19412 z m -3.6884,-1.35888 h -1.06769 l 1.8442,0.48532 z m 4.4649,0.97063 -0.0971,-0.19412 -0.38825,0.0971 0.48531,0.0971 z m -2.91189,-1.16476 -0.38825,-0.19412 v 1.06769 z m 8.25037,-3.10606 -2.42658,0.48532 -2.13539,2.81483 z m 3.88252,-0.97063 0.77651,-0.19412 h -0.0971 l -0.67944,0.19412 z m 123.46429,-10.09456 -1.26182,3.59133 1.26182,-0.7765 z m -9.60925,0.38825 2.81483,4.27078 6.3091,3.97959 -1.45594,-3.39721 -6.01792,-5.14435 z m 3.30015,-1.65007 -0.38826,1.45595 0.67945,-0.48532 z m 2.03832,0 -0.0971,0.97063 0.87357,0.29119 -0.77651,-1.26182 z m -3.59133,-1.94126 0.48531,1.8442 0.97063,-0.58238 z m -4.17372,0.7765 0.48532,4.4649 0.97063,-0.97063 z m 0.48532,-1.45595 2.23245,3.10602 -0.29119,-2.03832 z m -6.89148,0.77651 -0.58238,1.8442 0.7765,-1.26182 z m 0.19412,-1.45595 3.88253,6.40617 -0.58238,-4.36784 z m -64.44991,3.59134 0.0971,-0.29119 h -0.38825 l 0.29119,0.29119 z m -0.97063,0 -2.52364,1.65007 -3.10602,4.07665 1.55301,1.65008 7.18267,-5.33848 z m 61.24683,-6.3091 -0.67944,-0.38826 v 0.58238 z m -61.82921,5.14434 0.0971,0.38825 0.67945,0.38826 -0.77651,-0.77651 z m 63.67341,-6.98854 -1.94126,0.97063 1.84419,0.58238 0.0971,-1.55301 z m -1.26182,0 -0.19413,-0.19413 -0.0971,0.19413 h 0.29119 z m 5.92085,-1.55301 -0.77651,-0.29119 -0.19412,0.58238 z m -4.17372,0.67944 -0.67944,-0.0971 v 0.19413 l 0.67944,-0.0971 z m 2.13539,-0.77651 3.97959,5.82379 -1.06769,-5.33847 z m -64.06166,6.30911 -2.32951,1.74713 1.06769,1.16476 3.10602,-2.32952 z m 28.4395,-9.3181 1.16475,-1.45595 -0.38825,0.29119 z m -11.8417,-0.19413 0.38825,-0.29119 0.0971,-0.38825 -0.48531,0.67944 z m 0,-1.06769 -0.38826,0.29118 0.67945,-0.19412 -0.29119,-0.0971 z m -0.38826,-0.0971 -0.38825,0.38825 -0.19412,0.38826 z m 10.67695,-1.16476 h 0.0971 0.0971 -0.19412 z m 0.48531,0 -0.19412,-0.0971 v 0.0971 z m -1.16475,-0.0971 0.0971,0.0971 v -0.0971 z m -7.95918,0.58238 0.38825,-0.38825 -0.48531,0.38825 h 0.0971 z m 1.16476,-0.87357 -2.32952,3.78546 3.00896,-3.49427 z m -3.00896,0.48532 -0.29119,-0.38825 -0.0971,0.19412 0.38825,0.19413 z m 9.90044,-0.67944 v -0.67945 l -0.19413,0.29119 z m -71.24433,-7.47386 -4.65903,-0.19413 3.20308,3.39721 z m 62.41158,6.79438 -0.29119,2.13539 0.48532,-1.35888 z m -0.97063,-1.35888 0.0971,0.29119 0.19412,-0.0971 -0.29119,-0.19413 z m -0.48531,0.38825 -0.19413,-0.58238 -0.29119,0.19413 z m 0.19412,-1.74713 v 0.97063 l 0.29119,-0.67944 z m -7.37679,-1.16476 v -0.29119 0 z m -50.66695,-12.03583 0.19412,-0.58238 -0.0971,0.0971 -0.0971,0.48531 z m 4.56196,-3.30014 v -0.0971 0 z m 1.74714,-2.9119 v 0 h -0.0971 z m 0.58238,0.19413 -0.38825,-0.19413 v 0.0971 l 0.38825,0.0971 z m -17.27724,-7.18267 -0.7765,-0.97063 0.58238,0.7765 z m 24.16872,4.95018 -1.06769,0.0971 0.58238,0.29119 0.48531,-0.38825 z m -26.78942,-9.41513 -0.77651,2.9119 2.42658,0.38825 3.20309,3.30015 1.94126,-0.87357 z m 84.63904,-28.05131 -0.38825,-0.29119 -0.67944,-0.29119 z m -50.86107,-2.13539 0.87356,-1.16475 -0.48531,0.38825 z m 1.16475,-1.35888 0.38826,-0.58238 -0.19413,0.19413 z m 0.58238,-0.7765 0.67944,-0.58238 -0.38825,0.19412 z m 30.57488,0.19412 0.48532,0.48532 h 0.29119 z m -15.62716,-6.40616 -3.97959,3.30014 -2.42657,-0.67944 -5.62966,3.20308 -1.0677,-0.67944 -6.40616,7.18267 -6.50323,1.45595 0.58237,3.49427 2.9119,3.97959 5.43553,5.24141 -0.87356,2.03832 4.07665,1.74714 -2.13539,0.38825 -2.62071,-2.03832 1.35889,3.00895 -1.74714,1.0677 -5.5326,-5.04728 -4.36784,0.7765 -7.47386,2.81483 3.39721,3.78546 -0.48531,2.32952 2.23245,2.71776 7.37679,2.9119 5.33848,-2.71777 0.87356,2.03833 -1.45594,6.11497 h -4.46491 l -5.2414,2.32952 -0.29119,-1.65008 -2.71777,1.0677 -1.26182,2.81483 -4.46491,3.39721 v 4.95022 l 1.74714,0.7765 -1.35888,4.17372 5.82378,5.04728 3.6884,-1.55301 -0.7765,6.21204 1.06769,1.35888 4.46491,0.97063 1.65007,1.8442 3.88252,0.29119 1.8442,1.94127 3.97959,-1.16476 -1.8442,2.52364 -1.45595,5.14434 -11.8417,7.66799 -1.55301,1.55301 -2.23245,-0.87357 -3.59133,0.87357 -5.14435,3.39721 8.05624,-2.32952 1.16476,1.74714 10.38575,-3.39721 0.29119,1.35889 4.07665,-4.07666 8.54156,-5.92085 0.67944,0.38826 7.47386,-5.92085 -1.94126,-2.32952 2.52364,-4.17371 6.60029,-7.86212 5.04728,-0.97063 1.55301,1.0677 -6.11497,1.74713 -1.65008,6.50323 0.19413,3.49428 2.13539,-0.19413 10.28869,-6.21204 0.7765,-2.32952 -0.87356,-3.59133 3.10601,0.7765 2.23246,-1.45594 6.40616,3.88252 -0.48531,1.0677 14.55946,1.8442 3.39721,-1.0677 0.97064,1.45595 12.6182,6.01791 2.13539,-1.26182 0.19413,-7.27973 1.65007,3.30014 8.1533,5.92085 0.67944,2.42658 7.08561,3.97959 1.8442,5.14434 1.74714,-3.97958 3.59133,6.98854 2.42658,-3.97959 -1.94126,-4.95022 -7.47386,-0.7765 -11.45345,-10.96813 -6.21204,-4.56197 -4.75609,4.65903 h -2.81483 l -6.50323,-4.27078 -6.40617,-0.29119 -9.12393,-57.55843 -1.55301,-2.71776 -3.6884,-2.23246 -5.5326,1.0677 -4.27078,-0.87357 -5.43553,-2.13539 -5.72673,0.38825 -1.45594,-2.71776 -4.56197,-0.67945 -0.7765,-1.65007 -2.03833,2.32952 z"
                    style={{strokeWidth:strokeWidth}} /></Whisper>
                
                    <Whisper trigger='hover'  speaker={<Popover className={(stateList.includes(popupState) === false || specialStates.length === 0 || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                        className={specialStates.length > 0 ? "visible mapState" : 'invisible mapState'}
                        onClick={(e) => {handleClick(e)}}
                        onMouseEnter={(e) => {handleMouseEnter(e)}}
                        onMouseOut={(e) => {handleMouseLeave(e)}}
                        id="SPECIAL1"
                        data-name="Special 1"
                        data-id="SPECIAL-1"
                        d='m 950,250 30,0 0,15 -30,0 0,-15 z'
                        style={{strokeWidth:strokeWidth}} /></Whisper>
                    <Whisper trigger='hover'  speaker={<Popover className={(stateList.includes(popupState) === false || specialStates.length <= 1 || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                        className={specialStates.length > 1 ? "visible mapState" : 'invisible mapState'}
                        onClick={(e) => {handleClick(e)}}
                        onMouseEnter={(e) => {handleMouseEnter(e)}}
                        onMouseOut={(e) => {handleMouseLeave(e)}}
                        id="SPECIAL2"
                        data-name="Special 2"
                        data-id="SPECIAL-2"
                        d='m 950,280 30,0 0,15 -30,0 0,-15 z'
                        style={{strokeWidth:strokeWidth}} /></Whisper>
                    <Whisper trigger='hover'  speaker={<Popover className={(stateList.includes(popupState) === false || specialStates.length <= 2 || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                        className={specialStates.length > 2 ? "visible mapState" : 'invisible mapState'}
                        onClick={(e) => {handleClick(e)}}
                        onMouseEnter={(e) => {handleMouseEnter(e)}}
                        onMouseOut={(e) => {handleMouseLeave(e)}}
                        id="SPECIAL3"
                        data-name="Special 3"
                        data-id="SPECIAL-3"
                        d='m 950,310 30,0 0,15 -30,0 0,-15 z'
                        style={{strokeWidth:strokeWidth}} /></Whisper>
                    <Whisper trigger='hover'  speaker={<Popover className={(stateList.includes(popupState) === false || specialStates.length <= 3 || enablePopups === false) ? 'invisible' : 'visible'}><Popup isSpecial={isSpecial} resultsYear={resultsYear} page={page} raceRecords={raceRecords} resultsRecords={resultsRecords} mode={mode} state={popupState} mouseposition={mouseposition}/></Popover>}>
                <path
                        className={specialStates.length > 3 ? "visible mapState" : 'invisible mapState'}
                        onClick={(e) => {handleClick(e)}}
                        onMouseEnter={(e) => {handleMouseEnter(e)}}
                        onMouseOut={(e) => {handleMouseLeave(e)}}
                        id="SPECIAL4"
                        data-name="Special 4"
                        data-id="SPECIAL-4"
                        d='m 950,340 30,0 0,15 -30,0 0,-15 z'
                        style={{strokeWidth:strokeWidth}} /></Whisper>
                
                <path id='topObj' className='highlighted' d='' calledpath=''/>

                <text id='WAtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={250} y={80}>WA</text>
                <text id='ORtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={220} y={140}>OR</text>
                <text id='CAtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={210} y={300}>CA</text>
                <text id='IDtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={310} y={170}>ID</text>
                <text id='NVtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={260} y={250}>NV</text>
                <text id='UTtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={340} y={260}>UT</text>
                <text id='AZtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={325} y={360}>AZ</text>
                <text id='AKtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={220} y={490}>AK</text>
                <text id='MTtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={390} y={115}>MT</text>
                <text id='WYtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={410} y={195}>WY</text>
                <text id='COtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={435} y={275}>CO</text>
                <text id='NMtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={420} y={370}>NM</text>
                <text id='NDtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={515} y={110}>ND</text>
                <text id='SDtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={515} y={170}>SD</text>
                <text id='NEtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={530} y={230}>NE</text>
                <text id='KStitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={545} y={290}>KS</text>
                <text id='OKtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={570} y={350}>OK</text>
                <text id='TXtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={540} y={430}>TX</text>
                <text id='MNtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={600} y={140}>MN</text>
                <text id='IAtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={620} y={215}>IA</text>
                <text id='MOtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={640} y={290}>MO</text>
                <text id='ARtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={645} y={360}>AR</text>
                <text id='LAtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={650} y={430}>LA</text>
                <text id='WItitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={665} y={160}>WI</text>
                <text id='ILtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={685} y={240}>IL</text>
                <text id='MItitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={745} y={180}>MI</text>
                <text id='INtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={735} y={240}>IN</text>
                <text id='OHtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={785} y={230}>OH</text>
                <text id='KYtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={765} y={290}>KY</text>
                <text id='TNtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={750} y={330}>TN</text>
                <text id='MStitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={695} y={390}>MS</text>
                <text id='ALtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={745} y={390}>AL</text>
                <text id='GAtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={810} y={390}>GA</text>
                <text id='FLtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={845} y={450}>FL</text>
                <text id='HItitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={370} y={530}>HI</text>
                <text id='SCtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={845} y={350}>SC</text>
                <text id='NCtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={860} y={310}>NC</text>
                <text id='VAtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={865} y={270}>VA</text>
                <text id='WVtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={820} y={265}>WV</text>
                <text id='PAtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={860} y={200}>PA</text>
                <text id='NYtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={880} y={150}>NY</text>
                <text id='MEtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={950} y={70}>ME</text>
                <text id='VTtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={903} y={84}>VT</text>
                <text id='NHtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={960} y={125}>NH</text>
                <text id='MAtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={970} y={155}>MA</text>
                <text id='CTtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={940} y={185}>CT</text>
                <text id='RItitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={953} y={168}>RI</text>
                <text id='NJtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={930} y={200}>NJ</text>
                <text id='DEtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={925} y={230}>DE</text>
                <text id='MDtitle' className='stateText' textAnchor='middle' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={925} y={250}>MD</text>

                <text id='SPECIAL1-text' textAnchor='middle' className={specialStates.length > 0 ? "stateText visible" : 'stateText invisible'} style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={1020} y={262}>SPECIAL-1</text>
                <text id='SPECIAL2-text' textAnchor='middle' className={specialStates.length > 1 ? "stateText visible" : 'stateText invisible'} style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={1020} y={292}>SPECIAL-2</text>
                <text id='SPECIAL3-text' textAnchor='middle' className={specialStates.length > 2 ? "stateText visible" : 'stateText invisible'} style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={1020} y={322}>SPECIAL-3</text>
                <text id='SPECIAL4-text' textAnchor='middle' className={specialStates.length > 3 ? "stateText visible" : 'stateText invisible'} style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={1020} y={352}>SPECIAL-4</text>

                <path d='m 700,25 30,0 0,15 -30,0 0,-15 z' style={{stroke: "white", strokeWidth:strokeWidth, fill: safeDemColor}} />
                <path d='m 700,45 30,0 0,15 -30,0 0,-15 z' style={{stroke: "white", strokeWidth:strokeWidth, fill: safeRepColor}} />
                <path d='m 750,25 30,0 0,15 -30,0 0,-15 z' style={{stroke: "white", strokeWidth:strokeWidth, fill: likelyDemColor}} />
                <path d='m 750,45 30,0 0,15 -30,0 0,-15 z' style={{stroke: "white", strokeWidth:strokeWidth, fill: likelyRepColor}} />
                <path d='m 800,25 30,0 0,15 -30,0 0,-15 z' style={{stroke: "white", strokeWidth:strokeWidth, fill: leanDemColor}} />
                <path d='m 800,45 30,0 0,15 -30,0 0,-15 z' style={{stroke: "white", strokeWidth:strokeWidth, fill: leanRepColor}} />
                <path d='m 850,25 30,0 0,15 -30,0 0,-15 z' style={{stroke: "white", strokeWidth:strokeWidth, fill: tiltDemColor}} />
                <path d='m 850,45 30,0 0,15 -30,0 0,-15 z' style={{stroke: "white", strokeWidth:strokeWidth, fill: tiltRepColor}} />

                <text id='MDtitle' textAnchor='middle' className='stateText' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={715} y={15}>SOLID</text>
                <text id='MDtitle' textAnchor='middle' className='stateText' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={765} y={15}>LIKELY</text>
                <text id='MDtitle' textAnchor='middle' className='stateText' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={815} y={15}>LEAN</text>
                <text id='MDtitle' textAnchor='middle' className='stateText' style={{fontSize: letterFont, fill: letterColor, stroke: letterColor}} x={865} y={15}>TILT</text>

            </svg>
        </div>
            <div className='mapButtons'>
            {(page === 'CALLSIM') &&
                <div>
                    <h2>SEAT BREAKDOWN</h2>
                    <div className='seatBreakdown'>
                        <h3 id='demCount' className={((mode === 'SENATE' && senateWinner === 'Democratic') || (mode === 'GOVERNOR' && govWinner === 'Democratic')) ? 'demWin' : 'dem'}>DEMS: {mode === 'SENATE' ? senateCount[0] : govCount[0] }</h3>
                        <h3 id='repCount' className={((mode === 'SENATE' && senateWinner === 'Republican') || (mode === 'GOVERNOR' && govWinner === 'Republican')) ? 'repWin' : 'rep'}>GOP: {mode === 'SENATE' ? senateCount[1] : govCount[1] }</h3>
                    </div>
                </div>
            }
            {page === 'CALLSIM' &&
                <div className='enableButtonsSim'>
                    <button onClick={resetMap}>RESET MAP</button>
                    <button onClick={(e) => {enablePops(e)}}>DISABLE INFO</button>
                    <button onClick={(e) => {enableRate(e)}}>DISABLE RATINGS</button>
                </div>
            }
            {page === 'LIVE' &&
                <div className='enableButtons'>
                    <button onClick={(e) => {enablePops(e)}}>DISABLE INFO</button>
                    <button onClick={(e) => {enableRate(e)}}>DISABLE RATINGS</button>
                </div>
            }
            </div>
        </div>
        </>      

    );
}

export default MyMap;
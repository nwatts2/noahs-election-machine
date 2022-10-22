import React, { useEffect, useState } from 'react';
import '../css/RecordList.css';

const CandidateRecord = (props) => {
    return (
    <>
        <tr>
            <td>{props.record.incumbent ? '* ':''}{props.record.fname + ' ' + props.record.lname}</td>
            <td>{props.record.party}</td>
            <td>{props.record.state}</td>
            {props.record.district && props.record.district !== '' &&
                <td>{props.record.district}</td>
            }
            <td>{props.record.rating}</td>
        </tr>
    </>
    );
};

export default function CandidatesRecordList(props) {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function getRecords() {
            const candidatesResponse = await fetch(`http://localhost:3001/candidatesRecord/`);

            if (!candidatesResponse.ok) {
                const message = `An error occurred: ${candidatesResponse.statusText}`;
                window.alert(message);
                return;
            }

            const candidatesList = await candidatesResponse.json(), records = [];

            for (let x of candidatesList) {
                if (x.type === props.type && Math.abs(x.ratingRank) < 2) {
                    records.push(x)
                }
            }

            setRecords(records.slice(0,10));

        }

        getRecords();

        return;

    }, [props.type]);

    function recordList() {
        return records.map((record) => {
            return (
                <CandidateRecord record={record} key={record._id} />
            );
        });
    }

    return (
        <div class='candidateTable'>
            <h3>{props.type} RACES</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Party</th>
                        <th>State</th>
                        {props.type === 'HOUSE' &&
                            <th>District</th>
                        }
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>{recordList()}</tbody>
            </table>
        </div>
    );
}
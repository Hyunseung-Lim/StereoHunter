import React, { useState, useEffect } from 'react'
import json2csv from 'json2csv';
import FileSaver from 'file-saver';
import axios from "axios"

import './pages.css'

export const ManagePage = (props) => {

    const [logData, setLogData] = useState([[{'id': '', 'input': '', 'output': '', 'ambiguous':''}]]);
    const [activityData, setActivityData] = useState([[{'id': ''}]]);
    
    // get profile data from server
    function getData() {
        axios({
        method: "GET",
        url:"/manage",
        headers: {
            Authorization: 'Bearer ' + props.token
        }
        })
        .then((response) => {
            const res =response.data
            res.access_token && props.setToken(res.access_token)
            setLogData(
                res.logData
            )
            setActivityData(
                res.activityData
            )
        }).catch((error) => {
        if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            axios({
            method: "POST",
            url:"/logout",
            })
            .then((response) => {
            props.removeToken()
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
                }
            })
            }
        })
    }

    useEffect(() => {
        getData()
      }, []);

    function setCSV () {
        let lcsv = json2csv.parse(logData);
        let acsv = json2csv.parse(activityData);
        let lb = new Blob([lcsv], { type: 'text/csv;charset=utf-8;' });
        let ab = new Blob([acsv], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(lb, 'logData.csv');
        FileSaver.saveAs(ab, 'activityData.csv');
    }

    return(
        <>
            <div className='managepage'>
                <div>
                    <button onClick={setCSV}>get Data</button>
                </div>
                {logData.map(userInfo => (
                <div className='userLog' key = {userInfo}>
                    <table className='userTable'><tbody>
                        <tr>
                            <th> user id </th>
                            <th> log id </th>
                            <th> input </th>
                            <th> output </th>
                            <th> stereo </th>
                            <th colSpan="7" > Information </th>
                        </tr>
                        {typeof userInfo.logData === 'undefined' ? null : userInfo.logData.map(userLog => (
                        <tr key = {userLog.id}>
                            <td>{userInfo.user}</td>
                            <td>{userLog.id}</td>
                            <td>{userLog.input}</td>
                            <td>{userLog.output}</td>
                            <td>{userLog.isStereo}</td>
                            {userLog.isStereo === 'stereo' || userLog.isStereo === 'antiStereo' ? 
                                <>
                                    <td>{userLog.targets && userLog.targets.map(target => <div key={userLog.id + target}>{target + '/'}</div>)}</td>
                                    <td>{userLog.relation}</td>
                                    <td>{userLog.familiar}</td>
                                    <td>{userLog.degree}</td>
                                    <td>{userLog.context}</td>
                                    <td>{userLog.isWordIssue}</td>
                                    <td>{userLog.words && userLog.words.map(target => target + '/')}</td>
                                </>
                            : (userLog.isStereo === 'ambiguous' ? <td colSpan="6">{userLog.ambiguous}</td> : null) }
                        </tr>))}
                    </tbody></table>
                </div>))}
                <table><tbody>
                    <tr>
                        <th> id </th>
                        <th> user id </th>
                        <th> time  </th>
                        <th> log id </th>
                        <th> state </th>
                        <th> note </th>
                    </tr>
                    {typeof activityData === 'undefined' ? null : activityData.map(activity => (
                    <tr key = {activity.id}>
                            <td>{activity.id}</td>
                            <td>{activity.user_id}</td>
                            <td>{activity.time}</td>
                            <td>{activity.log_id}</td>
                            <td>{activity.state}</td>
                            <td>{activity.note}</td>
                    </tr>
                    ))}                    
                </tbody></table>

            </div>
        </>
    )
}
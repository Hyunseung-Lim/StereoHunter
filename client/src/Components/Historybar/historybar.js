import React, { useState } from 'react'
import './historybar.css'
import { History } from '../Historybar/history';

export const Historybar = (props) => {

    return(
        <nav className='historybar'>
            <div className='title'>History</div>
            <div className='histories'>
                {props.logData.map(historyLog => (<History historyLog = {historyLog} key = {historyLog.id} ambiguous={props.ambiguous} evaluation={props.evaluation} setCurrent={props.setCurrent} clickedId = {props.clickedId} setClickedId = {props.setClickedId}/>))}
            </div>
        </nav>
    )
}
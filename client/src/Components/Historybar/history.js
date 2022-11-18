import React, { useState } from 'react'
import './historybar.css'

export const History = (props) => {

    function clickHistory() {
        props.setClickedId(props.historyLog.id);
        props.setCurrent(props.historyLog.input, props.historyLog.output);
    }

    if(props.clickedId === props.historyLog.id) {
        return(
            <nav className='history clicked' onClick={clickHistory}>
                <div className="situation">상황: {props.historyLog.input}</div>
                <div className="dialoge">"{props.historyLog.output}"</div>
            </nav>
        )
    }
    else{
        return(
            <nav className='history' onClick={clickHistory}>
                <div className="situation">상황: {props.historyLog.input}</div>
                <div className="dialoge">"{props.historyLog.output}"</div>
            </nav>
        )       
    }
}
import React, { useState } from 'react'
import './historybar.css'

export const History = (props) => {
    return(
        <nav className='history'>
            <div className="situation">상황: {props.historyLog.input}</div>
            <div className="dialoge">"{props.historyLog.output}"</div>
        </nav>
    )
}
import React from 'react'
import './historybar.css'

export const History = (props) => {

    function clickHistory() {
        props.setClickedId(props.historyLog.id);
        props.setCurrent(props.historyLog.input, props.historyLog.output, props.historyLog.id);
    }

    if(props.clickedId === props.historyLog.id) {
        return(
            <nav className='history clicked' onClick={props.evaluation || props.ambiguous ? null : clickHistory}>
                <div className="situation">상황: {props.historyLog.input}</div>
                <div className='markHolder'>
                    {props.historyLog.isStereo === "stereo"
                        ? <div className='stereoMark stereo'>#고정관념</div> 
                        :(props.historyLog.isStereo === "antiStereo" 
                            ? <div className='stereoMark antiStereo'>#반고정관념</div> 
                            : (props.historyLog.isStereo === "ambiguous" 
                                ? <div className='stereoMark ambiguous'>#애매모호</div> 
                                :(props.historyLog.isStereo === "neutral" 
                                    ? <div className='stereoMark neutral'>#중립</div> 
                                    : (props.historyLog.isStereo === "unrelated" 
                                        ? <div className='stereoMark unrelated'>#관련없음</div> 
                                        : null))))}
                </div>
                <div className="dialoge">"{props.historyLog.output}"</div>
            </nav>
        )
    }
    else{
        return(
            <nav className='history' onClick={props.evaluation || props.ambiguous ? null : clickHistory}>
                <div className="situation">상황: {props.historyLog.input}</div>
                <div className='markHolder'>
                {props.historyLog.isStereo === "stereo" 
                    ? <div className='stereoMark stereo'>#고정관념</div> 
                    :(props.historyLog.isStereo === "antiStereo" 
                        ? <div className='stereoMark antiStereo'>#반고정관념</div> 
                        : (props.historyLog.isStereo === "ambiguous" 
                            ? <div className='stereoMark ambiguous'>#애매모호</div> 
                            :(props.historyLog.isStereo === "neutral" 
                                ? <div className='stereoMark neutral'>#중립</div> 
                                : null)))}
                </div>
                <div className="dialoge">"{props.historyLog.output}"</div>
            </nav>
        )       
    }
}
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import './vocabulary.css'
import upperArrow from '../../Svg/upperArrow.svg'
import downArrow from '../../Svg/downArrow.svg'


export const Vocabulary = (props) => {

    function clickVocabulary() {
        props.sortVoca();
        props.setIsVocabulary(!props.isVocabulary);
    }

    return (
        <div className='vocabulary'>
            <button className='vocalbularyButton' onClick={clickVocabulary}><img className="arrow" src={props.isVocabulary? downArrow : upperArrow } alt="Logo"/></button>
            {props.isVocabulary?
                <div className='vocabularyContainer'>
                    <div className='vocabularyScroll'>
                    {props.vocabularyData.map(voca => 
                        <div className={props.checkedVoca.includes(voca) ?
                            (props.initalTarget === voca ? 'checkedUnitVoca_clicked' : 'checkedUnitVoca') 
                            : (props.initalTarget === voca ? 'unitVoca_clicked' : 'unitVoca')} 
                            onClick={props.initalTarget === voca ? () => props.setInitalTarget("") : () => props.setInitalTarget(voca)} 
                            key={voca}>
                                {voca}
                        </div>)}
                    </div>
                </div>
                : null
            }
        </div>
    )
}
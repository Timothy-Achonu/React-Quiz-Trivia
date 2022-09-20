import React from "react";

export default function StartQuiz(props) {
    return (
        <div className="start-quiz-wrapper">
            <h2>Quizzical</h2>
            <p>How many questions would you like to answer? </p>   
            <button onClick={props.start}>Start Quiz</button> 
        </div>
    )
}
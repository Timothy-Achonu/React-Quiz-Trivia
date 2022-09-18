import React from "react";

export default function StartQuiz(props) {
    return (
        <div className="start-quiz-wrapper">
            <h2>Quizzical</h2>
            <p>Some Description if needed </p>   
            <button onClick={props.start}>Start Quiz</button> 
        </div>
    )
}
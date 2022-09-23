import React from "react";

export default function StartQuiz(props) {
    const styles = {
        opacity: props.number > 0 ? "1" : "0.3",
        cursor: props.number > 0 ? "pointer" : "default"
    }
    return (
        <div className="start-quiz-wrapper">
            <h2>Quizzical</h2>
            <p>
                How many questions would you like to answer?
                You can't answer more than 50 questions.
            </p>   
            <input 
              className="input-num"
              type="number" 
              value={props.number}
              onChange={props.changeInput}
              />
            <button onClick={props.start} style={styles}>Start Quiz</button> 
        </div>
    )
}
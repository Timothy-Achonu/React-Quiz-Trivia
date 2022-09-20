import React from "react";



export default function QuizPage(props) {
    // console.log(props.choices);
    // console.log(props.question);
    // const options 
    function htmlDecode(input) {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }
    // let listElements = []
    // let realListElements = []
    // console.log(props.choices)
    // console.log(props.finished)

    const optionsElements = props.choicesObject.map((option,index) => {
        // console.log(option.selected)
            let listStyles = {
                backgroundColor : optionBgColor(),  
            }
            // let listStyles = {
            //     backgroundColor : option.selected ? "#D6DBF5" : "white", 
            // }
           
            function optionBgColor() {
                let bgColor;
                if(option.selected) {
                    bgColor = "#D6DBF5"
                }
                if(option.correct) {
                    bgColor = "green"
                }
                if(option.failed) {
                    bgColor = "#F8BCBC"
                }
                // else {
                //     bgColor = "white"
                // }
                return bgColor;
            }

            return (
                    <li 
                    onClick={() => props.select(option.id, option.question)}
                    style={listStyles}
                    key={index}
                    >
                    {htmlDecode(option.value)}
                </li>
                )

    })
    
    // console.log(listElements)
    // console.log(realListElements)
    return (
        <div className="question">
            <h3>{htmlDecode(props.question)}</h3>
            <ul>
                {/* <li>this&#039;child</li>
                <li>{aString}</li>
                <li>A</li>
                <li>A</li> */}
                {optionsElements}
            </ul>
            <hr></hr>
        </div>
    )
}
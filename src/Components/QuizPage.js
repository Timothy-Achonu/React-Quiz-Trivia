import React from "react";

export default function QuizPage(props) {
  
  function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  let optionsElements;
  if (props.choicesObject) {
    optionsElements = props.choicesObject.map((option, index) => {
      let listStyles = optionColor();

      function optionColor() {
        let bgColor = {};
        if (option.selected) {
          bgColor = {
            backgroundColor: "#D6DBF5",
          };
        }
        if (option.correct) {
          bgColor = {
            backgroundColor: "green",
            color: "white",
          };
        }
        if (option.failed) {
          bgColor = {
            backgroundColor: "#F8BCBC",
          };
        }

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
      );
    });
  }
 
  return (
    <div className="question">
      <h3>{htmlDecode(props.question)}</h3>
      <ul>
        {optionsElements}
      </ul>
      <hr></hr>
    </div>
  );
}

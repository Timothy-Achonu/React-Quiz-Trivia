import React from "react";
import "./App.css";
import StartQuiz from "./Components/StartQuiz";
import QuizPage from "./Components/QuizPage";

function App() {
  const [startQuiz, setStartQuiz] = React.useState(false);
  const [quiz, setQuiz] = React.useState([]);
  const [select, setSelect] = React.useState(false);
  const [options, setOptions] = React.useState([])

  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&difficulty=medium")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.results);
        // console.log("Effect Ran!!")
        setQuiz(data.results);
      });
  }, []);
  console.log(quiz);
  // console.log(options);

  let questionOptions = []
  quiz.forEach( (eachQuiz,questionNum) => {
    let options = [...eachQuiz.incorrect_answers]
    let randomIndex = Math.
    floor(Math.random() * (options.length + 1));
    // console.log(randomIndex)
    options.splice(randomIndex,0,eachQuiz.correct_answer);
    const optionsObject = options.map((option, index) => {
      return {
        value : option,
        id : index,
        selected : false,
        question : questionNum
      }
    })
    // console.log(optionObjects);
    questionOptions.push(optionsObject)
  })

  const questionElements = quiz.map((eachQuiz, questionNum) => {
    // let options = eachQuiz.incorrect_answers;
    // options.push(eachQuiz.correct_answer);
    //what is above modify the original in gotten from the
    //API and also modifies the quiz state.
    let questionOptions = [...eachQuiz.incorrect_answers]
    questionOptions.push(eachQuiz.correct_answer);
    const optionArray = []
   
    return (
      <QuizPage
        question={eachQuiz.question}
        answer={eachQuiz.correct_answer}
        choices={questionOptions}
        choicesObject={options[questionNum]}
        select={handleSelect}
        key={questionNum}
      />
    );
  });


  function handleStartQuiz() {
    setStartQuiz(true);
    setOptions(questionOptions)
  }
  // console.log(options)
  
  function handleSelect(id, questionNum) {
    // setSelect(prevSelect => !prevSelect);
    setOptions(preOptions => {
      return  preOptions.map((item) => {
                return  item.map(obj => {
                          if(obj.question === questionNum) {
                            return obj.id === id ?
                                    {...obj, selected : !obj.selected} :
                                    {...obj, selected : false}
                          }
                          else {
                            return obj
                          }
                        })
          
              })
    })
  }
  const stylesTop = {
    right: startQuiz ? "-180px" : "-50px",
    top: startQuiz ? "-70px" : "-20px",
  };

  const stylesBottom = {
    left: startQuiz ? "-130px" : "-50px",
    bottom: startQuiz ? "0px" : "0px",
  };


  return (
      <div className="app-container">
        {!startQuiz && <StartQuiz start={handleStartQuiz} />}
        {
          startQuiz &&
          <div className="quiz-section">
            {questionElements}
            
            <button className="check-answers">
                Check answers
              </button>
            
          </div>
        }
        <div className="top-design" style={stylesTop}> </div>
        <div className="bottom-design" style={stylesBottom}></div>
      </div>
  );
}

export default App;

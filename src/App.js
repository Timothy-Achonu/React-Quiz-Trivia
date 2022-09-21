import React from "react";
import "./App.css";
import StartQuiz from "./Components/StartQuiz";
import QuizPage from "./Components/QuizPage";

function App() {
  const [startQuiz, setStartQuiz] = React.useState(false);
  const [quiz, setQuiz] = React.useState([]);
  const [options, setOptions] = React.useState([]);
  const [dataArrived, setDataArrived] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isPending, setIsPending] = React.useState(true);
  const [quizEnded, setQuizEnded] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [playAgain, setPlayAgain] = React.useState(false);

  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&difficulty=medium")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} Could not fetch data`);
        }
        return res.json();
      })
      .then((data) => {
        setIsPending(false);
        if (data.results.length) {
          setQuiz(data.results);
          setDataArrived(true);
        } else {
          throw new Error("Could not fetch data");
        }
      })
      .catch((err) => {
        setError(err);
      });
  }, [playAgain]);
  // console.log(quiz);
  // console.log(options);

  let questionOptions = [];
  let questionElements = [];

  if (dataArrived) {
    BeginQuiz();
  }

  function BeginQuiz() {
    quiz.forEach((eachQuiz, questionNum) => {
      let options = [...eachQuiz.incorrect_answers];
      let randomIndex = Math.floor(Math.random() * (options.length + 1));
      // console.log(randomIndex)
      options.splice(randomIndex, 0, eachQuiz.correct_answer);
      const optionsObject = options.map((option, index) => {
        return {
          value: option,
          id: index,
          selected: false,
          question: questionNum,
          failed: false,
          correct: false,
        };
      });
      // console.log(optionObjects);
      questionOptions.push(optionsObject);
    });

    questionElements = quiz.map((eachQuiz, questionNum) => {
      // let options = eachQuiz.incorrect_answers;
      // options.push(eachQuiz.correct_answer);
      //what is above modify the original in gotten from the
      //API and also modifies the quiz state.
      let questionOptions = [...eachQuiz.incorrect_answers];
      questionOptions.push(eachQuiz.correct_answer);

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
  }

  function handleStartQuiz() {
    setStartQuiz(true);
    setOptions(questionOptions);
    setQuizEnded(false);
  }
  // console.log(options)

  function handleSelect(id, questionNum) {
    // setSelect(prevSelect => !prevSelect);
    setOptions((preOptions) => {
      return preOptions.map((item) => {
        return item.map((obj) => {
          if (obj.question === questionNum) {
            return obj.id === id
              ? { ...obj, selected: !obj.selected }
              : { ...obj, selected: false };
          } else {
            return obj;
          }
        });
      });
    });
  }
  function checkAnswers() {
    let score = 0;
    setQuizEnded(true);
    let eachOptionArray;
    let newOptionsArray = [];
    setOptions((preOptions) => {
      quiz.forEach((item, index) => {
        eachOptionArray = preOptions[index].map((obj) => {
          if (obj.selected) {
            if (item.correct_answer == obj.value) {
              score++;
              return { ...obj, correct: true };
            } else {
              return { ...obj, failed: true };
            }
          } else {
            return item.correct_answer == obj.value
              ? { ...obj, correct: true }
              : obj;
          }
        });
        newOptionsArray.push(eachOptionArray);
      });
      console.log(score);
      setScore(score)
      // console.log(newOptionsArray);
      return newOptionsArray;
    });

  }
  console.log(score)
  function handlePlayAgain() {
    setPlayAgain((prevPlay) => !prevPlay);
    setQuizEnded(false);
    setStartQuiz(false);
  }
  // console.log(options);

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
      {startQuiz && (
        <div className="quiz-section">
          {isPending && <h1 className="loading">Loading...</h1>}
          {!dataArrived && <h1 className="loading">{error}</h1>}
          {dataArrived && startQuiz && questionElements}
          {dataArrived && !quizEnded && (
            <button className="check-answers" onClick={checkAnswers}>
              Check answers
            </button>
          )}
          {quizEnded && (
            <div className="quiz-end">
              <p className="bottom-text"> {`You scored ${score}/${options.length} correct answers` }</p>
              <button className="play-again" onClick={handlePlayAgain}>
                Play again
              </button>
            </div>
          )}
        </div>
      )}
      <div className="top-design" style={stylesTop}>
        {" "}
      </div>
      <div className="bottom-design" style={stylesBottom}></div>
    </div>
  );
}

export default App;

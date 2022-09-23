import React from "react";
import "./App.css";
import StartQuiz from "./Components/StartQuiz";
import QuizPage from "./Components/QuizPage";

function App() {
  const [startQuiz, setStartQuiz] = React.useState(false);
  const [numberOfQues, setNumberOfQues] = React.useState(0);
  const [quiz, setQuiz] = React.useState([]);
  const [options, setOptions] = React.useState([]);
  const [dataArrived, setDataArrived] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isPending, setIsPending] = React.useState(true);
  const [quizEnded, setQuizEnded] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [playAgain, setPlayAgain] = React.useState(false);
  const [questionReady, setQuestionReady] = React.useState(false);
  // const [questionElements, setQuestionElements] = React.useState([])

  React.useEffect(() => {
    // console.log("effect ran");
    if (startQuiz) {
      // console.log("effect ran 2");
      fetchData(
        `https://opentdb.com/api.php?amount=${numberOfQues}&difficulty=medium`
      );
    }
  }, [startQuiz]);
  // console.log(quiz);
  // console.log(options);
  function fetchData(url) {
    // console.log("fetch ran");
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          console.log(res.status);
          throw new Error(`${res.status} Could not fetch data`);
        }
        return res.json();
      })
      .then((data) => {
        setIsPending(false);
        if (data.results.length) {
          // console.log(data.results);
          let questionOptions = [];
          data.results.forEach((eachQuiz, questionNum) => {
            let options = [...eachQuiz.incorrect_answers];
            let randomIndex = Math.floor(Math.random() * (options.length + 1));
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
            questionOptions.push(optionsObject);
          });
          setOptions(questionOptions);
          setQuiz(data.results);
          setDataArrived(true);
        } else {
          throw new Error("Could not fetch data");
        }
      })
      .catch((err) => {
        console.log(err.message);
        setError(err.message);
      });
  }

  function handleStartQuiz() {
    // console.log("handle");
    if (numberOfQues > 0) {
      setStartQuiz(true);
      setQuizEnded(false);
    }
  }

  let questionElements = [];
  questionElements = quiz.map((eachQuiz, questionNum) => {
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

  function handleChangeInput(e) {
    // console.log(startQuiz, dataArrived);
    // console.log(e.target.value);
    setNumberOfQues(e.target.value);
  }
  function handleSelect(id, questionNum) {
    // setSelect(prevSelect => !prevSelect);
    if (!quizEnded) {
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
  }

  function checkAnswers() {
    let score;;
    setQuizEnded(true);

    let eachOptionArray;
    let newOptionsArray = [];
    setOptions((preOptions) => {
      score = 0;
      newOptionsArray = [];
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
      setScore(score);
      console.log(newOptionsArray);
      return newOptionsArray;
    });
  }

  function handlePlayAgain() {
    setPlayAgain((prevPlay) => !prevPlay);
    setQuizEnded(false);
    setStartQuiz(false);
    setQuestionReady(false);
    setNumberOfQues(0)
    setDataArrived(false)
    setIsPending(true)
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
      {!startQuiz && (
        <StartQuiz
          start={handleStartQuiz}
          number={numberOfQues}
          changeInput={handleChangeInput}
        />
      )}
      {startQuiz && (
        <div className="quiz-section">
          {isPending && <h1 className="loading">Loading...</h1>}
          {!dataArrived && <h1 className="loading">{error}</h1>}
          {dataArrived && questionElements}
          {dataArrived && !quizEnded && (
            <button className="check-answers" onClick={checkAnswers}>
              Check answers
            </button>
          )}
          {quizEnded && (
            <div className="quiz-end">
              <p className="bottom-text">
                {" "}
                {`You scored ${score}/${options.length} correct answers`}
              </p>
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

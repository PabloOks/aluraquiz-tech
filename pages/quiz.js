import React from 'react';
import PropTypes from 'prop-types';

import db from '../db.json';

import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <img
          alt="Loading"
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'scale-down',
          }}
          src={db.loadingImg}
        />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
}) {
  const questionId = `question__${questionIndex}`;
  const [selectedAnswer, setSelectedAnswer] = React.useState(0);

  return (
    <Widget>
      <Widget.Header>
        {/* <BackLinkArrow href="/" /> */}
        <h3>
          {`Questão ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>
      <div
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
          backgroundColor: '#FFF',
        }}
      >
        <img
          alt="Descrição"
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'scale-down',
          }}
          src={question.image}
        />
      </div>
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(selectedAnswer);
            event.target.reset();
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
              >
                <input
                  /* style={{ display: 'none' }} */
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                  value={alternativeIndex}
                  onChange={(event) => { setSelectedAnswer(event.target.value); }}
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit">
            Confirmar
          </Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [correctAnswers, setCorrectAnswers] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function handleSubmitQuiz(selectedAnswer) {
    const nextQuestion = questionIndex + 1;

    if (Number(selectedAnswer) === question.answer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && (
          <Widget>
            <Widget.Header>
              Quiz finalizado!
            </Widget.Header>
            <Widget.Content>
              {correctAnswers < 1 && (
                <div>
                  Você errou todas as questões, que pena.
                </div>
              )}
              {correctAnswers === 1 && (
                <div>{`Você acertou ${correctAnswers} questão, dá pra melhorar.`}</div>
              )}
              {(correctAnswers > 1 && correctAnswers < totalQuestions) && (
                <div>{`Você acertou ${correctAnswers} questões, parabéns!`}</div>
              )}
              {correctAnswers === totalQuestions && (
                <div>Parabéns! Você gabaritou esse quiz!</div>
              )}
            </Widget.Content>
          </Widget>
        )}
      </QuizContainer>
    </QuizBackground>
  );
}

QuestionWidget.propTypes = {
  question: PropTypes.instanceOf(JSON).isRequired,
  questionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

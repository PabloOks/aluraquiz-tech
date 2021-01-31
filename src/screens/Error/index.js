/* eslint-disable react/prop-types */
import React from 'react';

import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import BackLinkArrow from '../../components/BackLinkArrow';

export default function ErrorPage({
  children, title, image, bg,
}) {
  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <BackLinkArrow href="/" />
            <h3>
              {title}
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
                objectFit: 'cover',
              }}
              src={image}
            />
          </div>

          <Widget.Content>
            <h2>
              {children}
            </h2>
          </Widget.Content>
        </Widget>
      </QuizContainer>
    </QuizBackground>
  );
}

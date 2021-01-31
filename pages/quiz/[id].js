/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';
import ErrorScreen from '../../src/screens/Error';
import db from '../../db.json';

export default function QuizDaGaleraPage({ externalDb }) {
  if (externalDb.error === 'true') {
    return (
      <ThemeProvider theme={db.theme}>
        <ErrorScreen
          title="Erro ao procurar as questões do quiz selecionado :("
          image="https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif"
          bg={db.bg}
        >
          Infelizmente ocorreu um erro ao tentar conectar no quiz selecionado.
          <br />
          <br />
          Você pode tentar acessar o quiz diretamente pelo link dele:
          <br />
          <a href={externalDb.url}>
            {externalDb.url}
          </a>
        </ErrorScreen>
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider theme={externalDb.theme}>
      <QuizScreen
        externalQuestions={externalDb.questions}
        externalBg={externalDb.bg}
      />
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___');
  const api = (githubUser === 'undefined')
    ? `https://${projectName}.vercel.app/api/db`
    : `https://${projectName}.${githubUser}.vercel.app/api/db`;
  try {
    const externalDb = await fetch(api)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Falha em pegar os dados');
      })
      .then((convertedResponse) => convertedResponse);

    return {
      props: {
        externalDb,
      },
    };
  } catch (err) {
    const url = api.replace('/api/db', '/');
    return {
      props: {
        externalDb: {
          error: 'true',
          url,
        },
      },
    };
  }
}

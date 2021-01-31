/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import cheerio from 'cheerio';

import db from '../db.json';

import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizHead from '../src/components/Head';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Button from '../src/components/Button';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function selectContributors(contributors) {
  const index = new Set();
  while (index.size !== 3) {
    index.add(getRandomInt(0, contributors.length));
  }

  return [
    contributors[[...index][0]],
    contributors[[...index][1]],
    contributors[[...index][2]],
  ];
}

export default function Home(props) {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const { selectedContributors } = props;

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizHead title={db.title} description={db.description} bg={db.bg} />
      <QuizContainer>
        <QuizLogo />
        <Widget
          as={motion.section}
          transition={{ delay: 0, duration: 0.5 }}
          variants={{
            show: { opacity: 1, y: '0' },
            hidden: { opacity: 0, y: '100%' },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>

          <Widget.Content>
            <p>{db.description}</p>
            <form onSubmit={(event) => {
              event.preventDefault();
              router.push(`/quiz?name=${name}`);
            }}
            >
              <Input
                name="nomeDoUsuario"
                placeholder="Escreva seu nome aqui"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
              <Button type="submit" disabled={name.length === 0}>
                {`Jogar ${name}`}
              </Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget
          as={motion.section}
          transition={{ delay: 0.5, duration: 0.5 }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Content>
            <h1>Quizes da Galera</h1>

            <ul>
              {selectedContributors.map((link) => {
                const [projectName, githubUser] = link
                  .replace(/\//g, '')
                  .replace('http:', '')
                  .replace('https:', '')
                  .replace('.vercel.app', '')
                  .split('.');

                return (
                  <li key={link}>
                    <Widget.Topic
                      href={`/quiz/${projectName}___${githubUser}`}
                    >
                      {`${githubUser}/${projectName}`}
                    </Widget.Topic>
                  </li>
                );
              })}
            </ul>
            <p>
              Quer ver mais quizes top que a galera fez?
              {' '}
              <a href="https://aluraquiz-base.alura-challenges.vercel.app/contribuidores">
                Clique aqui
              </a>
              .
            </p>
          </Widget.Content>
        </Widget>
        <Footer
          as={motion.footer}
          transition={{ delay: 0.5, duration: 0.5 }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/PabloOks/aluraquiz-tech" />
    </QuizBackground>
  );
}

export async function getStaticProps() {
  try {
    const externalData = await fetch('https://aluraquiz-base.alura-challenges.vercel.app/contribuidores');

    const $ = cheerio.load(await externalData.text());

    const data = $('script[id="__NEXT_DATA__"]').html();
    const { contributors } = JSON.parse(data).props.pageProps;
    const contributorsUrl = contributors.map((contributor) => contributor.projectUrl);

    const selectedContributors = selectContributors(contributorsUrl);

    return {
      props: {
        selectedContributors,
      },
      revalidate: 86400,
    };
  } catch (err) {
    throw new Error(err);
  }
}

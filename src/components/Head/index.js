import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

export default function QuizHead({ title, description, bg }) {
  return (
    <Head>
      <title>
        AluraQuiz -
        {' '}
        {title}
      </title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="author" content="Pablo França" />

      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Linux Quest" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://aluraquiz-tech.pablooks.vercel.app/" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={bg} />
    </Head>
  );
}

QuizHead.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
};

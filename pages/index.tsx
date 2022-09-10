import Head from 'next/head';
import { useEffect } from 'react'


// components
import { HomePage } from '@components';

const Home = () => {
  
 

  
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <HomePage />
   
      

    </div>
  );
};

export default Home;

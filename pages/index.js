import React from 'react';
import styled from '@emotion/styled';
import Layout from '../components/layout/Layout';

//const Heading = styled.h1`color: red`...ejemplo con styled components
//<style jsx>{`h1{color: red}`}</style>...ejemplo css en js
const Home = () => (
  <div>
    <Layout>
      <h1>Inicio</h1>
    </Layout>
  </div>
)

export default Home;
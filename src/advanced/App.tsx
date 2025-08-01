import React from 'react';
import { Header } from './components/Header';
import { GridContainer } from './components/GridContainer';

const App: React.FC = () => (
  <div id='app'>
    <Header itemCount={0} />
    <GridContainer />
  </div>
);

export default App;

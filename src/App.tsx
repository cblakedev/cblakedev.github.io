import React from 'react';
import './App.css';
import ButtonAppBar from './views/Navbar';
import OrderHome from './views/Home';

function App() {
  return (
    <div className="App">
      <ButtonAppBar />
      <OrderHome />
    </div>
  );
}

export default App;

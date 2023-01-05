import { createRoot } from 'react-dom/client';
import React from 'react';

function App() {
  
}


const container : HTMLElement = document.getElementById("container");
const root = createRoot(container); // createRoot(container!) if you use TypeScrip
root.render(<App/>);


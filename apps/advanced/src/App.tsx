import React from "react";

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = ({ title = "Advanced App" }) => {
  return (
    <div className="app">
      <h1>{title}</h1>
      <p>This is a TypeScript React application.</p>
    </div>
  );
};

export default App;

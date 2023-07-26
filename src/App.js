import logo from "./logo.svg";
import "./App.css";
import BasicEmbed from "./components/BasicEmbed";
import Notfound from "./components/Notfound";

function App() {
  return (
    <div className="App">
      <h1>Tableau Embed</h1>
      {/* <Notfound /> */}
      <BasicEmbed />
    </div>
  );
}

export default App;

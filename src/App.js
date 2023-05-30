import logo from "./logo.svg";
import "./App.css";
import { Employee } from "./pages/employee";
import { Cafe } from "./pages/cafe";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Breadcrumb } from "./components/Breadcrumb";

function App() {
  return (
    // <Employee></Employee>
    <Router>
      <Breadcrumb />
      <Routes>
        <Route exact path="/" element={<Cafe />} />
        <Route exact path="/employees" element={<Employee />} />
      </Routes>
    </Router>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;

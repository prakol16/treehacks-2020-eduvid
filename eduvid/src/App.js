import React from 'react';
import logo from './logo.svg';
import './App.css';

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.calculator = React.createRef();
  }

  render() {
    return (
        <div>
          <div style={{width: 600, height: 400, margin: 'auto'}} ref={this.calculator}></div><br />
          <p>
          <button>View recorded actions</button>
          </p>
        </div>
    );
  }

  componentDidMount() {
    let elt = this.calculator.current;
    this.calculator = window.Desmos.GraphingCalculator(elt);
    this.calculatorEvents = [];
    this.oldCalculatorState = this.calculator.getState();
    this.timelineStart = Date.now();
    this.calculator.observeEvent("change", () => {
      let newState = this.calculator.getState();
      let delta = this.computeDelta(this.oldCalculatorState, newState);
      this.calculatorEvents.push({
        timestamp: Date.now() - this.timelineStart,
        changes: delta
      });
      // console.log(this.oldCalculatorState, newState);
      console.log(this.calculatorEvents);
      this.oldCalculatorState = newState;
    });
  }

  saveJSON() {
    console.log(JSON.stringify({events: this.calculatorEvents}));
  }

  replayEvents(events) {
    this.calculator.setBlank();
    for (let evList of events.events) {
      setTimeout(() => {
        console.log("Doing", evList);
        for (let event of evList.changes) {
          if (event.type === "resetState") {
            this.calculator.setState(event.newState);
          } else if (event.type === "graphChange") {
            this.calculator.graph = event.newGraph;
          } else if (event.type === "addExpr" || event.type === "changeExpr") {
            this.calculator.setExpression(event.exp);
          } else if (event.type === "deleteExpr") {
            this.calculator.removeExpression(event.exp);
          }
        }
      }, evList.timestamp);
    }
  }

  computeDelta(oldCalcState, newCalcState) {
    let changes = [];
    // Check if viewport changed, gridlines etc.
    let areGraphsEqual = JSON.stringify(oldCalcState.graph) == JSON.stringify(newCalcState.graph);
    if (!areGraphsEqual) {
      changes.push({type: "graphChange", newGraph: newCalcState.graph});
    }
    // Check if expressions were added or changed
    let oldExp = oldCalcState.expressions.list, newExp = newCalcState.expressions.list;
    let expMap = {};
    for (let exp of oldExp) {
      // {type: "expression", id: "1", color: "#c74440", latex: "y=x"}
      expMap[exp.id] = {exp, deleted: true};
    }
    for (let exp of newExp) {
      let cmp = expMap[exp.id];
      if (typeof cmp !== "object") {
        changes.push({type: "addExpr", exp});
      } else {
        cmp.deleted = false;
        if (JSON.stringify(cmp.exp) !== JSON.stringify(exp)) {
          changes.push({type: "changeExpr", exp});
        }
      }
    }
    for (let exp of oldExp) {
      if (expMap[exp.id].deleted) changes.push({type: "deleteExpr", exp});
    }
    return changes;
  }
}

function App() {
  return (
    <div className="App">
      {/*<header className="App-header">*/}
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        {/*<p>*/}
          {/*Edit <code>src/App.js</code> and save to reload.*/}
        {/*</p>*/}
        {/*<a*/}
          {/*className="App-link"*/}
          {/*href="https://reactjs.org"*/}
          {/*target="_blank"*/}
          {/*rel="noopener noreferrer"*/}
        {/*>*/}
          {/*Learn React*/}
        {/*</a>*/}
      {/*</header>*/}
      <Calculator/>
    </div>
  );
}

export default App;

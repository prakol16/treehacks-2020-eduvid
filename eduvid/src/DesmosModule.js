import React from "react";
import ClassroomModule from './BaseClassroomModule.js';

export default class Calculator extends ClassroomModule {
    constructor(props) {
        super(props);
        this.calculatorRef = React.createRef();
        this.updateListener = 0;
    }

    render() {
        return (
            <div style={{display: 'inline-flex', margin: 20}}>
                <div style={{width: 600, height: 400, margin: 'auto'}} ref={this.calculatorRef}></div><br />
                <p>
                    <button onClick={() => this.saveJSON()}>View recorded actions</button>
                </p>
            </div>
        );
    }

    getModuleState() {
        return this.calculator.getState();
    }

    popModuleState(state) {
        this.calculator.setState(state);
    }

    setupEventListener() {
        this.calculatorEvents = [];
        this.oldCalculatorState = this.calculator.getState();
        this.timelineStart = Date.now();
        // this.calculator.observeEvent("change", () => {
        this.updateListener = setInterval(() => {
            let newState = this.calculator.getState();
            let delta = this.computeDelta(this.oldCalculatorState, newState);
            if (delta.length > 0) {
                this.calculatorEvents.push({
                    timestamp: Date.now() - this.timelineStart,
                    changes: delta
                });
                console.log("Changes", delta);
                this.oldCalculatorState = newState;
            }
        });
    }

    componentDidMount() {
        let elt = this.calculatorRef.current;
        this.calculator = window.Desmos.GraphingCalculator(elt);
        if (this.props.isTeacher) this.setupEventListener();
    }

    componentWillUnmount() {
        clearInterval(this.updateListener);
    }

    saveJSON() {
        console.log(JSON.stringify({events: this.calculatorEvents}));
    }

    replayEvent(evList) {
        for (let event of evList.changes) {
            if (event.type === "resetState") {
                this.calculator.setState(event.newState);
            } else if (event.type === "graphChange") {
                this.calculator.graph = event.newGraph;
            } else if (event.type === "addExpr" || event.type === "changeExpr") {
                this.calculator.setExpression(event.exp);
            } else if (event.type === "deleteExpr") {
                this.calculator.removeExpression(event.exp);
            } else console.error("Don't know event type", event.type, "in", event);
        }
    }

    unreplayEvent(evList) {
        for (let event of evList.changes) {
            if (event.type === "resetState") {
                this.calculator.setState(event.oldState);
            } else if (event.type === "graphChange") {
                this.calculator.graph = event.oldGraph;
            } else if (event.type === "changeExpr") {
                this.calculator.setExpression(event.oldExp);
            } else if (event.type === "deleteExpr") {
                this.calculator.setExpression(event.exp);
            } else if (event.type === "addExpr") {
                this.calculator.removeExpression(event.exp);
            } else console.error("Don't know event type", event.type, "in", event);
        }
    }

    /*
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
    }*/

    computeDelta(oldCalcState, newCalcState) {
        let changes = [];
        // Check if viewport changed, gridlines etc.
        let areGraphsEqual = JSON.stringify(oldCalcState.graph) === JSON.stringify(newCalcState.graph);
        if (!areGraphsEqual) {
            changes.push({type: "graphChange", newGraph: newCalcState.graph, oldGraph: oldCalcState.graph});
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
                    changes.push({type: "changeExpr", exp, oldExp: expMap[exp.id].exp});
                }
            }
        }
        for (let exp of oldExp) {
            if (expMap[exp.id].deleted) changes.push({type: "deleteExpr", exp});
        }
        return changes;
    }
}
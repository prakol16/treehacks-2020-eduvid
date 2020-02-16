import React from "react";
import ClassroomModule from './BaseClassroomModule.js';

export default class Calculator extends ClassroomModule {
    constructor(props) {
        super(props);
        this.calculatorRef = React.createRef();
        this.updateListener = 0;
        this.hasViewChanged = false;
    }

    render() {
        return (
            <div style={{width: this.props.width, height: this.props.height, margin: 'auto'}} ref={this.calculatorRef}></div>
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
                this.oldCalculatorState = newState;
            }
        }, 30);
    }

    resetView() {
        let viewport = this.oldViewport;
        this.hasViewChanged = false;
        this.calculator.setViewport([viewport.xmin, viewport.xmax, viewport.ymin, viewport.ymax]);
    }

    componentDidMount() {
        let elt = this.calculatorRef.current;
        this.calculator = window.Desmos.GraphingCalculator(elt);
        if (this.props.isTeacher) this.setupEventListener();
        else {
            this.oldViewport = this.calculator.getState().graph.viewport;
            this.calculator.observeEvent("change", () => {
                let newViewport = this.calculator.getState().graph.viewport;
                if (!this.hasViewChanged && JSON.stringify(newViewport) !== JSON.stringify(this.oldViewport)) {
                    this.hasViewChanged = true;
                } else {
                    this.oldViewport = newViewport;
                    this.hasViewChanged = false;
                }
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateListener);
    }

    saveJSON() {
        let r = JSON.stringify({events: this.calculatorEvents});
        // Why, oh why are we parsing JSON with regex?
        // Especially given that there is built in parsing, native to JS for JSON parsing?!?!
        // This is what too little sleep does to you
        r = r.replace(/\"id\":\"/g, '"id":"t');
        return JSON.parse(r);
    }

    resetJSON() {
        this.calculatorEvents = [{timestamp: 0, changes: [{type: "resetState", newState: this.calculator.getState(), oldState: this.calculator.getState()}]}];
        this.timelineStart = Date.now();
    }

    setGraphStateFromVideo(newGraph) {
        let viewport = newGraph.viewport;
        this.calculator.updateSettings(newGraph);
        this.calculator.setDefaultState({graph: newGraph});
        this.oldViewport = viewport;
        if (!this.hasViewChanged) {
            this.calculator.setViewport([viewport.xmin, viewport.xmax, viewport.ymin, viewport.ymax]);
        }
    }

    replayEvent(evList) {
        for (let event of evList.changes) {
            if (event.type === "resetState") {
                this.calculator.setState(event.newState);
            } else if (event.type === "graphChange") {
                this.setGraphStateFromVideo(event.newGraph);
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
                this.setGraphStateFromVideo(event.oldGraph);
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
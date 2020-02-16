import {SketchField, Tools} from 'react-sketch'
import React from 'react';
import ClassroomModule from './BaseClassroomModule';

export default class BlackboardModule extends ClassroomModule {
    constructor(props) {
        super(props, true);
        this.sketch = React.createRef();
        this.frontSketch = React.createRef();
        this.state = {tool: Tools.Pencil};
        this.oldObjects = [];
        this.updateInterval = -1;
        this.changeQueue = [];
        this.oldState = {};
    }

    getModuleState() {
        return {back: !this.props.isTeacher && this.sketch.current.toJSON(), front: this.frontSketch.current.toJSON()};
    }

    popModuleState(state) {
        if (!this.props.isTeacher) this.sketch.current.fromJSON(state.back);
        this.frontSketch.current.fromJSON(state.front);
    }

    replayEvent(event, fullState) {
        // let state = fullState.back;
        // let evt = event.delta;
        // if (evt.type === "modified") {
        //     state.objects[evt.modified] = evt.newObj;
        // } else if (evt.type === "added") {
        //     state.objects.splice(evt.i, 0, evt.newObj);
        // } else if (evt.type === "deleted") {
        //     state.objects.splice(evt.deleted, 1);
        // } else {
        //     console.error("Unkown event type", evt.type, evt);
        // }
        // return fullState;
        return {back: event.newState, front: fullState.front};
    }

    saveJSON() {
        console.log(JSON.stringify({events: this.changeQueue}));
    }

    unreplayEvent(event, fullState) {
        // let state = fullState.back;
        // let evt = event.delta;
        // if (evt.type === "modified") {
        //     state.objects[evt.modified] = evt.oldObj;
        // } else if (evt.type === "added") {
        //     state.objects.splice(evt.i, 1);
        // } else if (evt.type === "deleted") {
        //     state.objects.splice(evt.deleted, 0, evt.oldObj);
        // } else {
        //     console.error("Unkown event type", evt.type, evt);
        // }
        // return fullState;
        return {back: event.oldState, front: fullState.front};
    }

    render() {
        return (
            <>
            <div style={{position: 'relative', display: 'inline-block'}}>
                {this.props.isTeacher ? null : (<SketchField width='600px'
                             height='400px'
                             lineColor='black'
                             lineWidth={3}
                             ref={this.sketch}
                             style={{position: 'absolute', top: 0, left: 0}}
                             onKeyUp={(ev) => console.log(ev.key)}
                            key="1" />)}
                 <SketchField key="2"
                            width='600px'
                            height='400px'
                            tool={this.state.tool}
                            lineColor='black'
                            lineWidth={3}
                            ref={this.frontSketch}
                            style={{position: 'absolute', top: 0, left: 0}} />
                <br />
            </div>
                <button onClick={() => this.setState({tool: Tools.Select})}>Select</button>
                <button onClick={() => this.setState({tool: Tools.Pencil})}>Draw Pencils</button>
                <button onClick={() => this.setState({tool: Tools.Line})}>Draw Lines</button>
                <button onClick={() => this.setState({tool: Tools.Pan})}>Pan</button>
            </>
        );
    }

    computeDelta() {
        let sketch = this.sketch.current;
        let newObjs = sketch.toJSON().objects;
        let jsonStrs = this.oldObjects.map(obj => JSON.stringify(obj));
        let objMap = {};
        for (let i = 0; i < this.oldObjects.length; ++i) objMap[jsonStrs[i]] = {deleted: true, obj: this.oldObjects[i]};
        let added = [];
        for (let i = 0; i < newObjs.length; ++i) {
            let newObj = newObjs[i];
            let newObjJSON = JSON.stringify(newObj);
            if (newObjJSON in objMap) {
                objMap[newObjJSON].deleted = false;
            } else {
                added.push({newObj, i, type: "added"});
            }
        }

        let deleted = [];
        for (let i = 0; i < this.oldObjects.length; ++i) {
            if (objMap[jsonStrs[i]].deleted) deleted.push(i);
        }
        let r = null;
        if (deleted.length > 1 || added.length > 1) {
            console.error("Could not compute differences");
        } else if (deleted.length === 1 && added.length === 1) {
            let i = deleted[0];
            r = {type: "modified", modified: i, newObj: newObjs[i], oldObj: this.oldObjects[i]};
        } else if (deleted.length === 0 && added.length === 1) {
            r = added[0];
        } else if (added.length === 0 && deleted.length === 1) {
            let i = deleted[0];
            r = {deleted: i, oldObj: this.oldObjects[i], type: "deleted"};
        }
        this.oldObjects = newObjs;
        return r;
    }

    componentDidMount() {
        if (this.props.isTeacher) {
            this.timelineStart = Date.now();
            this.oldState = this.frontSketch.current.toJSON();
            this.updateInterval = setInterval(() => {
                // let delta = this.computeDelta();
                // if (delta !== null) this.changeQueue.push({timestamp: Date.now() - this.timelineStart, delta});
                let newState = this.frontSketch.current.toJSON();
                if (JSON.stringify(newState) !== JSON.stringify(this.oldState)) {
                    this.changeQueue.push({timestamp: Date.now()  - this.timelineStart, oldState: this.oldState, newState});
                    this.oldState = newState;
                }
            }, 30);
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }
}
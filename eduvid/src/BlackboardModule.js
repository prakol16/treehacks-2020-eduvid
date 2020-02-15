import {SketchField, Tools} from 'react-sketch'
import React from 'react';
import ClassroomModule from './BaseClassroomModule';

export default class BlackboardModule extends ClassroomModule {
    constructor(props) {
        super(props);
        this.sketch = React.createRef();
        this.state = {tool: Tools.Pencil};
        this.oldObjects = [];
        this.updateInterval = -1;
        this.changeQueue = [];
    }

    getModuleState() {
        return this.sketch.current.toJSON();
    }

    popModuleState(state) {
        this.sketch.current.fromJSON(state);
    }

    replayEvent(event) {
        let evt = event.delta;
        let state = this.sketch.current.toJSON();
        if (evt.type === "modified") {
            state.objects[evt.modified] = evt.newObj;
        } else if (evt.type === "added") {
            state.objects.splice(evt.i, 0, evt.newObj);
        } else if (evt.type === "deleted") {
            state.objects.splice(evt.deleted, 1);
        } else {
            console.error("Unkown event type", evt.type, evt);
        }
        this.sketch.current.fromJSON(state);
    }

    saveJSON() {
        console.log(JSON.stringify({events: this.changeQueue}));
    }

    unreplayEvent(event) {
        let evt = event.delta;
        let state = this.sketch.current.toJSON();
        if (evt.type === "modified") {
            state.objects[evt.modified] = evt.oldObj;
        } else if (evt.type === "added") {
            state.objects.splice(evt.i, 1);
        } else if (evt.type === "deleted") {
            state.objects.splice(evt.deleted, 0, evt.oldObj);
        } else {
            console.error("Unkown event type", evt.type, evt);
        }
        this.sketch.current.fromJSON(state);
    }

    render() {
        return (
            <div style={{display: 'inline-flex'}}>
                <SketchField width='600px'
                             height='400px'
                             tool={this.state.tool}
                             lineColor='black'
                             lineWidth={3}
                             ref={this.sketch} />
                <br />
                <button onClick={() => this.setState({tool: Tools.Select})}>Select</button>
                <button onClick={() => this.setState({tool: Tools.Pencil})}>Draw Pencils</button>
                <button onClick={() => this.setState({tool: Tools.Line})}>Draw Lines</button>
            </div>
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
            this.updateInterval = setInterval(() => {
                let delta = this.computeDelta();
                if (delta !== null) this.changeQueue.push({timestamp: Date.now() - this.timelineStart, delta});
            }, 30);
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }
}
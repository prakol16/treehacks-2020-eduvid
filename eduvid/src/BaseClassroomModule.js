import React from "react";

export default class ClassroomModule extends React.Component {
    constructor(props) {
        super(props);
        this.eventIndex = 0;
    }

    render() {
        console.error("ClassroomModule should not have render() called. Sub-class it first");
        return (
            <div></div>
        );
    }

    getState() {
        return {
            eventIndex: this.eventIndex,
            // eventsToPlay: this.this.eventsToPlay,
            moduleState: this.getModuleState()
        };
    }

    popState(state) {
        this.eventIndex = state.eventIndex;
        // this.eventsToPlay = state.eventsToPlay;
        this.popModuleState(state.moduleState);
    }

    updateVideoTime(timestamp) {
        let eventsToPlay = this.props.eventList.events;
        if (eventsToPlay.length === 0) return;
        let directionRight = this.eventIndex < eventsToPlay.length && timestamp >= eventsToPlay[this.eventIndex].timestamp;
        if (directionRight) {
            while (this.eventIndex < eventsToPlay.length && timestamp >= eventsToPlay[this.eventIndex].timestamp) {
                this.replayEvent(eventsToPlay[this.eventIndex]);
                this.eventIndex++;
            }
        } else {
            while (this.eventIndex > 0 && timestamp < eventsToPlay[this.eventIndex - 1].timestamp) {
                this.eventIndex--;
                this.unreplayEvent(eventsToPlay[this.eventIndex]);
            }
        }
    }

}
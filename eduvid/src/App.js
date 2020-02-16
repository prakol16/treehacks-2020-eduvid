import React from 'react';
import * as firebase from 'firebase';
import * as RecordRTC from 'recordrtc';
import './App.css';
import Calculator from './DesmosModule.js';
import BlackboardModule from './BlackboardModule';

var firebaseConfig = {
  apiKey: "AIzaSyBEel9oOrtV4m9oFGBli4lNJZAcLslLzUk",
  authDomain: "edumedia-552e9.firebaseapp.com",
  databaseURL: "https://edumedia-552e9.firebaseio.com",
  projectId: "edumedia-552e9",
  storageBucket: "edumedia-552e9.appspot.com",
  messagingSenderId: "106999035808",
  appId: "1:106999035808:web:b69fcc1e15418db8b116c5",
  measurementId: "G-C478GW9QCD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var storage = firebase.storage().ref();

var allVideos = database.ref("videoData").once("value");

class VideoModuleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {moduleType: "calc", moduleEvents: {}, isViewFull: true, isViewVideo: true, recording: false, url: ""};
    this.state.recordSrc = "";
    this.lastStateStack = {};
    this.classModule = React.createRef();
    this.video = React.createRef();
    this.recorder = null;
  }

  getRequestPromise() {
    return this.props.selectedLesson ?  allVideos.then(snapshot => {
      let val = snapshot.val();
      console.log(val, this.props.selectedLesson);
      return val[this.props.selectedLesson]
    }) : Promise.resolve({events: []});
  }

  getWidth() {
    return this.state.isViewFull ? 1440 : (1440 - 224);
  }

  getMainModule() {
    if (this.state.moduleType === "calc") {
      return <Calculator ref={this.classModule} isTeacher={this.props.isTeacher} eventList={this.state.moduleEvents.calc || {events: []}}
              width={this.getWidth()} height={900} />;
    } else if (this.state.moduleType === "blackboard") {
      return <BlackboardModule ref={this.classModule} isTeacher={this.props.isTeacher} eventList={this.state.moduleEvents.blackboard || {events: []}}
                               width={this.getWidth()} height={900} />;
    }
  }

  componentDidMount() {
    if (this.props.isTeacher) {
      let _this = this;
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then(async function (stream) {
        console.log("Stream", stream);
        _this.video.current.srcObject = stream;
        // _this.setState({recordSrc: window.URL.createObjectURL(stream)});
        let recorder = RecordRTC(stream, {
          type: 'video',
          video: _this.video.current
        });
        _this.recorder = recorder;
      });
    } else {
      this.getVideoURL();
    }
  }

  getVideoURL() {
    if (!this.props.isTeacher && this.props.selectedLesson) {
      storage.child(this.props.selectedLesson + '.webm').getDownloadURL().then(url => this.setState({url}));
      this.getRequestPromise().then(events => this.setState({
          moduleEvents: {calc: {events}}
      }));
    }
  }

  startRecording() {
    if (!this.recorder) return false;
    this.recorder.startRecording();
    return true;
  }

  changeModule(newModuleType) {
    this.lastStateStack[this.state.moduleType] = this.classModule.current.getState();
    this.setState({moduleType: newModuleType});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.moduleType !== this.state.moduleType) {
      if (typeof this.lastStateStack[this.state.moduleType] === "object") {
        this.classModule.current.popState(this.lastStateStack[this.state.moduleType]);
      }
      this.classModule.current.updateVideoTime(this.video.current.currentTime * 1000);
    }
    if (prevProps.selectedLesson !== this.props.selectedLesson) {
      this.getVideoURL();
    }
  }

  render() {
    return (
        <div style={{display: 'inline-flex', position: 'relative', padding: 20}}>
          <div style={{display: !this.state.isViewFull || this.state.isViewVideo ? '' : 'none', margin: 10}}>
            <video ref={this.video} src={this.state.url} preload='auto'
                   width={this.state.isViewFull ? 1440 : 400} autoPlay={this.props.isTeacher}
                   muted={this.props.isTeacher} type={this.props.isTeacher ? "video/webm" : "video/mp4"} controls onTimeUpdate={() => this.classModule.current.updateVideoTime(this.video.current.currentTime * 1000)}>
              Your browser does not support video lol
            </video>
          </div>
          <div style={{display: this.state.isViewFull && this.state.isViewVideo ? 'none' : '', margin: 10}}>
          {this.getMainModule()}
          </div>
          {(!this.props.isTeacher ? null :
          <img src={this.state.recording ? 'record_red.png' : 'record_black.png'} onClick={this.handleRecordingClick.bind(this)} className="nav-icon record-icon" />)}
          <img src='desmos_icon.png' onClick={() => this.setState(this.toggleViewVideo)} className="nav-icon nav-icon-top" />
          <img src='split_icon.png' onClick={() => this.setState(this.toggleViewFull)} className="nav-icon nav-icon-bottom" />
        </div>
    );
  }

  handleRecordingClick() {
    if (!this.state.recording) {
      if (this.startRecording()) {
        this.classModule.current.resetJSON();
        this.setState({recording: true});
      }
    } else {
      this.recorder.stopRecording(() => {
        let blob = this.recorder.getBlob();
        console.log(blob);
        // console.log(this.classModule.current.saveJSON());
        // let data = new FormData();
        // data.append('data', blob);
        let videoId = Math.random().toString().slice(2);
        let jsonEvents = this.classModule.current.saveJSON();
        // fetch("http://10.19.190.207:5000/video/vid-" + videoId, {
        //   method: "POST",
        //   body: data,
        //   mode: 'no-cors'
        // });
        storage.child("vid-" + videoId + ".webm").put(blob).then(console.log);
        database.ref("videoData").child("vid-" + videoId).set(jsonEvents.events);
        this.setState({recording: false});
      });
    }
  }

  toggleViewVideo(state) {
    return {isViewVideo: !state.isViewVideo, isViewFull: true};
  }

  toggleViewFull(state) {
    return {isViewFull: !state.isViewFull};
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {options: [], selectedVideo: ''};
    allVideos.then(snapshot => {
      let v = snapshot.val();
      let options = [];
      for (let key in v) {
        if (v.hasOwnProperty(key)) {
          options.push(
              <option key={key} value={key}>{key.slice(0,10)}</option>
          );
        }
      }
      this.setState({options})
    });
  }

  render() {
    let isTeacher = !/student/.test(window.location.pathname);
    return (
        <div className="App">
          <header className="App-header">
            Contact Us
          </header>
          <div className="App-top">
            <span className="edumedia text-style-1">EDU</span>
            <span className="edumedia">MEDIA</span>
            <input type='search' className='search-bar' placeholder="Type text here..."/>
            <span className="App-top-text">Courses</span>
            <span className="App-top-text">Instructors</span>
            <span className="App-top-text">DesmosLive</span>
          </div>
          {isTeacher ? null : (
              <div className="select-lesson">
                <select onChange={(e) => this.setState({selectedVideo: e.target.value})}>
                  <option value="" key="0">Choose video</option>
                  {this.state.options}
                </select>
              </div>
          )}
          <div style={{textAlign: 'center'}}>
            <VideoModuleView isTeacher={isTeacher} selectedLesson={this.state.selectedVideo}/>
          </div>
        </div>
    );
  }
}

export default App;

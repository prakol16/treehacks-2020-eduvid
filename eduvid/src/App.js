import React from 'react';
import logo from './logo.svg';
import './App.css';
import Calculator from './DesmosModule.js';

class VideoModuleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {moduleType: "calc", moduleEvents: {}};
    this.lastStateStack = {};
    this.classModule = React.createRef();
    this.video = React.createRef();
    if (!props.isTeacher) {
      this.getRequestPromise().then((result) => JSON.parse(result)).then(events => this.setState({
        moduleEvents: {calc: events}
      }));
    }
  }

  getRequestPromise() {
    // TODO: load this, don't set it manually
    return new Promise((resolve) => {
      setTimeout(resolve.bind(this), 1000, `{"events":[{"timestamp":3508,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y"},"oldExp":{"type":"expression","id":"1t","color":"#c74440"}}]},{"timestamp":3680,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y="},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y"}}]},{"timestamp":4012,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y="}}]},{"timestamp":4397,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{ }"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x"}}]},{"timestamp":4910,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{ }"}}]},{"timestamp":5454,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}+"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}"}}]},{"timestamp":5776,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}+2"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}+"}}]}]}`);
    })
  }

  getMainModule() {
    if (this.state.moduleType === "calc") {
      return <Calculator ref={this.classModule} isTeacher={this.props.isTeacher} eventList={this.state.moduleEvents.calc || []}/>;
    } else if (this.state.moduleType === "blackboard") {
      return <div ref={this.classModule}></div>;
    }
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
  }

  render() {
    return (
        <div>
          <video ref={this.video} src="https://www.w3schools.com/html/movie.mp4"
                 type="video/mp4" controls onTimeUpdate={() => this.classModule.current.updateVideoTime(this.video.current.currentTime * 1000)}>
            Your browser does not support video lol
          </video>
          {this.getMainModule()}
        </div>
    );
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
      {/*<Calculator/>*/}
      <VideoModuleView isTeacher={false}/>
    </div>
  );
}

export default App;

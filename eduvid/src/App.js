import React from 'react';
import logo from './logo.svg';
import * as RecordRTC from 'recordrtc';
import './App.css';
import Calculator from './DesmosModule.js';
import BlackboardModule from './BlackboardModule';

class VideoModuleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {moduleType: "calc", moduleEvents: {}, isViewFull: true, isViewVideo: true, recording: false};
    this.state.recordSrc = "";
    this.lastStateStack = {};
    this.classModule = React.createRef();
    this.video = React.createRef();
    this.recorder = null;
    if (!props.isTeacher) {
      this.getRequestPromise().then((result) => JSON.parse(result)).then(events => this.setState({
        moduleEvents: {calc: events}
      }));
    }
  }

  getRequestPromise() {
    // TODO: load this, don't set it manually
    return new Promise((resolve) => {
      setTimeout(resolve.bind(this), 1000,
          // `{"events":[{"timestamp":3508,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y"},"oldExp":{"type":"expression","id":"1t","color":"#c74440"}}]},{"timestamp":3680,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y="},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y"}}]},{"timestamp":4012,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y="}}]},{"timestamp":4397,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{ }"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x"}}]},{"timestamp":4910,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{ }"}}]},{"timestamp":5454,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}+"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}"}}]},{"timestamp":5776,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}+2"},"oldExp":{"type":"expression","id":"1t","color":"#c74440","latex":"y=x^{3}+"}}]}]}`
      // `{"events":[{"timestamp":2727,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-10.0625,"ymin":-12.375,"xmax":9.9375,"ymax":12.625}},"oldGraph":{"viewport":{"xmin":-10,"ymin":-12.5,"xmax":10,"ymax":12.5}}}]},{"timestamp":2741,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-10.5,"ymin":-10.9375,"xmax":9.5,"ymax":14.0625}},"oldGraph":{"viewport":{"xmin":-10.0625,"ymin":-12.375,"xmax":9.9375,"ymax":12.625}}}]},{"timestamp":2756,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-11.0625,"ymin":-9.4375,"xmax":8.9375,"ymax":15.5625}},"oldGraph":{"viewport":{"xmin":-10.5,"ymin":-10.9375,"xmax":9.5,"ymax":14.0625}}}]},{"timestamp":2769,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-11.4375,"ymin":-8.4375,"xmax":8.5625,"ymax":16.5625}},"oldGraph":{"viewport":{"xmin":-11.0625,"ymin":-9.4375,"xmax":8.9375,"ymax":15.5625}}}]},{"timestamp":2775,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-11.625,"ymin":-8.125,"xmax":8.375,"ymax":16.875}},"oldGraph":{"viewport":{"xmin":-11.4375,"ymin":-8.4375,"xmax":8.5625,"ymax":16.5625}}}]},{"timestamp":2788,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-12,"ymin":-7.4375,"xmax":8,"ymax":17.5625}},"oldGraph":{"viewport":{"xmin":-11.625,"ymin":-8.125,"xmax":8.375,"ymax":16.875}}}]},{"timestamp":2804,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-12.25,"ymin":-7,"xmax":7.75,"ymax":18}},"oldGraph":{"viewport":{"xmin":-12,"ymin":-7.4375,"xmax":8,"ymax":17.5625}}}]},{"timestamp":2809,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-12.25,"ymin":-6.9375,"xmax":7.75,"ymax":18.0625}},"oldGraph":{"viewport":{"xmin":-12.25,"ymin":-7,"xmax":7.75,"ymax":18}}}]},{"timestamp":2824,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-12.3125,"ymin":-6.8125,"xmax":7.6875,"ymax":18.1875}},"oldGraph":{"viewport":{"xmin":-12.25,"ymin":-6.9375,"xmax":7.75,"ymax":18.0625}}}]},{"timestamp":2833,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-12.375,"ymin":-6.8125,"xmax":7.625,"ymax":18.1875}},"oldGraph":{"viewport":{"xmin":-12.3125,"ymin":-6.8125,"xmax":7.6875,"ymax":18.1875}}}]},{"timestamp":2844,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-12.375,"ymin":-6.6875,"xmax":7.625,"ymax":18.3125}},"oldGraph":{"viewport":{"xmin":-12.375,"ymin":-6.8125,"xmax":7.625,"ymax":18.1875}}}]},{"timestamp":2872,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-12.375,"ymin":-6.625,"xmax":7.625,"ymax":18.375}},"oldGraph":{"viewport":{"xmin":-12.375,"ymin":-6.6875,"xmax":7.625,"ymax":18.3125}}}]},{"timestamp":3688,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-10.375,"ymin":-8,"xmax":9.625,"ymax":17}},"oldGraph":{"viewport":{"xmin":-12.375,"ymin":-6.625,"xmax":7.625,"ymax":18.375}}}]},{"timestamp":3693,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-10.125,"ymin":-8.25,"xmax":9.875,"ymax":16.75}},"oldGraph":{"viewport":{"xmin":-10.375,"ymin":-8,"xmax":9.625,"ymax":17}}}]},{"timestamp":3707,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-9.4375,"ymin":-8.875,"xmax":10.5625,"ymax":16.125}},"oldGraph":{"viewport":{"xmin":-10.125,"ymin":-8.25,"xmax":9.875,"ymax":16.75}}}]},{"timestamp":3721,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-8.6875,"ymin":-9.6875,"xmax":11.3125,"ymax":15.3125}},"oldGraph":{"viewport":{"xmin":-9.4375,"ymin":-8.875,"xmax":10.5625,"ymax":16.125}}}]},{"timestamp":3736,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-8.0625,"ymin":-10.625,"xmax":11.9375,"ymax":14.375}},"oldGraph":{"viewport":{"xmin":-8.6875,"ymin":-9.6875,"xmax":11.3125,"ymax":15.3125}}}]},{"timestamp":3744,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.875,"ymin":-11,"xmax":12.125,"ymax":14}},"oldGraph":{"viewport":{"xmin":-8.0625,"ymin":-10.625,"xmax":11.9375,"ymax":14.375}}}]},{"timestamp":3752,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.6875,"ymin":-11.3125,"xmax":12.3125,"ymax":13.6875}},"oldGraph":{"viewport":{"xmin":-7.875,"ymin":-11,"xmax":12.125,"ymax":14}}}]},{"timestamp":3757,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.5625,"ymin":-11.4375,"xmax":12.4375,"ymax":13.5625}},"oldGraph":{"viewport":{"xmin":-7.6875,"ymin":-11.3125,"xmax":12.3125,"ymax":13.6875}}}]},{"timestamp":3765,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.5,"ymin":-11.625,"xmax":12.5,"ymax":13.375}},"oldGraph":{"viewport":{"xmin":-7.5625,"ymin":-11.4375,"xmax":12.4375,"ymax":13.5625}}}]},{"timestamp":3771,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.375,"ymin":-11.75,"xmax":12.625,"ymax":13.25}},"oldGraph":{"viewport":{"xmin":-7.5,"ymin":-11.625,"xmax":12.5,"ymax":13.375}}}]},{"timestamp":3776,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.375,"ymin":-11.8125,"xmax":12.625,"ymax":13.1875}},"oldGraph":{"viewport":{"xmin":-7.375,"ymin":-11.75,"xmax":12.625,"ymax":13.25}}}]},{"timestamp":3787,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.3125,"ymin":-11.9375,"xmax":12.6875,"ymax":13.0625}},"oldGraph":{"viewport":{"xmin":-7.375,"ymin":-11.8125,"xmax":12.625,"ymax":13.1875}}}]},{"timestamp":3790,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.25,"ymin":-12,"xmax":12.75,"ymax":13}},"oldGraph":{"viewport":{"xmin":-7.3125,"ymin":-11.9375,"xmax":12.6875,"ymax":13.0625}}}]},{"timestamp":3806,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.125,"ymin":-12.1875,"xmax":12.875,"ymax":12.8125}},"oldGraph":{"viewport":{"xmin":-7.25,"ymin":-12,"xmax":12.75,"ymax":13}}}]},{"timestamp":3816,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-7.0625,"ymin":-12.25,"xmax":12.9375,"ymax":12.75}},"oldGraph":{"viewport":{"xmin":-7.125,"ymin":-12.1875,"xmax":12.875,"ymax":12.8125}}}]},{"timestamp":3825,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-6.9375,"ymin":-12.4375,"xmax":13.0625,"ymax":12.5625}},"oldGraph":{"viewport":{"xmin":-7.0625,"ymin":-12.25,"xmax":12.9375,"ymax":12.75}}}]},{"timestamp":3840,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-6.8125,"ymin":-12.625,"xmax":13.1875,"ymax":12.375}},"oldGraph":{"viewport":{"xmin":-6.9375,"ymin":-12.4375,"xmax":13.0625,"ymax":12.5625}}}]},{"timestamp":3855,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-6.6875,"ymin":-12.8125,"xmax":13.3125,"ymax":12.1875}},"oldGraph":{"viewport":{"xmin":-6.8125,"ymin":-12.625,"xmax":13.1875,"ymax":12.375}}}]},{"timestamp":3869,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-6.5625,"ymin":-12.9375,"xmax":13.4375,"ymax":12.0625}},"oldGraph":{"viewport":{"xmin":-6.6875,"ymin":-12.8125,"xmax":13.3125,"ymax":12.1875}}}]},{"timestamp":3876,"changes":[{"type":"graphChange","newGraph":{"viewport":{"xmin":-6.5,"ymin":-13.0625,"xmax":13.5,"ymax":11.9375}},"oldGraph":{"viewport":{"xmin":-6.5625,"ymin":-12.9375,"xmax":13.4375,"ymax":12.0625}}}]}]}`
      // `{"events":[{"timestamp":4622,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1","color":"#c74440","latex":"="},"oldExp":{"type":"expression","id":"1","color":"#c74440"}}]},{"timestamp":4962,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1","color":"#c74440"},"oldExp":{"type":"expression","id":"1","color":"#c74440","latex":"="}}]},{"timestamp":5210,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1","color":"#c74440","latex":"y"},"oldExp":{"type":"expression","id":"1","color":"#c74440"}}]},{"timestamp":5408,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1","color":"#c74440","latex":"y="},"oldExp":{"type":"expression","id":"1","color":"#c74440","latex":"y"}}]},{"timestamp":5764,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"1","color":"#c74440","latex":"y=x"},"oldExp":{"type":"expression","id":"1","color":"#c74440","latex":"y="}}]},{"timestamp":6950,"changes":[{"type":"addExpr","exp":{"type":"expression","id":"2","color":"#2d70b3"}}]},{"timestamp":7694,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y"},"oldExp":{"type":"expression","id":"2","color":"#2d70b3"}}]},{"timestamp":7793,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y="},"oldExp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y"}}]},{"timestamp":8101,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y=x"},"oldExp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y="}}]},{"timestamp":8390,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y=x^{ }"},"oldExp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y=x"}}]},{"timestamp":8611,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y=x^{2}"},"oldExp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y=x^{ }"}}]},{"timestamp":8946,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y=x^{2}-"},"oldExp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y=x^{2}"}}]},{"timestamp":9561,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y=x^{2}-3"},"oldExp":{"type":"expression","id":"2","color":"#2d70b3","latex":"y=x^{2}-"}}]}]}`
      //   `{"events":[{"timestamp":2474,"oldState":{"version":"2.4.3","objects":[],"background":"transparent"},"newState":{"version":"2.4.3","objects":[{"type":"path","version":"2.4.3","originX":"left","originY":"top","left":83.82101041666667,"top":8.447248756218906,"width":0.01,"height":0.01,"fill":null,"stroke":"black","strokeWidth":3,"strokeDashArray":null,"strokeLineCap":"round","strokeLineJoin":"round","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"path":[["M",85.32101041666667,9.947248756218906],["L",85.32701041666667,9.953248756218906]]}],"background":"transparent"}},{"timestamp":3571,"oldState":{"version":"2.4.3","objects":[{"type":"path","version":"2.4.3","originX":"left","originY":"top","left":83.82101041666667,"top":8.447248756218906,"width":0.01,"height":0.01,"fill":null,"stroke":"black","strokeWidth":3,"strokeDashArray":null,"strokeLineCap":"round","strokeLineJoin":"round","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"path":[["M",85.32101041666667,9.947248756218906],["L",85.32701041666667,9.953248756218906]]}],"background":"transparent"},"newState":{"version":"2.4.3","objects":[{"type":"path","version":"2.4.3","originX":"left","originY":"top","left":83.82101041666667,"top":8.447248756218906,"width":0.01,"height":0.01,"fill":null,"stroke":"black","strokeWidth":3,"strokeDashArray":null,"strokeLineCap":"round","strokeLineJoin":"round","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"path":[["M",85.32101041666667,9.947248756218906],["L",85.32701041666667,9.953248756218906]]},{"type":"path","version":"2.4.3","originX":"left","originY":"top","left":91.79434375000002,"top":36.307945273631844,"width":258.14,"height":31.84,"fill":null,"stroke":"black","strokeWidth":3,"strokeDashArray":null,"strokeLineCap":"round","strokeLineJoin":"round","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"path":[["M",93.29434375000001,37.807945273631844],["Q",93.29734375000001,37.810945273631845,97.78234375000001,38.80597014925374],["Q",102.26734375000001,39.800995024875625,108.74567708333333,41.791044776119406],["Q",115.22401041666667,43.78109452736319,126.68567708333333,46.76616915422886],["Q",138.14734375,49.75124378109453,146.61901041666667,51.74129353233831],["Q",155.09067708333333,53.73134328358209,162.06734375000002,55.72139303482587],["Q",169.04401041666668,57.711442786069654,175.52234375,59.20398009950249],["Q",182.00067708333333,60.69651741293532,186.98401041666665,62.189054726368155],["Q",191.96734375,63.681592039801,195.95401041666668,64.17910447761194],["Q",199.94067708333333,64.67661691542288,202.93067708333334,65.17412935323384],["Q",205.92067708333335,65.67164179104478,208.91067708333333,66.16915422885572],["Q",211.90067708333333,66.66666666666667,215.88734375,67.16417910447763],["Q",219.87401041666666,67.66169154228857,223.36234375,68.1592039800995],["Q",226.85067708333335,68.65671641791045,229.84067708333333,68.65671641791045],["Q",232.83067708333334,68.65671641791045,236.81734375000002,68.65671641791045],["Q",240.80401041666667,68.65671641791045,243.79401041666668,69.15422885572139],["Q",246.7840104166667,69.65174129353234,250.77067708333334,69.65174129353234],["Q",254.75734375000002,69.65174129353234,258.24567708333336,69.65174129353234],["Q",261.73401041666665,69.65174129353234,264.72401041666666,69.65174129353234],["Q",267.71401041666667,69.65174129353234,272.69734375,69.65174129353234],["Q",277.68067708333336,69.65174129353234,281.16901041666665,69.15422885572139],["Q",284.65734375,68.65671641791045,287.64734375,68.65671641791045],["Q",290.63734375,68.65671641791045,293.1290104166667,68.1592039800995],["Q",295.62067708333336,67.66169154228857,298.11234375000004,67.16417910447763],["Q",300.60401041666665,66.66666666666667,302.09901041666666,66.66666666666667],["Q",303.59401041666666,66.66666666666667,305.08901041666667,66.16915422885572],["Q",306.5840104166667,65.67164179104478,307.58067708333334,65.67164179104478],["Q",308.57734375,65.67164179104478,309.5740104166667,65.17412935323384],["Q",310.57067708333335,64.67661691542288,312.06567708333336,64.67661691542288],["Q",313.56067708333336,64.67661691542288,314.55734375000003,64.17910447761194],["Q",315.5540104166667,63.681592039801,317.04901041666665,63.681592039801],["Q",318.54401041666665,63.681592039801,320.03901041666666,63.18407960199005],["Q",321.53401041666666,62.6865671641791,323.02901041666667,62.189054726368155],["Q",324.52401041666667,61.691542288557216,326.0190104166667,61.19402985074627],["Q",327.5140104166667,60.69651741293532,329.0090104166667,60.19900497512438],["Q",330.5040104166667,59.701492537313435,331.9990104166667,59.20398009950249],["Q",333.4940104166667,58.70646766169154,334.49067708333337,58.208955223880594],["Q",335.48734375000004,57.711442786069654,336.98234375000004,57.21393034825871],["Q",338.47734375,56.71641791044776,339.47401041666666,56.21890547263682],["Q",340.4706770833333,55.72139303482587,341.46734375,55.223880597014926],["Q",342.46401041666667,54.72636815920398,343.46067708333334,54.72636815920398],["Q",344.45734375,54.72636815920398,344.95567708333334,54.72636815920398],["Q",345.4540104166667,54.72636815920398,345.95234375,54.22885572139303],["Q",346.45067708333335,53.73134328358209,346.9490104166667,53.73134328358209],["Q",347.44734375,53.73134328358209,347.94567708333335,53.73134328358209],["Q",348.4440104166667,53.73134328358209,348.94234375,53.73134328358209],["Q",349.44067708333336,53.73134328358209,349.9390104166667,53.73134328358209],["Q",350.43734375,53.73134328358209,350.93567708333336,53.73134328358209],["L",351.4370104166667,53.73134328358209]]}],"background":"transparent"}}]}`
      `{"events":[{"timestamp":0,"changes":[{"type":"resetState","newState":{"version":7,"graph":{"viewport":{"xmin":-10,"ymin":-11.072834645669293,"xmax":10,"ymax":11.072834645669293}},"randomSeed":"833b6667d8ca8162fd6c987a2d9a8c10","expressions":{"list":[{"type":"expression","id":"t1","color":"#c74440","latex":"y=x^{2}"}]}},"oldState":{"version":7,"graph":{"viewport":{"xmin":-10,"ymin":-11.072834645669293,"xmax":10,"ymax":11.072834645669293}},"randomSeed":"833b6667d8ca8162fd6c987a2d9a8c10","expressions":{"list":[{"type":"expression","id":"t1","color":"#c74440","latex":"y=x^{2}"}]}}}]},{"timestamp":1546,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"t1","color":"#c74440","latex":"y=x^{2}+"},"oldExp":{"type":"expression","id":"t1","color":"#c74440","latex":"y=x^{2}"}}]},{"timestamp":1858,"changes":[{"type":"changeExpr","exp":{"type":"expression","id":"t1","color":"#c74440","latex":"y=x^{2}+3"},"oldExp":{"type":"expression","id":"t1","color":"#c74440","latex":"y=x^{2}+"}}]}]}`
      );
    })
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
  }

  render() {
    return (
        <div style={{display: 'inline-flex', position: 'relative', padding: 20}}>
          <div style={{display: !this.state.isViewFull || this.state.isViewVideo ? '' : 'none', margin: 10}}>
            <video ref={this.video} src={this.props.isTeacher ? '' : "https://www.w3schools.com/html/movie.mp4"} width={this.state.isViewFull ? 1440 : 400} autoPlay={this.props.isTeacher}
                   muted={this.props.isTeacher} type={this.props.isTeacher ? "video/webm" : "video/mp4"} controls onTimeUpdate={() => this.classModule.current.updateVideoTime(this.video.current.currentTime * 1000)}>
              Your browser does not support video lol
            </video>
          </div>
          <div style={{display: this.state.isViewFull && this.state.isViewVideo ? 'none' : '', margin: 10}}>
          {this.getMainModule()}
          </div>
          <img src={this.state.recording ? 'record_red.png' : 'record_black.png'} onClick={this.handleRecordingClick.bind(this)} className="nav-icon record-icon" />
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
        let data = new FormData();
        data.append('data', blob);
        let videoId = Math.random().toString().slice(2);
        let jsonEvents = this.classModule.current.saveJSON();
        fetch("http://10.19.190.207:5000/video/vid-" + videoId, {
          method: "POST",
          body: data,
          mode: 'no-cors'
        }).then(() => {
          fetch("http://10.19.190.207:5000/content/vid-" + videoId, {
            method: "POST",
            body: "", /*JSON.stringify({
              filename: "toothpaste",
              events: []
            }),*/
            headers: {
              'Content-Type': 'application/json'
            },
            mode: 'no-cors'
          }).then(console.log);
        });
        console.log(jsonEvents);
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Contact Us
      </header>
      <div className="App-top">
        <span className="edumedia text-style-1">EDU</span>
        <span className="edumedia">MEDIA</span>
        <input type='search' className='search-bar' placeholder="Type text here..." />
        <span className="App-top-text">Courses</span>
        <span className="App-top-text">Instructors</span>
        <span className="App-top-text">DesmosLive</span>
      </div>
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
      <div style={{textAlign: 'center'}}>
        <VideoModuleView isTeacher={!/student/.test(window.location.pathname)}/>
      </div>
    </div>
  );
}

export default App;

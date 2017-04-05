require('normalize.css/normalize.css');
require('styles/App.scss');
let imageDatas = require('../data/images.json');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');

/**
 * [getImagesUrl 获取图片URL路径]
 * @param  {Array} imageDatasArr [description]
 * @return {Array}               [description]
 */
imageDatas = (function getImagesUrl(imageDataArr) {
  for (let i = 0; i < imageDataArr.length; i++) {
    let singleImageData = imageDataArr[i];
    singleImageData.imageURL = require(`../images/${singleImageData.fileName}`);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);

/**
 * [getRandom 获取区间内的随机值]
 * @param  {Number} low  [description]
 * @param  {Number} high [description]
 * @return {[type]}      [description]
 */
function getRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * [getDegRandom 获取正向或反向旋转30度以内的随机角度]
 * @return {[type]} [description]
 */
function getDegRandom() {
  return (Math.random() > 0.5 ? '' : '-' ) + Math.ceil(Math.random() * 30);
}

const ImgFigure = React.createClass({

  /**
   * [handleClick 图片点击事件]
   * @param {Object} e
   */
  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },

  render() {
    let styleObj = {};
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    if (this.props.arrange.rotate) {
      (['MozT', 'MsT', 'WebkitT', 'OT', 't']).forEach(function(value) {
        styleObj[`${value}ransform`] = `rotate(${this.props.arrange.rotate}deg)`;
      }.bind(this));
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let classNames = 'img-figure';
    classNames += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={classNames} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
})

// 控制按钮
const ControllerUnit = React.createClass({
  handleClick(e) {

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },

  render() {
    let classNames = 'controller-unit';
    classNames += this.props.arrange.isCenter ? ' is-center' : '';
    classNames += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <span className={classNames} onClick={this.handleClick}>
      </span>
    );
  }
});

const AppComponent = React.createClass({
// class AppComponent extends React.Component {
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },

    // 水平方向的取值范围
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },

    // 垂直方向的取值范围
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  },

  /**
   * [setInverse 将图片翻转]
   * @param {Number} index
   * @returns
   */
  setInverse(index) {
    return () => {
      let imgsArr = this.state.imgsArr;
      imgsArr[index].isInverse = !imgsArr[index].isInverse;
      this.setState({
        imgsArr: imgsArr
      })
    };
  },

  /**
   * [rearrange 重新布局所有图片]
   * @param  {Number} centerIndex [指定居中某张图片]
   * @return {[type]}             [description]
   */
  rearrange(centerIndex) {
    let imgsArr = this.state.imgsArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsTopArr = [],
        topImgNum = Math.floor(Math.random() * 2), // 取 0 或 1 个图片放置在舞台中央正上方, floor 向下取整
        topImgSpliceIndex = 0,
        imgsCenterArr = imgsArr.splice(centerIndex, 1);

        // 居中图片 无需旋转
        imgsCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        }

        // 获取中央上侧的图片状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArr.length - topImgNum));
        imgsTopArr = imgsArr.splice(topImgSpliceIndex, topImgNum);

        // 布局图片
        imgsTopArr.forEach(function(value, index) {
          imgsTopArr[index] = {
            pos: {
              top: getRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: getDegRandom(),
            isCenter: false
          }
        });

        for (let i = 0, j = imgsArr.length, k = j / 2; i < j; i++) {
          let hPosRangeLORX = null;

          // 前半部分布局在左边，后半部分布局在右边
          if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX;
          }
          imgsArr[i] = {
            pos: {
              top: getRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            rotate: getDegRandom(),
            isCenter: false
          }
        }
        if (imgsTopArr && imgsTopArr[0]) {
          imgsArr.splice(topImgSpliceIndex, 0, imgsTopArr[0]);
        }
        imgsArr.splice(centerIndex, 0, imgsCenterArr[0]);
        this.setState({
          imgsArr: imgsArr
        })
  },

  setCenter(index) {
    return () => {
      this.rearrange(index);
    };
  },

  getInitialState() {
    return {
      imgsArr: [
        {
          // pos: {
          //   left: '0',
          //   top: '0'
          // },
          // rotate: 0,
          // isInverse: false,
          // isCenter: false
        }
      ]
    };
  },

  /**
   * [componentDidMount 组件加载后计算图片的位置范围]
   * @return {[type]} [description]
   */
  componentDidMount() {

    // 获取舞台大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] -= halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  },

  render() {
    let controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function(value, index) {
      if (!this.state.imgsArr[index]) {
        this.state.imgsArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure key={index} data={value} ref={`imgFigure${index}`} arrange={this.state.imgsArr[index]} inverse={this.setInverse(index)} center={this.setCenter(index)} />);
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArr[index]} inverse={this.setInverse(index)} center={this.setCenter(index)} />)
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="section-img">
          {imgFigures}
        </section>
        <nav className="nav-controller">
          {controllerUnits}
        </nav>
      </section>
      // <div className="index">
      //   <img src={yeomanImage} alt="Yeoman Generator" />
      //   <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      // </div>
    );
  }
})
// }

AppComponent.defaultProps = {
};

export default AppComponent;

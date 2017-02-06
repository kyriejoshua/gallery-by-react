require('normalize.css/normalize.css');
require('styles/App.scss');
let imageDatas = require('../data/images.json');

import React from 'react';

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
    imageDataArr[i] = singleImageData.fileName;
  }
  return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="section-img">
        </section>
        <nav className="nav-controller">
        </nav>
      </section>
      // <div className="index">
      //   <img src={yeomanImage} alt="Yeoman Generator" />
      //   <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      // </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

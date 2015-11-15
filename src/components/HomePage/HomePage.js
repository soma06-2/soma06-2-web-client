/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './HomePage.css';
import withStyles from '../../decorators/withStyles';
// import Button from 'react-toolbox/lib/button';

@withStyles(styles)
class HomePage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  render() {
    this.context.onSetTitle('리뷰 요약 시스템');

    return (
      <div>
        <div className="wrap HomePage-text">
          <div
            style={{
              padding: '100px 0px',
              textAlign: 'center',
            }}>
            <h1 style={{
                fontSize: '4em',
              }}>
              리뷰 요약 시스템
              <span
                style={{
                  lineHeight: '2',
                  display: 'block',
                  fontSize: '0.4em',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                소프트웨어 마에스트로 1단계 2차 프로젝트
              </span>
            </h1>
          </div>
        </div>
        <div className="HomePage-banner">
          <img src={require('./space.jpg')} alt="" className="image1" />
          <img src={require('./space.jpg')} alt="" className="image2" />
        </div>
      </div>
    );
  }

}

export default HomePage;

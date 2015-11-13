/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './HomePage.css';
import withStyles from '../../decorators/withStyles';
// import Button from 'react-toolbox/lib/button';

@withStyles(styles)
class HomePage extends Component {

  render() {
    return (
      <div>
        <div className="wrap HomePage-text">
          <div
            style={{
              padding: '60px 0px',
            }}>
            <h1>
              Review Summarizer
              <span
                style={{
                  fontStyle: 'italic',
                  lineHeight: '2',
                  display: 'block',
                  fontSize: '0.4em',
                }}>
                Software Maestro 6th, Stage 1, Step 2
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

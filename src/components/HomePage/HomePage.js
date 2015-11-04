/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './HomePage.css';
import withStyles from '../../decorators/withStyles';
// import Button from 'react-toolbox/lib/button';

class HomePage extends Component {

  render() {
    return (
      <div className="wrap">
        <p>뭔가 검색해줘요</p>
      </div>
    );
  }

}

export default HomePage;

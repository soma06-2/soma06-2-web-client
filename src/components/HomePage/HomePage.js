/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './HomePage.css';
import withStyles from '../../decorators/withStyles';
import d3 from 'd3';
import { Button, Grid, Row, Col } from 'react-bootstrap';

class HomePage extends Component {

  componentDidMount() {
    var d = d3
      .select(ReactDOM.findDOMNode(this))
      .append('svg')
      .attr({
        width: 400,
        height: 400,
      });
  }

  render() {
    return (
      <div className="wrap">
        <p>뭔가 검색해줘요</p>
      </div>
    );
  }

}

export default HomePage;

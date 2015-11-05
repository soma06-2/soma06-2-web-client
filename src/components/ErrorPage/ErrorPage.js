/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './ErrorPage.css';

@withStyles(styles)
class ErrorPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  render() {
    const title = 'Error';
    this.context.onSetTitle(title);
    return (
      <div>
        <h1>이런!</h1>
        <p>해당 상품에 대해서 분석이 불가능합니다.</p>
      </div>
    );
  }

}

export default ErrorPage;

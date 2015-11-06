/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './NotFoundPage.css';

@withStyles(styles)
class NotFoundPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  render() {
    const title = '페이지를 못찾았습니다.';
    this.context.onSetTitle(title);
    this.context.onPageNotFound();
    return (
      <div>
        <h1>{title}</h1>
        <p>찾으시려는 페이지가 어디에 있는지 잘 모르겠네요.</p>
      </div>
    );
  }

}

export default NotFoundPage;

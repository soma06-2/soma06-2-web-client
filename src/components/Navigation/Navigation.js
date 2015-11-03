/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './Navigation.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import { Toggle } from 'material-ui';

@withStyles(styles)
class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <div className={classNames(this.props.className, 'Navigation')} role="navigation">
        <Toggle
          name="Test1"
          value="test"
          label="속성 검색"
          style={{
            marginTop: '10px'
          }}
          labelStyle={{
            color: '#fff',
            fontWeight: 400,
          }} />
      </div>
    );
  }

}

export default Navigation;

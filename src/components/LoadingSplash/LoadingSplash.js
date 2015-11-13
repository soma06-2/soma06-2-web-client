
import React, { PropTypes, Component } from 'react';
import css from './LoadingSplash.css';
import withStyles from '../../decorators/withStyles';
import cx from 'classnames';

@withStyles(css)
class LoadingSplash extends Component {

  constructor() {
    super();

    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.state.loaded = true;
    this.forceUpdate();
  }

  render() {

    return (
      <div
        style={styles.container}
        className={cx({
          'loadingSplashLoaded': this.state.loaded,
        })}>
        <div style={styles.centerBox}>
          <h1
            style={styles.title}>
            Review Summarizer
            <span style={styles.subTitle}>Software Maestro 6th</span>
          </h1>
        </div>
      </div>
    );

  }

}

const styles = {
  container: {
    position: 'fixed',
    top: '0px', left: '0px',
    right: '0px', bottom: '0px',
    zIndex: 10000000,
    backgroundColor: '#fff',
    fontFamily: 'NanumGothic, Segoe UI, Helvetica,Neue-Light,sans-serif',
  },
  centerBox: {
    width: '66.6%',
    margin: '100px auto',
    fontSize: '14px',
    color: '#000',
  },
  title: {
    fontSize: '3em',
    fontWeight: 400,
    margin: '10px 10px',
    marginTop: '40px',
    lineHeight: 1,
    padding: '0px',
  },
  subTitle: {
    display: 'block',
    fontStyle: 'italic',
    fontSize: '0.5em',
    color: '#444',
    margin: '20px 0px',
  }
};

export default LoadingSplash;

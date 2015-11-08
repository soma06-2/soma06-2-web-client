/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import styles from './Header.css';
import withStyles from '../../decorators/withStyles';
import Navigation from '../Navigation';
import Location from '../../core/Location';
import Link from '../Link';
import { FlatButton, DropDownMenu, Dialog } from 'material-ui';
import { Input, Row, Col } from 'react-bootstrap';
import CardCheckbox from '../CardCheckbox';

@withStyles(styles)
class Header extends Component {
  static defaultProps = {
    onFocus: function () {},
    onBlur: function () {},
  };

  static propTypes = {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static contextTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor() {
    super();

    this.worker = null;
    this.watingTime = 1000;
    this.previousWord = '';
    this.word = '';

    this.state = {
      isTyping: false,
      hasFocus: false,
    };
  }

  componentWillMount() {
    this.word = this.context.params.search || '';
  }

  componentDidMount() {
  }

  handleFocus(event) {
    this.state.hasFocus = true;

    this.props.onFocus(event);

    this.forceUpdate();

    Location.pushState(null, `/search/${this.word}`);
  }

  handleBlur(event) {
    this.state.hasFocus = false;
    this.props.onBlur(event);

    if (!this.word) {
      Location.goBack();
    }

    this.forceUpdate();
  }

  handleChange(event) {
    this.word = event.target.value;

    if (this.word === this.previousWord) {
      return;
    }

    this.state.isTyping = true;
    this.previousWord = this.word;

    this.forceUpdate();

    if (this.worker) {
      clearTimeout(this.worker);
    }

    this.worker = setTimeout(this.doneTyping.bind(this), this.watingTime);
  }

  doneTyping() {
    this.state.isTyping = false;
    this.worker = null;

    this.forceUpdate();

    Location.pushState(null, `/search/${this.word}`);
  }

  renderState() {
    let c1 = classNames({
      activated: !this.state.isTyping,
    });

    let c2 = classNames({
      activated: this.state.isTyping,
    });

    return (
      <label htmlFor="search">
        <div className={c1}>
          <span className="glyphicon glyphicon-search"></span>
          <span className="sr-only">검색</span>
        </div>
        <div className={c2}>
          <div className="animation sk-rotating-plane" />
        </div>
      </label>
    );
  }

  renderInit() {
    return (
      <div
        className={classNames('Header-search-init', {
          activated: this.word.length
        })}
        onClick={this.initInput.bind(this)}>
        <span className="glyphicon glyphicon-remove"></span>
      </div>
    );
  }

  initInput() {
    this.word = '';

    if (this.worker) {
      clearTimeout(this.worker);
    }

    this.state.isTyping = false;

    Location.pushState(null, '/');
  }

  handleToggle(event, isToggled) {
    this.refs.attrSearch.show();
  }

  _handleCustomDialogCancel() {
    this.refs.attrSearch.dismiss();
  }

  _handleCustomDialogSubmit() {
  }

  render() {
    const dialogCustomActions = [
      <FlatButton
        label="취소"
        secondary={true}
        onTouchTap={this._handleCustomDialogCancel.bind(this)} />,
      <FlatButton
        label="검색"
        primary={true}
        onTouchTap={this._handleCustomDialogSubmit.bind(this)} />
    ];

    const categorySelectorAttr = {
      autoWidth: false,
      style: {
        width: '100%',
      },
      menuItems: [
        {
          payload: '1',
          text: '의류',
        },
        {
          payload: '2',
          text: '화장품',
        },
        {
          payload: '3',
          text: '노트북',
        },
        {
          payload: '4',
          text: 'CPU',
        },
      ]
    };

    return (
      <div className={classNames('Header', {
          activated: (this.state.hasFocus || this.word.length),
        })}>
        <div className="Header-container">
          <a className="Header-brand" href="/" onClick={Link.handleClick}>
            <span className="Header-brandTxt">Summarizer</span>
          </a>
          <div className="Header-wrap">
            <form className={classNames('Header-search', {
                activated: this.state.hasFocus,
              })}>
              {this.renderState()}
              <input
                id="search"
                ref="input"
                type="text"
                placeholder="검색"
                value={this.word}
                onFocus={this.handleFocus.bind(this)}
                onBlur={this.handleBlur.bind(this)}
                onChange={this.handleChange.bind(this)} />
              {this.renderInit()}
            </form>
          </div>
          <div className="Header-nav">
            <div className={classNames(this.props.className, 'Navigation')} role="navigation">
              <FlatButton
                label="속성 검색"
                primary={true}
                onClick={this.handleToggle.bind(this)}
                style={{
                  marginTop: '5px',
                }} />
            </div>
          </div>
        </div>
        <Dialog
          title="속성 검색"
          ref="attrSearch"
          actions={dialogCustomActions}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}>
            <div
              style={{
                height: '400px',
                color: '#000',
                position: 'relative',
              }}>
              <Row className="noPadding">
                <Col xs={12}>
                  <DropDownMenu {...categorySelectorAttr} />
                </Col>
              </Row>
              <Row className="noPadding">
                <Col xs={4}>
                  <CardCheckbox label={"test"} />
                </Col>
                <Col xs={4}>
                  <CardCheckbox label={"test"} />
                </Col>
                <Col xs={4}>
                  <CardCheckbox label={"test"} />
                </Col>
                  <Col xs={4}>
                    <CardCheckbox label={"test"} />
                  </Col>
                  <Col xs={4}>
                    <CardCheckbox label={"test"} />
                  </Col>
                  <Col xs={4}>
                    <CardCheckbox label={"test"} />
                  </Col>
                    <Col xs={4}>
                      <CardCheckbox label={"test"} />
                    </Col>
                    <Col xs={4}>
                      <CardCheckbox label={"test"} />
                    </Col>
                    <Col xs={4}>
                      <CardCheckbox label={"test"} />
                    </Col>
              </Row>
            </div>
        </Dialog>
      </div>
    );
  }

}

export default Header;

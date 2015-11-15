/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import styles from './Header.css';
import withStyles from '../../decorators/withStyles';
import Navigation from '../Navigation';
import Location from '../../core/Location';
import Link from '../Link';
import { FlatButton, DropDownMenu, Dialog } from 'material-ui';
import { Input, Row, Col, Glyphicon } from 'react-bootstrap';
import CardCheckbox from '../CardCheckbox';
import http from '../../core/HttpClient';

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
    this.categories = [];
    this.attrSearchError = '';
    this.attrSearchPreviousWord = '';
    this.selectedAttrs = {};
    this.selectedCategory = '';

    this.state = {
      isTyping: false,
      hasFocus: false,
      hasFocusOnAttrSearch: false,
      attrs: [],
      dialog: false,
    };

    http
      .find(`categories`)
      .then(res => {
        this.categories = res;
      });
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

    Location.pushState(null, `/search/${this.word}`);

    this.forceUpdate();
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
    this.state.dialog = true;
    this.forceUpdate();
  }

  _handleCustomDialogCancel() {
    this.state.dialog = false;
    this.forceUpdate();
  }

  _handleCustomDialogSubmit() {
    let attrs = '';

    for (let idx in this.selectedAttrs) {
      attrs += this.selectedAttrs[idx] + ',';
    }

    Location.pushState(null, `/recommendation/${this.selectedCategory}?attributes=${attrs}`);

    this.state.dialog = false;
    this.forceUpdate();
  }

  handleAttrSearchChange(event) {
    var attrSearchInput = this.refs.attrSearchInput;

    if (this.attrSearchPreviousWord === attrSearchInput.value) {
      return;
    }

    this.attrSearchPreviousWord = attrSearchInput.value;

    const categories = this.categories.filter(category => {
      return category.label.indexOf(attrSearchInput.value) !== -1;
    });

    this.state.attrs = [];
    this.selectedAttrs = {};
    this.selectedCategory = '';

    if (categories.length) {
      const t = http
        .find(`category/${categories[0].id}/properties`)
        .then(res => {
          this.state.attrs = res;
          this.attrSeachError = '';
          this.selectedCategory = categories[0].id;
          this.forceUpdate();
        })
        .catch(error => {
          this.attrSearchError = '서버에서 에러가 발생했습니다.';
          console.error(error);
          this.forceUpdate();
        });
    }
    else {
      this.attrSeachError = '해당 카테고리를 찾을 수 없습니다.';
    }

    this.forceUpdate();
  }

  handleAttrSearchBlur() {
    this.state.hasFocusOnAttrSearch = false;
    this.forceUpdate();
  }

  handleAttrSearchFocus() {
    this.state.hasFocusOnAttrSearch = true;
    this.forceUpdate();
  }

  handleCheck(event) {
    const value = event.target.value;
    const key = event.dispatchMarker;

    if (value) {
      this.selectedAttrs[key] = value;
    }
    else {
      delete this.selectedAttrs[key];
    }
  }

  renderDialog() {

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

    return (
      <Dialog
        title="속성 검색"
        onRequestClose={this._handleCustomDialogCancel.bind(this)}
        open={this.state.dialog}
        actions={dialogCustomActions}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}>
        <div
          style={{
            height: '400px',
            color: '#000',
            position: 'relative',
            overflow: 'hidden',
          }}>
          <Row
            style={{
              height: '70px',
            }}
            className="noPadding">
            <Col xs={12}>
              <div
                className={classNames({
                  attrSearchInput: true,
                  activated: this.state.hasFocusOnAttrSearch,
                })}>
                <div className="before">
                  <span className="glyphicon glyphicon-search"></span>
                  <span className="sr-only">검색</span>
                </div>
                <div className="mid">
                  <input
                    type="text"
                    ref="attrSearchInput"
                    placeholder="카테고리 이름 ex) 부츠, 노트북"
                    onFocus={this.handleAttrSearchFocus.bind(this)}
                    onBlur={this.handleAttrSearchBlur.bind(this)}
                    onChange={this.handleAttrSearchChange.bind(this)}
                    />
                </div>
              </div>
              <p>{this.attrSearchError}</p>
            </Col>
          </Row>
          <Row
            style={{
              position: 'absolute',
              top: '70px', left: '0px', right: '0px', bottom: '0px',
              overflow: 'auto',
            }}
            className="noPadding">
            {this.state.attrs.map((attr, idx) => {
              return (
                <Col xs={3} key={idx}>
                  <CardCheckbox
                    label={attr.split('/')[0]}
                    value={attr}
                    onCheck={this.handleCheck.bind(this)}/>
                </Col>
              );
            })}
          </Row>
        </div>
      </Dialog>
    );
  }

  render() {

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
        {this.renderDialog()}
      </div>
    );
  }

}

export default Header;

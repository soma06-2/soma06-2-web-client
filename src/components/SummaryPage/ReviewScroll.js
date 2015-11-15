import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from '../../decorators/withStyles';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import {
  Toolbar, ToolbarGroup, ToolbarTitle,
  Dialog, DropDownMenu, RaisedButton, FlatButton
} from 'material-ui';
import { Row, Col } from 'react-bootstrap';
import CardCheckbox from '../CardCheckbox';
import classNames from 'classnames';
import http from '../../core/HttpClient';

const statTags = {
  '<em class="pos">': /<stat-pos>/g,
  '<em class="neg">': /<stat-neg>/g,
  '</em>': /(<\/stat-pos>|<\/stat-neg>)/g,
};

function translateStat(content) {
  for (let i in statTags) {
    content = content.replace(statTags[i], i);
  }

  return content;
}

export default class ReviewScroll extends Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    attrFilter: PropTypes.array.isRequired,
  };

  constructor() {
    super();

    this.state = {
      reviews: [],
      isRequesting: false,
      showAttrFilter: false,
    };

    this.eventHolder = null;
    this.isOver = false;
    this.skip = 0;
    this.limit = 40;
    this.selectedAttrs = {};
  }

  loadProducts() {
    if (this.state.isRequesting) {
      return;
    }

    const condition = {
      attributes: [],
    };

    for (let idx in this.selectedAttrs) {
      condition.attributes.push(this.selectedAttrs[idx]);
    }

    this.state.isRequesting = true;

    this.forceUpdate();

    http
      .find(`products/${this.props.productId}/reviews?skip=${this.skip}&limit=${this.limit}&where=${JSON.stringify(condition)}`)
      .then(res => {
        if (Array.isArray(res) && res.length) {
          this.skip += this.limit;
        }

        res.forEach(review => {
          review.content = translateStat(review.content);
          this.state.reviews.push(review.content);
        });

        this.state.isRequesting = false;

        this.forceUpdate();
      })
      .catch(error => {
        console.error();
        this.state.isRequesting = false;
      });
  }

  handleScroll(event) {
    if (!canUseDOM) {
      return;
    }

    const refs = this.refs;

    let selfNode = ReactDOM.findDOMNode(this);
    let doc = document.documentElement;
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    let bottom = selfNode.offsetHeight + selfNode.offsetTop;
    let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.isOver = windowHeight - top + 66 < refs.reviewList.offsetTop;

    if (bottom - top - windowHeight < 200) {
      this.loadProducts();
    }

    this.forceUpdate();
  }

  componentWillMount() {

    this.loadProducts();

    if (!canUseDOM) {
      return;
    }

    this.eventHolder = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.eventHolder);
  }

  componentWillUnmount() {
    if (!canUseDOM) {
      return;
    }

    window.removeEventListener('scroll', this.eventHolder);
  }

  renderReviews() {
    return (
      <ul className="AllReviews" ref="reviewList">
        {this.state.reviews.map((review, idx) => {
          return (
            <li key={idx}>
              <p dangerouslySetInnerHTML={{__html: review}}></p>
            </li>
          );
        })}
      </ul>
    );
  }

  _handleRequestClose() {
    this.state.showAttrFilter = false;
    this.forceUpdate();
  }

  _handleCustomDialogSubmit() {
    this.state.showAttrFilter = false;
    this.state.reviews = [];
    this.skip = 0;
    this.state.dialog = false;

    this.forceUpdate();

    this.loadProducts();
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
    let customActions = [
      <FlatButton
        label="적용"
        primary={true}
        onTouchTap={this._handleCustomDialogSubmit.bind(this)} />
    ];

    return (
      <Dialog
        title="속성 필터"
        actions={customActions}
        open={this.state.showAttrFilter}
        onRequestClose={this._handleRequestClose.bind(this)}>
        <p>보고 싶은 속성들을 선택해주세요.</p>
        <Row>
          {this.props.attrFilter.map((filter, idx) => {
            let isChecked = false;

            for (let idx in this.selectedAttrs) {
              if (this.selectedAttrs[idx] === filter.value) {
                isChecked = true;
                break;
              }
            }

            return (
              <Col xs={4} key={idx}>
                <CardCheckbox
                  label={filter.text}
                  value={filter.value}
                  onCheck={this.handleCheck.bind(this)}
                  defaultChecked={isChecked} />
              </Col>
            );
          })}
        </Row>
      </Dialog>
    );
  }

  handleClick(event) {
    this.state.showAttrFilter = true;
    this.forceUpdate();
  }

  render() {

    let selectedAttrs = '';

    for (let idx in this.selectedAttrs) {
      if (selectedAttrs.length) selectedAttrs += ', ';
      selectedAttrs += this.selectedAttrs[idx];
    }

    return (
      <div
        style={{
          marginTop: '20px',
        }}>
        <div style={this.isOver ? {
            height: '56px',
          } : {}} />
        <div
          className={classNames({
            fixed: this.isOver,
          })}>
          <div
            ref="toolbarGroup"
            className={classNames({
              wrap: this.isOver,
            })}>
            <Toolbar>
              <ToolbarGroup>
                <ToolbarTitle text="리뷰 뷰어" />
                <RaisedButton label="속성 필터" secondary={true} onClick={this.handleClick.bind(this)} />
                <span style={{margin: '18px 0px', fontSize: '16px', display: 'inline-block', color: '#777',}}>{selectedAttrs}</span>
              </ToolbarGroup>
            </Toolbar>
          </div>
        </div>
        {this.renderReviews()}
        {this.renderDialog()}
      </div>
    );
  }
};

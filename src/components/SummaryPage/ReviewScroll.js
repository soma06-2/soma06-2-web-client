import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from '../../decorators/withStyles';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { Toolbar, ToolbarGroup, DropDownMenu, Slider } from 'material-ui';
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
    };

    this.eventHolder = null;
    this.isOver = false;
    this.skip = 0;
    this.limit = 10;
  }

  loadProducts() {
    http
      .find(`products/${this.props.productId}/reviews?skip=${this.skip}&limit=${this.limit}`)
      .then(res => {
        console.log(res);
        this.skip += this.limit;

        res.forEach(review => {
          review.content = translateStat(review.content);
          this.state.reviews.push(review.content);
        });

        this.forceUpdate();
      })
      .catch(error => {
        console.error();
      });
  }

  handleScroll(event) {
    if (!canUseDOM) {
      return;
    }

    let selfNode = ReactDOM.findDOMNode(this);
    let doc = document.documentElement;
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    let bottom = selfNode.offsetHeight + selfNode.offsetTop;
    let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.isOver = top - windowHeight > this.refs.reviewList.offsetTop - 56;

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

  render() {

    const filterOptions = [
      { payload: '1', text: '모든 속성 리뷰' },
      { payload: '2', text: '속성 1' },
      { payload: '3', text: '속성 2' },
      { payload: '4', text: '속성 3' },
      { payload: '5', text: '속성 4' },
    ];

    const iconMenuItems = [
      { payload: '1', text: '모든 감정 리뷰' },
      { payload: '2', text: '긍정 리뷰' },
      { payload: '3', text: '부정 리뷰' },
    ];

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
            className={classNames({
              wrap: this.isOver,
            })}>
            <Toolbar>
              <ToolbarGroup>
                <DropDownMenu menuItems={this.props.attrFilter} />
              </ToolbarGroup>
              <ToolbarGroup>
                <DropDownMenu menuItems={iconMenuItems} />
              </ToolbarGroup>
            </Toolbar>
          </div>
        </div>
        {this.renderReviews()}
      </div>
    );
  }
};

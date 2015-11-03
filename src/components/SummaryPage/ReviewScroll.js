import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from '../../decorators/withStyles';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { Toolbar, ToolbarGroup, DropDownMenu, Slider } from 'material-ui';
import classNames from 'classnames';

export default class ReviewScroll extends Component {
  constructor() {
    super();

    this.state = {
      reviews: [],
    };

    this.eventHolder = null;
    this.isOver = false;

    for (let idx = 0; idx < 50; idx++) {
      this.state.reviews.push("something");
    }
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

    this.isOver = top - windowHeight > selfNode.offsetTop;
    this.forceUpdate();

    if (bottom - top - windowHeight > 500) {
      return;
    }

    for (let idx = 0; idx < 50; idx++) {
      this.state.reviews.push("something");
    }

    this.forceUpdate();
  }

  componentWillMount() {
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
      <ul className="AllReviews">
        {this.state.reviews.map((review, idx) => {
          return (
            <li key={idx}>
              {review}
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
      <div>
        <div className="wrap">
          <Toolbar className={classNames({
              fixed: this.isOver,
            })}>
            <ToolbarGroup>
              <DropDownMenu menuItems={filterOptions} />
            </ToolbarGroup>
            <ToolbarGroup>
              <DropDownMenu menuItems={iconMenuItems} />
            </ToolbarGroup>
          </Toolbar>
        </div>
        {this.renderReviews()}
      </div>
    );
  }
};

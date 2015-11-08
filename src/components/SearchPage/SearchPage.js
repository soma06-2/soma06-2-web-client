/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './SearchPage.css';
import withStyles from '../../decorators/withStyles';
import { Row, Col } from 'react-bootstrap';
import SearchResultItem from './SearchResultItem';
import { FlatButton } from 'material-ui';
import http from '../../core/HttpClient';

@withStyles(styles)
class SearchPage extends Component {

  static propTypes = {
    products: PropTypes.array.isRequired,
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.skip = 31;
    this.limit = 30;

    this.state = {
      products: [],
    };

    this.eventHolder = null;
  }

  addProduct(product) {
    this.state.products.push(product);
  }

  initProducts() {
    this.state.products.length = 0;
    this.setDefaultPagination();
  }

  setDefaultPagination() {
    this.skip = 31;
  }

  componentWillMount() {
    this.props.products.forEach(product => this.addProduct(product));
  }

  componentWillReceiveProps(nextProps) {
    this.initProducts();

    nextProps.products.forEach(product => this.addProduct(product));
  }

  componentDidMount() {
    this.eventHolder = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.eventHolder);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.eventHolder);
  }

  handleScroll() {
    let selfNode = ReactDOM.findDOMNode(this);
    let doc = document.documentElement;
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    let bottom = selfNode.offsetHeight + selfNode.offsetTop;
    let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (bottom - top - windowHeight < 500) {
      this.handleInfiniteLoad();
    }
  }

  renderCards() {
    const products = this.state.products;

    return products.map((item, idx) => {
      return (
        <Col
          key={idx}
          lg={4}
          md={6}
          sm={6}
          xs={12}>
          <div className="animation">
            <SearchResultItem
              data={item}
              />
          </div>
        </Col>
      );
    });
  }

  renderNothing() {
    if (!this.props.search) {
      return '';
    }

    return (
      <Col xs={12}>
        <p style={{fontSize: '18px', textAlign: 'center', margin: '60px'}}>검색된 상품이 없습니다.</p>
      </Col>
    );
  }

  handleInfiniteLoad() {
    http
      .get(`/v1/naverProducts/${encodeURIComponent(this.props.search)}?skip=${this.skip}&limit=${this.limit}`)
      .then((products) => {
        this.state.products = [...this.state.products, ...products];
        this.forceUpdate();
        this.skip += this.limit;
      });
  }

  render() {
    if (this.props.search) {
      this.context.onSetTitle(`'${this.props.search}'에 대한 검색결과`);
    }
    else {
      this.context.onSetTitle(`상품 검색`);
    }

    return (
      <div
        className="wrap SearchPage">
        <Row>
          <div
            style={{
              margin: '15px 0',
            }}>
            {this.props.products.length ? this.renderCards() : this.renderNothing()}
          </div>
        </Row>
      </div>
    );
  }

}

export default SearchPage;

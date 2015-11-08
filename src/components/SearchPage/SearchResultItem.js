import React, { PropTypes, Component } from 'react';
import Location from '../../core/Location';
import { Col } from 'react-bootstrap';
import { Card, CardTitle, CardMedia, CardText } from 'material-ui';

class SearchResultItem extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  static propDefaults = {
    style: {},
  };

  handleClick(event) {
    localStorage.tmp = JSON.stringify(this.props.data);
    Location.pushState(null, `/summary/product/${this.props.data.productId}`);
  }

  render() {
    const data = this.props.data;

    return (
      <Card
        style={{
          margin: '15px auto',
          height: '480px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={this.handleClick.bind(this)}>
        <CardMedia
          style={{
            maxHeight: '300px',
            overflow: 'hidden',
          }}>
          <img src={data.image} />
        </CardMedia>
        <CardTitle
          title={data.title}
          subtitle={data.lprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' KRW'} />
        <CardText>
          추천된 이유 ex) 가격 속성이 많이 언급되었음
        </CardText>
      </Card>
    );
  }
}

export default SearchResultItem;

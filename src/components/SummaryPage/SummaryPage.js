import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from '../../decorators/withStyles';
import styles from './SummaryPage.css';
import { Row, Col } from 'react-bootstrap';
import ReviewScroll from './ReviewScroll';
import classNames from 'classnames';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

@withStyles(styles)
class SummaryPage extends Component {

  static propTypes = {
    data: PropTypes.object,
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      activatedSector: 0,
      product: null,
    };

    this.mouse = null;

    this.props.data.attributes.forEach((attr, idx) => {
      this.props.data.attributes[idx].name = attr.name.split('/')[0];

      attr.negative.reviews = attr.negative.reviews.splice(0, 5);
      attr.positive.reviews = attr.positive.reviews.splice(0, 5);
    });
  }

  componentDidMount() {
    this.state.product = JSON.parse(localStorage.tmp);
    this.forceUpdate();
  }

  handleMouseMove(event) {
    if (!canUseDOM) {
      return;
    }

    const selfNode = ReactDOM.findDOMNode(this);

    this.mouse = {
      offsetX: event.clientX - selfNode.offsetLeft,
      offsetY: event.clientY - selfNode.offsetTop,
    };
    this.forceUpdate();
  }

  handleMouseEnter(idx) {
    return (event) => {
      if (!canUseDOM) {
        return;
      }

      this.forceUpdate();

      this.state.activatedSector = idx;

      const selfNode = ReactDOM.findDOMNode(this);

      this.mouse = {
        offsetX: event.clientX - selfNode.offsetLeft,
        offsetY: event.clientY - selfNode.offsetTop,
      };

      this.forceUpdate();
    }
  }

  handleMouseLeave(idx) {
    return (event) => {
      if (!canUseDOM) {
        return;
      }

      this.mouse = null;

      this.forceUpdate();
    }
  }

  getActivatedSector() {
    return this.props.data.attributes[this.state.activatedSector];
  }

  renderTooltip() {
    if (!canUseDOM) {
      return '';
    }

    if (!this.mouse) {
      return '';
    }

    const attr = this.getActivatedSector();

    if (!attr || !this.mouse) {
      return '';
    }

    return (
      <div style={{
          position: 'absolute',
          top: (this.mouse.offsetY + 20) + 'px',
          left: (this.mouse.offsetX + 20) + 'px',
          width: '100px',
          height: '15px',
          background: '#F44336',
          boxShadow: '0 0 4px rgba(0, 0, 0, 0.8)'
        }}>
        <div style={{
            width: `${attr.positive.stat * 100}px`,
            height: 'inherit',
            background: '#8BC34A',
            transition: '0.25s',
          }}/>
      </div>
    );
  }

  renderGraph() {
    const width = 500, height = 480;
    const cx = width / 2, cy = height / 2;

    const radius = 130;

    const cos = Math.cos, sin = Math.sin;
    const mPI = Math.PI * 2;

    const chartColors = [
      '#e57373','#f06292','#ba68c8','#9575cd',
      '#7986cb','#64b5f6','#4fc3f7','#4dd0e1',
      '#4db6ac','#81c784','#aed581','#dce775',
      '#fff176','#ffd54f','#ffb74d','#ff8a65',
    ];

    const accentChartColors = [
      '#ff1744','#f50057','#d500f9','#651fff',
      '#3d5afe','#2979ff','#00b0ff','#00e5ff',
      '#1de9b6','#00e676','#76ff03','#c6ff00',
      '#ffea00','#ffc400','#ff9100','#ff3d00',
    ];

    const chart = [];

    let lastX = radius;
    let lastY = 0;
    let radSegment = 0;
    let radAngle = 0;

    const total = 1;

    return (
      <div
        className="graph"
        style={{
          margin: '0 auto',
          width: `${width}px`
        }}
        >
        <svg width={width} height={height}>
          <g>
            <circle cx={cx} cy={cy} r={radius} fill="#eee" />
            {this.props.data.attributes.map((attr, idx) => {
              const valuePercentage = attr.rate / total;
              const longArc = (valuePercentage <= 0.5) ? 0 : 1;

              radSegment += valuePercentage * mPI;
              const nextX = cos(radSegment) * radius;
              const nextY = sin(radSegment) * radius;

              radAngle -= valuePercentage * mPI;
              const radAngle2 = valuePercentage / 2 * mPI;
              const tx = radAngle + radAngle2;
              const hX = cos(tx) * (radius + 40);
              const hY = sin(tx) * (radius + 40);
              const pX = cos(tx) * (radius - 40);
              const pY = sin(tx) * (radius - 40);

              const d = [
                `M ${0},${0}`,
                `l ${lastX},${-lastY}`,
                `a${radius},${radius}`,
                '0',
                `${longArc},0`,
                `${nextX - lastX},${-(nextY - lastY)}`,
                'z',
              ].join(' ');

              lastX = nextX;
              lastY = nextY;

              const scale = (this.state.activatedSector === idx ? 1.1 : 1);
              const transform = `translate(${cx}px,${cy}px) scale(${scale})`;

              return (
                <g
                  key={idx}
                  classNames={classNames({
                    activated: this.state.activatedSector === idx,
                  })}
                  style={{
                    transform: transform,
                  }}
                  onMouseEnter={this.handleMouseEnter(idx).bind(this)}
                  onMouseLeave={this.handleMouseLeave(idx).bind(this)}
                  onMouseMove={this.handleMouseMove.bind(this)}>
                  <path
                    d={d}
                    fill={this.state.activatedSector === idx ? accentChartColors[idx % chartColors.length] : chartColors[idx % chartColors.length]}
                    />
                  <text
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    x={hX}
                    y={hY}>
                    <tspan>{attr.name}</tspan>
                  </text>
                  <text
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    x={pX}
                    y={pY}
                    fill="#fff"
                    fontSize={this.state.activatedSector === idx ? '14' : '10'}>
                    <tspan>{(valuePercentage * 100).toFixed(1)}</tspan>
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        {this.renderTooltip()}
      </div>
    );
  }

  renderProduct() {
    const product = this.state.product;

    if (!product) {
      return '';
    }

    return (
      <div style={{boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)', margin: '10px 0', padding: '15px', overflow: 'hidden'}}>
        <div
          style={{
            margin: '-15px',
            overflow: 'hidden',
            maxHeight: '700px',
          }}>
          <img
            src={product.image}
            style={{
              width: '100%',
            }} />
        </div>
        <h1 style={{fontSize: '1.5em'}}>{product.title}</h1>
      </div>
    );
  }

  renderPositive() {
    const attr = this.props.data.attributes[this.state.activatedSector];

    if (!attr) {
      return '';
    }

    const list = attr.positive.reviews;

    return (
      <div>
        <h1
          style={{
            fontSize: '1.5em',
            margin: '10px 0',
            padding: '0px',
            color: '#004D40',
          }}>
          긍정 의견
        </h1>
        {list.length === 0 ? '추출된 긍정 의견이 없습니다.' : ''}
        <ul className="repReviews">
          {list.map((item, idx) => {
            return (
              <li
                key={idx}
                style={{
                  margin: '1px 0px',
                  backgroundColor: '#00BFA5',
                  borderRadius: '1px',
                  boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)',
                  color: '#fff',
                  padding: '10px',
                }}
                className="card">
                <span style={{
                  display: 'inline-block',
                }}>{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  renderNegative() {
    const attr = this.props.data.attributes[this.state.activatedSector];

    if (!attr) {
      return '';
    }

    const list = attr.negative.reviews;

    return (
      <div>
        <h1
          style={{
            color: '#311B92',
            fontSize: '1.5em',
            margin: '10px 0',
            padding: '0px',
          }}>
          부정 의견
        </h1>
        {list.length === 0 ? '추출된 부정 의견이 없습니다.' : ''}
        <ul className="repReviews">
          {list.map((item, idx) => {
            return (
              <li
                key={idx}
                style={{
                  margin: '1px 0px',
                  backgroundColor: '#B388FF',
                  borderRadius: '1px',
                  boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)',
                  color: '#fff',
                  padding: '10px',
                }}
                className="card">
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    const title = `상품 요약`;
    this.context.onSetTitle(title);

    return (
      <div className="wrap SummaryPage">
        <Row>
          <Col xs={8}>
            {this.renderGraph()}
            <Row>
              <Col xs={6}>
                {this.renderPositive()}
              </Col>
              <Col xs={6}>
                {this.renderNegative()}
              </Col>
            </Row>
          </Col>
          <Col xs={4}>
            {this.renderProduct()}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ReviewScroll />
          </Col>
        </Row>
      </div>
    );
  }

}

export default SummaryPage;

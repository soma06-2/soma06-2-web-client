import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from '../../decorators/withStyles';
import styles from './SummaryPage.css';
import d3 from 'd3';
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

    this.mouse = event;
    this.forceUpdate();
  }

  handleMouseEnter(idx) {
    return (event) => {
      if (!canUseDOM) {
        return;
      }

      this.state.activatedSector = idx;
      this.forceUpdate();

      this.mouse = event;
    }
  }

  handleMouseLeave(idx) {
    return (event) => {
      if (!canUseDOM) {
        return;
      }

      this.forceUpdate();

      this.mouse = null;
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

    if (!attr) {
      return '';
    }

    return (
      <div style={{
          position: 'absolute',
          top: event.offsetY + 40,
          left: event.offsetX + 70,
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
              const hX = cx + cos(radAngle + radAngle2) * (radius + 40);
              const hY = cy + sin(radAngle + radAngle2) * (radius + 40);

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

              const scale = this.state.activatedSector === idx ? 1.1 : 1;
              const transform = `translate(${cx}px,${cy}px) scale(${scale})`;

              return (
                <g key={idx}>
                  <path
                    d={d}
                    fill={this.state.activatedSector === idx ? accentChartColors[idx % chartColors.length] : chartColors[idx % chartColors.length]}
                    style={{
                      transform: transform,
                    }}
                    onMouseEnter={this.handleMouseEnter(idx).bind(this)}
                    onMouseLeave={this.handleMouseLeave(idx).bind(this)}
                    onMouseMove={this.handleMouseMove.bind(this)}
                    />
                  <text
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    x={hX}
                    y={hY}>
                    <tspan>{attr.name}</tspan>
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
            color: '#2979FF',
            fontSize: '1.5em',
          }}>
          긍정 의견
        </h1>
        <ul className="repReviews">
          {list.map((item, idx) => {
            return (
              <li
                key={idx}
                style={{
                  color: '#42A5F5',
                }}>
                {item}
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
            color: '#FF1744',
            textAlign: 'right',
            fontSize: '1.5em',
          }}>
          부정 의견
        </h1>
        <ul className="repReviews">
          {list.map((item, idx) => {
            return (
              <li
                key={idx}
                style={{
                  textAlign: 'right',
                  color: '#FF4081',
                }}>
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

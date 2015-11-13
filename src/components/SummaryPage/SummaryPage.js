import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from '../../decorators/withStyles';
import styles from './SummaryPage.css';
import { Row, Col } from 'react-bootstrap';
import { RaisedButton, FlatButton, Dialog } from 'material-ui';
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
    params: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      activatedSector: 0,
      product: null,
      stat1: 0,
    };

    this.worker = null;
    this.fps = 30;
    this.interval = 1000 / this.fps;
    this.total = 1;

    this.props.data.attributes.forEach((attr, idx) => {
      this.props.data.attributes[idx].name = attr.name.split('/')[0];
    });
  }

  componentWillMount() {
    console.log(this.props.data.attributes);
    if (!canUseDOM) {
      return;
    }

    this.worker = setInterval(this.animate.bind(this), this.interval);
  }

  componentWillUnmount() {
    if (this.worker) {
      clearInterval(this.worker);
      this.worker = null;
    }
  }

  animate() {
    const stat = this.getActivatedSector().positive.stat;
    const dest = stat ? stat / this.total : 0;

    this.state.stat1 += (dest - this.state.stat1) / dest * 0.1;

    const d3 = (function (self) {
      const width = 600, height = 480;
      const cx2 = width / 2 + 200, cy3 = height / 2 + 100;
      const radius = 60;
      const cos = Math.cos, sin = Math.sin;
      const mPI = Math.PI * 2;
      const valuePercentage = self.state.stat1 / 1;
      const longArc = (valuePercentage <= 0.5) ? 0 : 1;
      const radSegment = valuePercentage * mPI;
      const nextX = cos(radSegment) * radius;
      const nextY = sin(radSegment) * radius;

      return [
        `M${cx2},${cy3}`,
        `L${cx2 + nextX},${cy3 + nextY}`,
        `A${radius},${radius}`,
        '0',
        `${longArc},0`,
        `${cx2 + radius},${cy3}`,
        'z',
      ].join(' ');
    })(this);

    this.refs.attrStat.setAttribute('d', d3);
  }

  componentDidMount() {
    this.state.product = JSON.parse(localStorage.tmp);
    this.forceUpdate();
  }

  handleMouseMove(event) {
    if (!canUseDOM) {
      return;
    }

    this.forceUpdate();
  }

  handleMouseEnter(idx) {
    return (event) => {
      if (!canUseDOM) {
        return;
      }

      this.state.activatedSector = idx;

      this.forceUpdate();
    }
  }

  handleMouseLeave(idx) {
    return (event) => {
      if (!canUseDOM) {
        return;
      }

      this.forceUpdate();
    }
  }

  getActivatedSector() {
    return this.props.data.attributes[this.state.activatedSector];
  }

  renderGraph() {
    const width = 600, height = 480;
    const cx = width / 2 - 100, cy = height / 2;
    const cx2 = width / 2 + 200, cy2 = height / 2 - 100, cy3 = height / 2 + 100;

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

    const d2 = (function (self) {
      const radius = 60;
      const valuePercentage = 0.7 / total;
      const longArc = (valuePercentage <= 0.5) ? 0 : 1;
      const radSegment = valuePercentage * mPI;
      const nextX = cos(radSegment) * radius;
      const nextY = sin(radSegment) * radius;

      return [
        `M${cx2},${cy2}`,
        `L${cx2 + nextX},${cy2 + nextY}`,
        `A${radius},${radius}`,
        '0',
        `${longArc},0`,
        `${cx2 + radius},${cy2}`,
        'z',
      ].join(' ');
    })(this);

    return (
      <div
        className="graph"
        style={{
          margin: '0',
          width: `${width}px`,
        }}>
        <svg width={width} height={height}>
          <defs
            dangerouslySetInnerHTML={{
              __html: [
                '<filter id="f1" x="0" y="0" width="200%" height="200%">',
                `<feOffset result="offOut" in="SourceGraphic" dx="0" dy="3" />`,
                `<feGaussianBlur result="blurOut" in="offOut" stdDeviation="4" />`,
                `<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />`,
                `</filter>`,
              ].join('')
            }} />
          <g>
            <circle cx={cx2} cy={cy2} r={60} fill="#B388FF" />
            <text
              textAnchor="middle"
              alignmentBaseline="middle"
              x={cx2}
              y={cy2 - 75}
              fontSize="0.8em"
              fill="#333">
              <tspan>전체 긍정/부정 비율</tspan>
            </text>
            <path
              d={d2}
              style={{
              }}
              fill="#00BFA5"
              />
            <circle cx={cx2} cy={cy2} r={25} fill="#fff" />
            <circle cx={cx2} cy={cy3} r={60} fill="#B388FF" />
            <text
              textAnchor="middle"
              alignmentBaseline="middle"
              x={cx2}
              y={cy3 - 75}
              fontSize="0.8em"
              fill="#333">
              <tspan>해당 속성의 긍정/부정 비율</tspan>
            </text>
            <path
              fill="#00BFA5"
              style={{
              }}
              ref="attrStat"
              />
            <circle cx={cx2} cy={cy3} r={25} fill="#fff" />
          </g>
          <g>
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

              const scale = (this.state.activatedSector === idx ? 1.1 : '0.9, 0.9');
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
                  onMouseMove={this.handleMouseMove.bind(this)}
                  ref="chartPie">
                  <path
                    d={d}
                    style={{
                    }}
                    fill={this.state.activatedSector === idx ? accentChartColors[idx % chartColors.length] : chartColors[idx % chartColors.length]}
                    />
                  <text
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    x={hX}
                    y={hY}
                    fill={this.state.activatedSector === idx ? '#000' : '#777'}>
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
            <circle cx={cx} cy={cy} r={radius - 80} fill="#fff" />
          </g>
        </svg>
      </div>
    );
  }

  renderProduct() {
    const product = this.state.product;

    if (!product) {
      return '';
    }

    return (
      <div
        style={{
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
          margin: '10px 0',
          marginTop: '20px',
          padding: '15px',
          overflow: 'hidden'
        }}>
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
                  ref="repReview"
                  style={{
                    margin: '1px 0px',
                    backgroundColor: '#00BFA5',
                    borderRadius: '1px',
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
                ref="repReview"
                style={{
                  margin: '1px 0px',
                  backgroundColor: '#B388FF',
                  borderRadius: '1px',
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

  renderTranslator() {
    return (
      <div>
        <h3
          style={{
            fontSize: '1.5em',
            margin: '10px 0',
            marginTop: '30px',
            padding: '0px',
          }}>
          의견 실시간 분석기
        </h3>
        <textarea
          placeholder="리뷰를 입력해주세요."
          rows="8"
          style={{
            width: '100%',
            border: 'none',
            borderRadius: '1px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            padding: '10px',
            fontSize: '0.8em',
          }}>
        </textarea>
        <div
          style={{
            textAlign: 'right',
          }}>
          <RaisedButton
            primary={true}
            onClick={this.handleClick.bind(this)}
            label="분석" />
        </div>
      </div>
    );
  }

  handleClick() {
    this.refs.reviewAnalyzer.show();
  }

  _handleCustomDialogCancel() {
    this.refs.reviewAnalyzer.dismiss();
  }

  render() {
    const dialogCustomActions = [
      <FlatButton
        label="닫기"
        secondary={true}
        onTouchTap={this._handleCustomDialogCancel.bind(this)} />,
    ];

    const title = `상품 요약`;
    this.context.onSetTitle(title);

    const attrFilter = [];

    this.props.data.attributes.forEach((attr, idx) => {
      attrFilter.push({
        payload: idx,
        text: `${attr.name} (${attr.totalReviews})`,
      });
    });

    return (
      <div className="wrap SummaryPage">
        <Row>
          <Col
            xs={8}>
            {this.renderGraph()}
            <Row
              style={{
                height: '250px',
                overflow: 'hidden',
              }}>
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
            {this.renderTranslator()}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ReviewScroll
              attrFilter={attrFilter}
              productId={canUseDOM ? JSON.parse(localStorage.tmp).productId : this.context.params.productId} />
          </Col>
        </Row>
        <Dialog
          title="리뷰 분석"
          ref="reviewAnalyzer"
          actions={dialogCustomActions}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}>
          <div
            style={{
              height: '400px',
              color: '#000',
              position: 'relative',
            }}>
            분석된 리뷰 결과
            </div>
        </Dialog>
      </div>
    );
  }

}

export default SummaryPage;

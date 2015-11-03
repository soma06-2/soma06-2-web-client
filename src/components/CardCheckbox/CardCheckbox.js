import React, { Component, PropTypes } from 'react';
import { Checkbox } from 'material-ui';

export default class CardCheckbox extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onCheck: PropTypes.func,
  };

  constructor() {
    super();

    this.state = {
      isHover: false,
    };
  }

  handleCheck(event) {
    if (this.props.onCheck) {
      this.props.onCheck(event);
    }

    console.log(this.refs.checkbox.value);
  }

  handleMouseEnter(event) {
    this.state.isHover = true;
  }

  handleMouseLeave(event) {
    this.state.isHover = false;
  }

  render() {
    return (
      <div style={style.origin} onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
        <Checkbox ref="checkbox" label={this.props.label} onCheck={this.handleCheck.bind(this)} />
      </div>
    );
  }
};

var style = {
  origin: {
    margin: '3px',
    padding: '10px 10px',
    paddingBottom: '5px',
    background: '#eee',
  },

  acitvated: {

  },
};

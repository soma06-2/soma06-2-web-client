import React, { Component, PropTypes } from 'react';
import { Checkbox } from 'material-ui';
import withStyles from '../../decorators/withStyles';
import styles from './CardCheckbox.css';
import Ink from 'react-ink';

@withStyles(styles)
class CardCheckbox extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    defaultChecked: PropTypes.boolean,
    onCheck: PropTypes.func,
  };

  static propDefaults = {
    defaultChecked: false,
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
  }

  handleMouseEnter(event) {
    this.state.isHover = true;
  }

  handleMouseLeave(event) {
    this.state.isHover = false;
  }

  render() {
    return (
      <div
        className="CardCheckbox"
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}>
        <Checkbox
          ref="checkbox"
          label={this.props.label}
          value={this.props.value}
          defaultChecked={this.props.defaultChecked}
          onCheck={this.handleCheck.bind(this)} />
        <Ink />
      </div>
    );
  }
};

export default CardCheckbox;

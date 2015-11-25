import React from 'react';
import deepstream from 'deepstream.io-client-js';

export default class MyComponent extends React.Component {

  static propTypes = {
    initialCount: React.PropTypes.number,
  };

  // static defaultProps = {initialCount: 0}

  state = {price: -1}

  componentDidMount() {
    this.ds = deepstream('52.29.184.11:6020').login({}, this.onConnected );
  }

  onConnected = () => {
    const amzn = this.ds.record.getRecord( 'sp500/GOOG' );
    amzn.subscribe( 'last_price', lastPrice => this.setState({price: lastPrice}));
  }

  handleClick() {
    // this.setState({count: this.state.count + 1});
  }

  render() {
    return (
      <div>
        <div>Price: {this.state.price}</div>
      </div>
    );
  }
}

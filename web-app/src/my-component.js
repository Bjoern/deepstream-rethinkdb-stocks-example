import React from 'react';
import deepstream from 'deepstream.io-client-js';

export default class MyComponent extends React.Component {

  static propTypes = {
    initialCount: React.PropTypes.number,
  };

  // static defaultProps = {initialCount: 0}

  state = {prices: []}

  componentDidMount() {
    this.ds = deepstream('52.29.184.11:6020').login({}, this.onConnected );
  }

  onConnected = () => {
    const amzn = this.ds.record.getRecord( 'sp500/GOOG' );
    amzn.subscribe( 'last_price', lastPrice => {
      const {prices} = this.state;
      prices.push(lastPrice);
      this.setState({prices});
    });
  }

  render() {
    return (
      <div>
        <div>Price: {this.state.prices.map(price => <span><b>{price}</b>,</span>)}</div>
      </div>
    );
  }
}

import React from 'react';
import deepstream from 'deepstream.io-client-js';

class Agent {
  constructor(buyRule, sellRule) {
    // rule = "ud"
    this.buyRule = buyRule;
    this.sellRule;
  }

  money = 0;
  stocks = 0;

  buy(history, price) {
    // history = "du"
    if (history === this.buyRule) {
      this.money -= price;
      this.stocks += 1;
    }
  }

  sell(history, price) {
   if (this.stocks > 0 && history === this.sellRule) {
      this.money += price;
      this.stocks += -1;
    }
  }
}

export default class MyComponent extends React.Component {

  static propTypes = {
    initialCount: React.PropTypes.number,
  };

  // static defaultProps = {initialCount: 0}

  constructor(props) {
    super(props);
    this.state = {
      prices: [], movements: "", agents: []
    }
  }

  componentDidMount() {
    this.ds = deepstream('52.29.184.11:6020').login({}, this.onConnected);
  }

  onConnected = () => {
    const amzn = this.ds.record.getRecord( 'sp500/GOOG' );
    amzn.subscribe( 'last_price', lastPrice => {
      const {prices, agents} = this.state;
      prices.push(lastPrice);
      let tmpPrice = null;
      let history = "";
      prices.slice(-3).forEach(p => {
        if (tmpPrice) {
          history += tmpPrice > p ? "d" : "u";
        }
        tmpPrice = p;
      });
      if (history.length === 2) {
        agents.forEach(a => {
          a.buyRule(history, lastPrice);
          a.sellRule(history, lastPrice);
        });
      }
      this.setState({prices, movements: history, agents});
    });
  }

  render() {
    const {movements, agents} = this.state;

    return (
      <div>
        <div>Movements: {movements}</div>
        <h2>Agents</h2>
        <div>
          {agents.sort((a,b) => a.money - b.money).map(a => (
            <div>
              <span><b>buy: </b>{a.buyRule}</span>
              <span> <b>sell: </b>{a.sell}</span>
              <span> <b>stocks: </b>{a.stocks}</span>
              <span> <b>MONEY: </b>{a.money}</span>
            </div>
          ))}
        </div>

      </div>
    );
  }
}

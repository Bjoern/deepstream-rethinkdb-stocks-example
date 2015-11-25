import React from 'react';
import deepstream from 'deepstream.io-client-js';

class Agent {
  constructor(buyRule, sellRule) {
    // rule = "ud"
    this.buyRule = buyRule;
    this.sellRule = sellRule;
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

//create all agents
var ruleLength = 2;

var agents = [];

function makeAgents(rule){
	console.log("makeAgents "+rule);
	if(rule.length == ruleLength*2){
		var buyRule = rule.substring(0,ruleLength);
		var sellRule = rule.substring(ruleLength,rule.length);
		console.log("buy: "+buyRule+", sell: "+sellRule);
		var agent = new Agent(buyRule, sellRule);
		agents.push(agent);

	} else {
		makeAgents(rule+"0");
		makeAgents(rule+"1");
	}
}

makeAgents("");

for(var i = 0; i < 2* ruleLength; i++){
	
}

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

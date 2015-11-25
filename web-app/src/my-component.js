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

var globalagents = [];

function makeAgents(rule){
	console.log("makeAgents "+rule);
	if(rule.length == ruleLength*2){
		var buyRule = rule.substring(0,ruleLength);
		var sellRule = rule.substring(ruleLength,rule.length);
		console.log("buy: "+buyRule+", sell: "+sellRule);
		var agent = new Agent(buyRule, sellRule);
		globalagents.push(agent);

	} else {
		makeAgents(rule+"u");
		makeAgents(rule+"d");
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

  constructor(props) {
    super(props);
    this.state = {
      prices: [], movements: "", agents: globalagents
    }
  }

  componentDidMount() {
    this.ds = deepstream('52.29.184.11:6020').login({}, this.onConnected);
  }

  onConnected = () => {
    const amzn = this.ds.record.getRecord( 'sp500/AAPL' );
    amzn.subscribe( 'last_price', lastPrice => {
      lastPrice = parseFloat(lastPrice);
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
          a.buy(history, lastPrice);
          a.sell(history, lastPrice);
        });
      }
      this.setState({prices, movements: history, agents});
    });
  }

  render() {
    const {movements, agents, prices} = this.state;

    return (
      <div>
        <div>Prices: {prices.map(p => <span>{p}, </span>)}</div>
        <div>Movements: {movements}</div>
        <h2>Agents</h2>
        <div>
          {agents.sort((a,b) => (b.stocks * prices[prices.length-1] + b.money) - (a.stocks * prices[prices.length-1] + a.money)).map(a => (
            <div>
              <span><b>buy: </b>{a.buyRule}</span>
              <span> <b>sell: </b>{a.sellRule}</span>
              <span> <b>stocks: </b>{a.stocks}</span>
              <span> <b>money: </b>{a.money.toFixed(2)}</span>
              <span> <b>PROFIT: </b>{(a.stocks * prices[prices.length-1] + a.money).toFixed(2)}</span>
            </div>
          ))}
        </div>

      </div>
    );
  }
}

import './App.css';
import Web3 from 'web3'
// import getWeb3 from './getWeb3'
import 'bootstrap/dist/css/bootstrap.min.css';
import KyberNetwork from './KyberNetworkProxy'
import kyberLogo from "./Kyber_Swap_Black.svg"
import React, { Component } from "react";
import {InputGroup} from 'react-bootstrap';
import { filterInputNumber, caculateSourceAmount, caculateDestAmount, toTWei } from "./utils";

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      balance: 0,
      account: '0xA0a904c76429bbf7B556fB74897bc8CB7b0fe40a',
      error: null,
      isLoaded: false,
      items: [],
      srcAmount : '',
      src: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      dest: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      srcSymbol :'ETH',
      destSymbol : 'ETH',
      destAmount: '',
      destAddress: '',
      miniRate: 0,
      ConnectedMetaMask: false
    }
    

    this.handleSrcChange = this.handleSrcChange.bind(this);
    this.ConnectMetaMask = this.ConnectMetaMask.bind(this);
    this.handleSrcAmount = this.handleSrcAmount.bind(this);
    this.handleDestChange = this.handleDestChange.bind(this);
    this.handleDestAmount = this.handleDestAmount.bind(this);
    this.handleSwap = this.handleSwap.bind(this);
  };

  async componentDidMount() {
    await fetch("https://ropsten-api.kyber.network/currencies")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.data
          });
        },
        
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  async handleSrcChange(event) {
    try{
    event.persist()
    await this.setState({src : this.state.items[event.target.value].address})
    await this.setState({srcSymbol : this.state.items[event.target.value].symbol})
    console.log(this.state.srcSymbol);
    console.log(this.state.src);
    await this.getBalance();
    await this.RateRight();
    await this.miniRate();
    }catch(error){
      console.log(error); 
    }
  }

  async handleDestChange(event) {
    try{
      event.persist()
      await this.setState({dest : this.state.items[event.target.value].address});
      await this.setState({destSymbol : this.state.items[event.target.value].symbol});
      console.log(this.state.dest);
      console.log();
      await this.RateRight();
      this.miniRate();
    }catch(error){
      console.log(error);
    };
    
    
  }

  async getBalance() {
    try{
      let balanceWei = await KyberNetwork.methods.getBalance(this.state.src , this.state.account).call()
      let balance = await Web3.utils.fromWei(balanceWei, "ether");
      await this.setState({balance : balance })
      console.log(this.state.balance);
    }catch(error){

    } 
  }

  async ConnectMetaMask() {    
    var web3Provider = null;
    var web3 = new Web3(window.ethereum);
    if (typeof web3 !== undefined) {
        web3Provider = window.web3.currentProvider;
    } else {
        web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    }
    web3 = new Web3(web3Provider);
    console.log(web3Provider);
    await web3Provider.enable();
    let accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    this.setState({account:accounts[0]})
    this.setState({ConnectedMetaMask: true})
    await this.getBalance();
    }

  async RateRight(){
    try{
    let a = toTWei(1)
    let destAmountWei = await KyberNetwork.methods.getExpectedRate(this.state.src,this.state.dest,a).call()
    let destAmount = await caculateDestAmount(this.state.srcAmount, destAmountWei.expectedRate, 18)
    await this.setState({destAmount : destAmount})
    }catch(error) {
      console.error(error)
    } 
  }

  async RateLeft(){
    try{
      let a = toTWei(1)
      let srcAmountWei = await KyberNetwork.methods.getExpectedRate(this.state.src,this.state.dest, a ).call()
      let srcAmount = await caculateSourceAmount(this.state.destAmount, srcAmountWei.expectedRate, 18)
      await this.setState({srcAmount : srcAmount})
    }catch(error){
      console.error(error)
    }
  }

  async miniRate(){
    try{
    let a = toTWei(1)
    let destAmountWei = await KyberNetwork.methods.getExpectedRate(this.state.src,this.state.dest,a).call()
    let miniRate = await caculateDestAmount(1, destAmountWei.expectedRate, 18)
    await this.setState({miniRate : miniRate})
    }catch(error) {
      console.error(error)
    } 
  }

  async handleSwap(){
    try{
      const src = this.state.src; 
      const a = toTWei(this.state.srcAmount)
      const srcAmount = new Web3.utils.BN(a.toString());
      console.log(srcAmount);
      const dest = this.state.dest; // KNC
      const destAddress = this.state.account;
      const maxDestAmount = new Web3.utils.BN(Math.pow(2, 255).toString)
      console.log(maxDestAmount);
      const minConversionRate = 0;
      const walletId = "0x0000000000000000000000000000000000000000";
      if(src === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'){
        await KyberNetwork.methods.trade(src, srcAmount, dest, destAddress, maxDestAmount, minConversionRate, walletId).send({from: this.state.account, value: srcAmount.toString()})
      console.log(this.state.dest);
      }else{
        await KyberNetwork.methods.trade(src, srcAmount, dest, destAddress, maxDestAmount, minConversionRate, walletId).send({from: this.state.account, value: 0})
      }
      
    }catch(error){
      console.log(error);
    }
  }

  async handleSrcAmount(event){
    try{
      if (filterInputNumber(event, event.target.value, this.state.srcAmount)) {
        await this.setState({
          srcAmount: event.target.value
        });
        console.log(this.state.srcAmount);
        
      }
      await this.RateRight()
    }catch(error){
      console.error(error);
    }
  }

  async handleDestAmount(event){
    try{
      if (filterInputNumber(event, event.target.value, this.state.destAmount)) {
        await this.setState({
          destAmount: event.target.value 
        });
      }
      await this.RateLeft()
    }catch(error){
      console.error(error);
    }
    
  }


  render(){
    const { items } = this.state;
    return (
      <div >
      <img src = {kyberLogo} alt ='logo' ></img>
      <div className ='bg'>
      <h2 className = 'title'> Fast and simple way to exchange Ethereum tokens </h2>
      <br></br>
      <div  className = 'card exchange__container'>
      <div>
        <div className = 'exchange__form theme__background-2'>
          <div className ='container'>
            <div className ='row'>
              <div className ='col'>
                <div className ='exchange-item-label'> From:</div>
                
                <InputGroup className="mb-3" >
                <select className="form-control" onChange = {this.handleSrcChange}>
                    {items.map((item, index) => (
                      <option key ={index} value ={index}>
                        {item.symbol}
                      </option>
                    ))}
                    </select>
                    <input className = "form-control" type ='text' placeholder="0" min ="0"
                     aria-describedby="basic-addon1" value={this.state.srcAmount} 
                     onChange ={this.handleSrcAmount}  ></input>
                </InputGroup>

                    <div>{this.state.ConnectedMetaMask
                    ?<p className ='smallFont'>{this.state.srcSymbol} balance : {this.state.balance} {this.state.srcSymbol}</p>:<div></div>}</div>

            </div>
            <div className ='col'>
                <div className ='exchange-item-label'> To:</div>
                <InputGroup className="mb-3">
                
                  <select className="form-control" onChange = {this.handleDestChange}>
                    {items.map((item, index) => (
                      <option key={index} value ={index}>
                        {item.symbol} 
                      </option>
                    ))}
                    </select>                
                  <input className = "form-control" type ='text' placeholder="0" min ="0"
                     aria-describedby="basic-addon1" value={this.state.destAmount} 
                     onChange ={this.handleDestAmount}  ></input>
                </InputGroup>
                    <p className ='smallFont textRight'>1 {this.state.srcSymbol} = {this.state.miniRate} {this.state.destSymbol} </p>
            </div>
            </div>
            </div>
            <div className = 'center'><button className = 'btn btn-info center btn-lg'  onClick = {this.handleSwap}>Swap Now</button></div>
            <br></br>
            <div><button type ='button' className = 'btn btn-warning' onClick = {this.ConnectMetaMask}>ConnectMetaMask</button></div>
          </div>
      </div>
      </div>
      </div>
      </div>
    );
  }
}
export default App;


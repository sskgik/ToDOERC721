import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import Web3 from 'web3';
import './App.css';
import ERC721ABI from './ABI/ERC721Full.json';


//environment
const INFURA_API_KEY = '47cae7d48ef648b2b0ed026f1491f29e';
const web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai.infura.io/v3/"+INFURA_API_KEY));

function App() {
  const [Address, setAddress] = useState("");
  const [TokenId, setTokenId] = useState("");
  const [account,setAccount] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

  //MetaMaskChrome拡張機能がインストールされているかの変数を準備
	const [metaMaskFlag, setMetaMaskFlag] = useState(false);

	useEffect(() => {
		const tmpFlag = window.ethereum && window.ethereum.isMetaMask;
		setMetaMaskFlag(tmpFlag);
	},[]);

  const mint = async () => {
    //parameta instantiate
    const ContractAddress = '0xfBbB97f7303a9086FFe00Fe57DE00519B01FeF5d'
    const toMint = Address;
    const tokenid = TokenId;
    //ABI
    const ABI = ERC721ABI;
    const ERC721Contract = new web3.eth.Contract(ABI,ContractAddress);
    
    //Make Tx
    if(account == null){
        alert('wallet is not connecting')
        return;
    }

    const encodeData = await ERC721Contract.methods.mint(toMint,tokenid).encodeABI();
    const estimateGas = await ERC721Contract.methods.mint(toMint,tokenid).estimateGas({from: account});
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(account);
    const tx = {
      from: account,
      to: ContractAddress,
      gasPrice: gasPrice.toString(),
      gas: estimateGas.toString(),
      nonce: nonce.toString(),
      data: encodeData
    }
    console.log(tx)

    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
    })
    .then((result) => {
        console.log(result)
    })


  }
  //Meatamask Connect function

	const connectWallet = () => {
		window.ethereum
		.request({ method: "eth_requestAccounts" })
		.then((result) => {
			  setAccount(result[0]);
		})
		.catch((error) => {
		  setErrorMessage(error.message);
		});
	}

  return (
    <div className="App">
      <header className="App-header">
      <button className='Connectbutton' onClick={connectWallet} >Connect</button>
        <p>
          MInt Function
        </p>
        <p>
          Address for mint 
        </p>
        <input value={Address} onChange={(event) => setAddress(event.target.value)} className='address-input'></input>
        <p>
          tokenId for mint 
        </p>
        <input value={TokenId} onChange={(event) => setTokenId(event.target.value)} className='address-input'></input>
        <button className='mintbutton' onClick={mint} >Mint</button>
      </header>
    </div>
  );
}





export default App;


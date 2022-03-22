import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';

const contractAddress = "0xbEc7A867e740cCC72b6fd3cca5cA79a7783D4541";
const abi = contract.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") });
        console.log("Mining your pepe chest... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    
    <div className='main-app'>
                <li className='header'><a href="https://www.pepefrens.com/" target="_blank" rel="noopener noreferrer">Website</a></li>
                <li className='header'>🐸</li>
                <li className='header'><a href="https://twitter.com/pepefrensnft" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li className='header'>🐸</li>
                <li className='header'><a href="https://discord.gg/6HXKdXXZ" target="_blank"rel="noopener noreferrer">Discord</a></li>
                <li className='header'>🐸</li>
                <li className='header'><a href="https://testnets.opensea.io/collection/tepetrenstest" target="_blank"rel="noopener noreferrer">Opensea</a></li>
                <li className='header'>🐸</li>
        
      <h2 style={{ color: 'darkgreen', fontSize: '60px'}}>Will you be my fren?</h2>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
      <p><a href="https://opensea.io/account" target="_blank" rel="noopener noreferrer">After minting, click here to see your new Pepefren NFT!</a></p>

      <p><img src="../pepe.png" alt="pepe" width="60%"></img></p>
                
                </div>
  )
}

export default App;

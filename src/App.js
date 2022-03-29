import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrog } from '@fortawesome/free-solid-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'


const contractAddress = "0x37CA438d8d15E84C1d85289B94F283Ae74050AE5";
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
      <div className='header'>   
        <li><a href="https://www.pepefrens.com/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faHome} size="3x" /></a>PepeFrens.com</li>    
        <li><a href="https://twitter.com/pepefrensnft" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} size="3x" /></a>@pepefrensnft</li>
        <li><a href="https://discord.gg/6HXKdXXZ" target="_blank"rel="noopener noreferrer"><FontAwesomeIcon icon={faDiscord} size="3x" /></a>Find Frens</li>
        <li><a href="https://opensea.io/collection/pepefrens" target="_blank"rel="noopener noreferrer"><FontAwesomeIcon icon={faFrog} size="3x"/></a>The Collection</li> 
        </div>   
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

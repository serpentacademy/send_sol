import logo from './logo.svg';
import './App.css';

import {LAMPORTS_PER_SOL, Connection, Transaction, PublicKey, SystemProgram} from "@solana/web3.js"
import {useState} from 'react';



function App() 
{

  const [lamports, setLamports] = useState(0);
  let wallet;

  function connectWallet(){

    (async() => {
      try {
        const resp = await window.solana.connect();
        wallet = resp;

        }   
        catch (err) {
        }
    })();
    window.solana.on("connect", () => console.log("Connected"))

  }
  
  function signInTransactionAndSendMoney(lamports){

    (async() => {
      const network = "https://api.devnet.solana.com";
      const connection = new Connection(network);
  
      lamports = lamports * LAMPORTS_PER_SOL;
      try {
        const destPubkeyStr = "3JJ7geuN51xSK2zbsDXpwoo5gKzY1eyTxxX4bUoZ2e9x"
        console.log("starting sendMoney");
        const destPubkey = new PublicKey(destPubkeyStr);
        const walletAccountInfo = await connection.getAccountInfo(
        wallet.publicKey
        );
        console.log("wallet data size", walletAccountInfo?.data.length);
  
        const receiverAccountInfo = await connection.getAccountInfo(destPubkey);
        console.log("receiver data size", receiverAccountInfo?.data.length);
  
        const instruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: destPubkey,
        lamports, // about half a SOL
        });
        let trans = await setWalletTransaction(instruction, connection);
  
        let signature = await signAndSendTransaction(trans, connection);
        let result = await connection.confirmTransaction(signature, "singleGossip");
        console.log("money sent", result);
      } catch (e) {
          console.warn("Failed", e);
        }
  
  
    })()
  }

  async function signAndSendTransaction(transaction, connection) {
    // Sign transaction, broadcast, and confirm
    const { signature } = await window.solana.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signature);
    
    
    //let signedTrans = await wallet.signTransaction(transaction);
    console.log("sign transaction");
    //let signature = await connection.sendRawTransaction(signedTrans.serialize());
    console.log("send raw transaction");
    return signature;
  }

  async function setWalletTransaction(instruction,connection) {

    const transaction = new Transaction();
    transaction.add(instruction);
    transaction.feePayer = wallet.publicKey;
    let hash = await connection.getRecentBlockhash();
    console.log("blockhash", hash);
    transaction.recentBlockhash = hash.blockhash;
    return transaction;
  }
  function sendLamports(){
    console.log("sending: "+lamports)
    signInTransactionAndSendMoney(lamports)
    }
  
  
  
  
  

  return (
    <div className="App">
          <br></br>
    <button  onClick={connectWallet}>connect wallet</button>
    <input onChange={e => setLamports(e.target.value)} type={'number'}>
    </input>
    <button onClick={sendLamports}>Send Sol</button>


    </div>
  );
}

export default App;

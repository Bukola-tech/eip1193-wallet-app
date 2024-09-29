// src/components/WalletConnection.js
import React, { useState } from 'react';
import useWallet from '../hooks/useWallet';

const WalletConnection = () => {
  const { account, balance, network, connectWallet, error, getBalanceOfAddress } = useWallet();
  const [inputAddress, setInputAddress] = useState('');
  const [anyBalance, setAnyBalance] = useState("")

  const handleInputChange = (e) => {
    setInputAddress(e.target.value);
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4"> Wallet Connection</h2>

      {/* Wallet connection status */}
      {account ? (
        <div className="mb-6">
          <p>Connected account: <span className="text-green-400">{account}</span></p>
          <p>Network ID: <span className="text-green-400">{network}</span></p>
          <p>Balance: <span className="text-green-400">{balance} ETH</span></p>
        </div>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}

      {/* Input field for any address */}
      <div className="balance-check mt-4">
         <div className="text-2xl font-bold mb-4">Get Address Balance</div> 
        <input
          type="text"
          placeholder="Enter Ethereum address"
          value={inputAddress}
          onChange={handleInputChange} // Updated to use the handleInputChange function
          className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-900 text-white"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            if (inputAddress) {
              const balanceInEth = await getBalanceOfAddress(inputAddress);
              setAnyBalance(balanceInEth); // Set the balance in state
            }
          }}
        >
          Check Balance
        </button>
        {anyBalance && <p>Balance: <span className="text-green-400">{anyBalance} ETH</span></p>} 
      </div> 

      {/* Error handling */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default WalletConnection;

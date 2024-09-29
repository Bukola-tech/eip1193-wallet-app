// src/hooks/useWallet.jsx
import { useState, useEffect, useCallback } from 'react';

const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) { 
          setAccount(accounts[0]);
          handleNetworkChange();
          getBalance(accounts[0]);
        } else {
          setError('No accounts found. Please ensure your wallet is set up correctly.');
        }
      } catch (err) {
        setError('Could not connect to wallet');
        console.error('Error connecting to wallet: ', err);
      }
    } else {
      setError('No Ethereum provider found. Please install MetaMask.');
    }
  }, []);

  const getBalance = useCallback(async (address) => {
    if (window.ethereum) {
      try {
        const balanceInWei = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        const balanceInEth = window.ethereum.utils
          ? window.ethereum.utils.fromWei(balanceInWei, 'ether')
          : balanceInWei / 1e18;
        setBalance(balanceInEth);
      } catch (err) {
        setError('Failed to fetch balance');
        console.error('Error fetching balance: ', err);
      }
    }
  }, []);

  const getBalanceOfAddress = useCallback(async (address) => {
    if (window.ethereum) {
      try {
        const balanceInWei = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        const balanceInEth = window.ethereum.utils
          ? window.ethereum.utils.fromWei(balanceInWei, 'ether')
          : balanceInWei / 1e18;
        return balanceInEth; // Return the balance
      } catch (err) {
        setError('Failed to fetch balance for the address');
        console.error('Error fetching balance for address: ', err);
      }
    }
  }, []);

  const handleNetworkChange = useCallback(async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId);
    } catch (err) {
      setError('Failed to get network information');
      console.error('Error fetching network: ', err);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0]);
        getBalance(accounts[0]);
      };

      const handleChainChanged = () => {
        handleNetworkChange();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [getBalance, handleNetworkChange]);
  
  useEffect(() => {
    if (account) {
      getBalance(account); // Fetch balance whenever the account changes
    }
  }, [account, getBalance]);

  return { account, balance, network, connectWallet, error ,getBalanceOfAddress};
};

export default useWallet;

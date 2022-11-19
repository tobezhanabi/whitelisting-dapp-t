import Head from "next/head";
import Web3Modal from "web3modal";
import { useEffect, useRef, useState } from "react";

import { Contract, providers } from "ethers";
import styles from "../styles/Home.module.css";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);

  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("change to goerli network");
      throw new Error("change to goerli network");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };
  const addAddressToWhitelist = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the addAddressToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(window.alert("You have already joined the whitelist"));
    }
  };
  const getNumberOfWhitelisted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numOfWhitelisted = await whitelistContract.numAddressWhitelisted();
      setNumOfWhitelisted(_numOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };
  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);

      //throw new Error("change to goerli network");
    } catch (err) {
      console.log(err);
    }
  };
  const connectWallet = async function () {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (err) {
      console.log(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      }
      if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disabledInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title> Whitelist dApp</title>
        <meta name="desc" content="whitelist dapp"></meta>
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Dev</h1>
          <div className={styles.description}>
            An NFT collection for Developers
          </div>
          <div className={styles.description}>
            {numOfWhitelisted} have already join the whitelist gang
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>
      <footer className={styles.footer}>Made with &#10084; by Tobez</footer>
    </div>
  );
}

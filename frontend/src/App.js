import React, { useState, useEffect } from 'react';
import { Box, Container, Button, Grid, Card, CardActions, CardContent, Typography, CardMedia } from '@mui/material';
import { ethers } from 'ethers';
import mintercontract from './contract/NFTMinter.json';
import collectioncontract from './contract/Collection.json';

const minterContractAddr = "0x42D926D726e3642D2286da3F38171F9fDf4cAcd1";
const collectionContractAddr = "0xF20132003e3f5A3E949576eC7495362d77ecb10d";

const nftMinterAbi = mintercontract.abi;
const collectionAbi = collectioncontract.abi;


const NFTPrice = 0.01;


function App() {

  const [MintState, setMintState] = useState(false);
  const [collection, setcollection] = useState("Collection");
  const [minter, setminter] = useState("1")
  const [currentAccount, setCurrentAccount] = useState(null);
  const [imageUrl, setimageUrl] = useState('');

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);

      setCurrentAccount(account);
    }
    else {
      console.log("No authorized account found");
    }
  }
  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("!please install MEtamask!")
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      nftMinted();
      setCurrentAccount(accounts[0]);
      console.log("account", currentAccount);

    }
    catch (err) {
      console.log(err);
    }
  }

  const nftMinted = async () => {
    console.log("nftminted function called")
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const collection_contract = new ethers.Contract(collectionContractAddr, collectionAbi, signer);
        const nftMinted = await collection_contract.mintedNFT(signer.getAddress());
        console.log("Minstate", nftMinted)
        setMintState(nftMinted);
        let tokenuri = await collection_contract.tokenURI(1);
        const response = await fetch(tokenuri);
        const data = await response.json();
        console.log('jsondata', data);
        setimageUrl(data.imgUrl);


      }
      else {
        console.log("Ethereum object does not exist");
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  function fromEth(num) {
    return ethers.utils.parseEther(num.toString());
  }


  const mintNftHandler = async () => {

    try {
      const { ethereum } = window;


      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(minterContractAddr, nftMinterAbi, signer);


        if (MintState) {
          console.log("Minted already");
        }
        else {
          console.log("Initialize payment");
          let nftTxn = await nftContract.mint(signer.getAddress(), 1, { value: fromEth(0.01) });

          console.log("Mining... please wait");
          await nftTxn.wait();

          console.log(`Mined, see transaction: https://mumbai.polygonscan.com/address/${nftTxn.hash}`);
        }


      }
      else {
        console.log("Ethereum object does not exist");
      }

    }
    catch (err) {
      console.log(err);
    }
    nftMinted();
  }

  const NFTshow = () => {
    if (!imageUrl == '') {

      return (
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              1
            </Typography>
            <CardMedia
              component="img"
              image={imageUrl}
              alt="Paella dish"
            />
          </CardContent>
          <CardActions>
            After unreveal timestamp, image is displayed
          </CardActions>
        </Card>
      )
    }
  }


  return (

    <Container maxWidth="sm">

      <span style={{ color: "#fafaff", fontWeight: "700", fontSize: "16pt" }}> {collection} / {minter}</span>
      <Box
        sx={{
          borderRadius: "2vh",
          marginTop: "10vh",

          paddingBottom: "3vh",
          backgroundColor: '#0c2f75',

        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <Button variant="contained" onClick={connectWalletHandler} style={{ backgroundColor: "#734de3", float: "right", borderRadius: "2vh" }}>
              Connect Wallet
            </Button>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={5}>
            <span style={{ float: 'left', color: "#bebec2", fontWeight: "600", fontSize: "22pt" }}>NFT Price:</span>
          </Grid>
          <Grid item xs={5} >
            <span style={{ float: 'right', color: "#fafaff", fontWeight: "800", fontSize: "22pt" }}> {NFTPrice} MATIC</span>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={4}>
            <Button disabled={MintState} variant="contained" onClick={mintNftHandler} style={{ backgroundColor: "#b5f5e8", color: "#35ab93", float: "left", borderRadius: "2vh", fontSize: "15pt" }}>
              Mint
            </Button>
          </Grid>
          <Grid item xs={6}>
            {MintState ? NFTshow() : <div></div>}

          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
    </Container>


  );
}

export default App;

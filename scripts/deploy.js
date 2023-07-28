const { ethers } = require("hardhat");
const { yellow, cyan } = require("colors");

const { deployContract, verifyContract } = require("./utils");
const { utils } = require("ethers");

const baseURI = "https://tan-premier-koala-578.mypinata.cloud/ipfs/QmNrXQyJ2ayvVNC63DrACnnCaQWnmLg7BRo91oAA9AGmQ9/";
const unrevealedURI =
  "https://tan-premier-koala-578.mypinata.cloud/ipfs/Qmdk3kecvBCAJi6pRNq2GZJMtVc85F6TjjYTCkUnwxTdMA//1.json";

const maxSupply = 100;
const revealAt = Number(Math.floor(new Date() / 1000) + 3600 * 10);
const price = 0.01;

function fromEth(num) {
  return utils.parseEther(num.toString());
}

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("\nDeploying Contracts\n".yellow);
  const collection = await deployContract(deployer, "Collection", [baseURI, unrevealedURI, maxSupply, revealAt]);
  console.log("Collection Deployed: ", collection.address);

  const nftMinter = await deployContract(deployer, "NFTMinter", [collection.address, fromEth(price)]);

  console.log("NFTMinter deployed: ", nftMinter.address);

  await collection.transferOwnership(nftMinter.address);
}

main();

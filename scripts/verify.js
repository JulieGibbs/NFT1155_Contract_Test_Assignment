const { verifyContract } = require("./utils");

const { utils } = require("ethers");
function fromEth(num) {
  return utils.parseEther(num.toString());
}
const baseURI = "https://tan-premier-koala-578.mypinata.cloud/ipfs/QmNrXQyJ2ayvVNC63DrACnnCaQWnmLg7BRo91oAA9AGmQ9/";
const unrevealedURI =
  "https://tan-premier-koala-578.mypinata.cloud/ipfs/Qmdk3kecvBCAJi6pRNq2GZJMtVc85F6TjjYTCkUnwxTdMA//1.json";

const maxSupply = 100;
const revealAt = Number(Math.floor(new Date() / 1000) + 3600 * 10);
const price = 0.01;

const main = async () => {
  const collection = "0x99BCd8Bb4fB718c03F74a031AED2673573B32e63";

  const nftMinter = "0xc888daF80097B150f5dEA2735b266294B19CEA8E";

  await verifyContract(collection, [baseURI, unrevealedURI, maxSupply, revealAt]);
  await verifyContract(nftMinter, [collection, fromEth(price)]);
};

main();

const { ethers, network, waffle } = require("hardhat");
const { expect } = require("chai");
const colors = require("colors");
const { utils } = require("ethers");

function toEth(num) {
  return utils.formatEther(num);
}

function fromEth(num) {
  return utils.parseEther(num.toString());
}

const baseURI = "https://myfilestorage/baseURI/";
const unrevealedURI = "https://myfilestroage/unrevealed";
const revealAt = Number(Math.floor(new Date() / 1000) + 3600 * 24 * 10); // After 10 days
const maxSupply = 1000;
const price = 0.1;

let collection, nftMinter;

describe("NFT Minting test", async () => {
  before(async () => {
    [deployer, alice, bob, carol, david, evan, fiona, treasury] = await ethers.getSigners();

    // Deploy Collection
    console.log("Deploying Collection".green);
    const Collection = await ethers.getContractFactory("Collection");
    collection = await Collection.deploy(baseURI, unrevealedURI, maxSupply, revealAt);
    console.log(`Collection deployed at: ${collection.address}\n`);

    // Deploy NFT Minter contract
    console.log("Deploying NFT Minter".green);
    const NFTMinter = await ethers.getContractFactory("NFTMinter");
    nftMinter = await NFTMinter.deploy(collection.address, fromEth(price));
    console.log(`NFTMinter deployed at: ${nftMinter.address}\n`);

    // Transfer ownership to NFT minter
    await collection.transferOwnership(nftMinter.address);
  });

  it("Get Max Supply of collection", async () => {
    const collectionMaxSupply = await collection._maxSupply();
    expect(collectionMaxSupply).to.equal(maxSupply);
  });

  it("Get owner address of Collection", async () => {
    expect(await collection.owner()).to.equal(nftMinter.address);
  });

  it("Mint NFT, tokenURI will be unrevealed one", async () => {
    const id = 1;
    await nftMinter.connect(alice).mint(alice.address, id, { value: fromEth(price) });

    const tokenURI = await collection.tokenURI(id);

    expect(tokenURI).to.equal(unrevealedURI);
  });

  it("NFT Minter balance shoule be the same as price", async () => {
    const bal = await waffle.provider.getBalance(nftMinter.address);
    expect(bal).to.equal(fromEth(price));
  });

  it("Mint NFT will be failed, since alrd minted ID", async () => {
    const dupID = 1;
    await expect(nftMinter.connect(bob).mint(bob.address, dupID, { value: fromEth(price) })).to.revertedWith(
      "ALREADY_MINTED_TOKENID"
    );
  });

  it("Mint NFT will be failed, since one account can only mint one NFT", async () => {
    const id = 2;
    await expect(nftMinter.connect(bob).mint(alice.address, id, { value: fromEth(price) })).to.revertedWith(
      "ALREADY_MINTED_ACCOUNT"
    );
  });

  it("Withdraw Eth to alice address", async () => {
    const aliceBalBefore = await waffle.provider.getBalance(alice.address);
    await nftMinter.withdraw(alice.address);
    const aliceBalAfter = await waffle.provider.getBalance(alice.address);

    expect(aliceBalAfter.sub(aliceBalBefore)).to.equal(fromEth(0.1));
  });

  it("Proceed 10 days", async () => {
    await network.provider.send("evm_increaseTime", [3600 * 24 * 10]);
    await network.provider.send("evm_mine");
  });

  it("Reveal Test after 10 days", async () => {
    const id = 1;
    const tokenURI = await collection.tokenURI(id);
    console.log("TOken: ", tokenURI);
    expect(tokenURI).to.equal(`${baseURI}${id}.json`);
  });
});

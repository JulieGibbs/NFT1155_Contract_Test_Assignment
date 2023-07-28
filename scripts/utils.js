const { ethers, run, upgrades } = require("hardhat");
const colors = require("colors");

exports.deployContract = async function (deployer, contractName, params) {
  console.log(`Deploying ${contractName}`.green);
  const Contract = await ethers.getContractFactory(contractName, {
    signer: deployer,
  });
  const contract = await Contract.deploy(...params);
  console.log(`${contractName} deployed at: ${contract.address}\n`);

  await contract.deployed();

  return contract;
};

exports.verifyContract = async function (contract, params) {
  try {
    // Verify
    console.log("Verifying: ", contract);
    await run("verify:verify", {
      address: contract,
      constructorArguments: params,
    });
  } catch (error) {
    if (error && error.message.includes("Reason: Already Verified")) {
      console.log("Already verified, skipping...");
    } else {
      console.error(error);
    }
  }
};

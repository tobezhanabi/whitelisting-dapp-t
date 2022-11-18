const { ethers } = require("hardhat");
async function main() {
  const whitelistContract = await ethers.getContractFactory("Whitelist");
  const deployedWhitelistContract = await whitelistContract.deploy(10);
  console.log("______________________");
  console.log("deploying...");
  await deployedWhitelistContract.deployed();
  console.log("whitelist contract address", deployedWhitelistContract.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

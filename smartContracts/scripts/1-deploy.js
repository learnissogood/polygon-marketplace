const main = async () => {
  const marketContractFactory = await hre.ethers.getContractFactory('Market');
  const marketContract = await marketContractFactory.deploy();
  await marketContract.deployed();
  console.log('marketContractAddress: ', marketContract.address);

  const NFTContractFactory = await hre.ethers.getContractFactory('NFT');
  const NFTContract = await NFTContractFactory.deploy(marketContract.address);
  await NFTContract.deployed();
  console.log('NFTContractAddress: ', NFTContract.address);

}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();

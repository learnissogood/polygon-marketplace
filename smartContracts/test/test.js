const { expect, assert } = require("chai");

describe("NFT", function () {

  let deployer, addr1, addr2, nft, market;

  before(async () => {

    const NFT = await hre.ethers.getContractFactory("NFT");
    const Market = await hre.ethers.getContractFactory("Market");

    [deployer, addr1, addr2] = await hre.ethers.getSigners();

    market = await Market.deploy();
    const marketAddress = await market.address;

    nft = await NFT.deploy(marketAddress);

  })
  
  describe('deployment', async () => {

    it('Market contract is deployed succesfully', async () => {
      const addressMarket = await market.address;
      assert.notEqual(addressMarket, '');
    });

    it('NFT contract is deployed succesfully', async () => {
      const addressNFT = await nft.address;
      assert.notEqual(addressNFT, '');
    });
  })

  describe('creating token', async () => {

    it('NFT contract creates a new token', async () => {
      await nft.createToken('htpps://ipfs.imageaddress1');
      const tokenURI = await nft.tokenURI(1);
      assert.equal(tokenURI, 'htpps://ipfs.imageaddress1');
    });

    it('NFT contract should create an ERC721 contract with name "NFT Marketplace"', async () => {
      const tokenName = await nft.name();
      assert.equal(tokenName, 'NFT Marketplace');
    })

    it('NFT contract should create an ERC721 contract with symbol "NMP"', async () => {
      const tokenSymbol = await nft.symbol();
      assert.equal(tokenSymbol, 'NMP');
    })
  })

  describe('Marketplace Contract', async () => {
    
    let listingPrice;

    beforeEach(async () => {
      await nft.createToken('htpps://ipfs.imageaddress1');
      listingPrice = await market.listingPrice();
    })

    it('listingPrice sould be equal to 0.05 ether', async () => {
      let formatedListingPrice = hre.ethers.utils.formatEther(listingPrice);
      console.log(formatedListingPrice);
      assert.equal(formatedListingPrice, 0.05);
    })

    it('NFT Marketplace should create a new item', async () => {
      let price = hre.ethers.utils.parseEther('5');

      await market.createMarketItem(nft.address, 1, price, { value: listingPrice });
      const items = await market.fetchMarketItems();

      console.log('item: ', items);
    })
  })
});

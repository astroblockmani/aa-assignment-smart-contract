require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY = "rpUA8LPIjYPbEDI23O5ZKeYdiWucHx_J";

const GOERLI_PRIVATE_KEY = "3d5bed6a7c5ef98a6963b2bd5b25f5b60ff07cb4d5c17baa93a2f8a5ed2de702";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};

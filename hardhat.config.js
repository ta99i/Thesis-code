require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ganache");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",

  networks: {
    mganache: { url: "http://172.25.240.1:7545/" },
    localhost: {
      mining: {
        mempool: {
          order: "fifo",
        },
      },
    },
  },
};

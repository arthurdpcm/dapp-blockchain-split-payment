  require("@nomicfoundation/hardhat-toolbox");
  require("hardhat-coverage");

  /** @type import('hardhat/config').HardhatUserConfig */
  module.exports = {
    networks: {
      hardhat: {
        forking: {
          url: process.env.ANVIL_URL || "http://127.0.0.1:8545",
          enabled: true,
          blockNumber: 73380550, // get from the anvil fork logs
        },
      },
      anvil: {
        url: 'http://127.0.0.1:8545',
        // chainId: 137, 
      },
    },
    solidity:{
      compilers: [
        {
          version: "0.8.28",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        }
      ],
      
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    }
  };

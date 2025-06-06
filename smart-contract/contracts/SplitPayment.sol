// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract SplitPayment {
  address public owner;
  address public taxWallet;
  address[] public brlStablecoins;
  uint256 public taxPercentage = 35; // 3,5%

  /**
   * @dev Constructor for the SplitPayment contract
   * @param _taxWallet The address of the tax wallet
   * @param _brlStablecoins The addresses of the BRL stablecoins
   */
  constructor(address _taxWallet, address[] memory _brlStablecoins) {
    owner = msg.sender;
    taxWallet = _taxWallet;
    brlStablecoins = _brlStablecoins;
  }

  /**
   * @dev Event emitted when a payment is split
   * @param recipient The address of the recipient
   * @param amount The amount of the payment
   * @param taxAmount The amount of the tax
   */
  event PaymentSplit(address indexed recipient, uint256 amount, uint256 taxAmount);
 
  /**
   * @dev Modifier to ensure only the owner can call a function
   */
  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can call this function.");
    _;
  }

  /**
   * @dev Function to split a payment between the tax wallet and the recipient
   * @param _recipient The address of the recipient
   * @param _amount The amount of the payment
   */
  function splitPayment(address _recipient, uint256 _amount) public {
    require(_amount > 0, "Amount must be greater than 0");
    require(_recipient != address(0), "Invalid recipient address");

    uint256 taxAmount = (_amount * (taxPercentage/10)) / 100;
    uint256 netAmount = _amount - taxAmount;

    payable(taxWallet).transfer(taxAmount);
    payable(_recipient).transfer(netAmount);

    emit PaymentSplit(_recipient, _amount, taxAmount);
  }

  /**
   * @dev Function to check if an address is a BRL stablecoin
   * @param _stablecoinAddress The address to check
   * @return true if the address is a BRL stablecoin, false otherwise
   */
  function isBrlStablecoin(address _stablecoinAddress) public view returns (bool) {
    for (uint256 i = 0; i < brlStablecoins.length; i++) {
      if (brlStablecoins[i] == _stablecoinAddress) {
        return true;
      }
    }
    return false;
  }

  /**
   * @dev Sets the tax wallet address
   * @param _taxWallet The address of the tax wallet
   * @notice This function is only callable by the owner of the contract
   */

  function setTaxWallet(address _taxWallet) public onlyOwner {
    taxWallet = _taxWallet;
  }

  /**
   * @dev Adds a stablecoin to the list of stablecoins
   * @param _brlStablecoin The address of the stablecoin to add
   * @notice This function is only callable by the owner of the contract
   */

  function addStablecoin(address _brlStablecoin) public onlyOwner{
      brlStablecoins.push(_brlStablecoin);
  }

  /**
   * @dev Removes a stablecoin from the list of stablecoins
   * @param _brlStablecoin The address of the stablecoin to remove
   * @notice This function is only callable by the owner of the contract
   */

  function removeStablecoin(address _brlStablecoin) public onlyOwner {
      for (uint256 i = 0; i < brlStablecoins.length; i++) {
          if (brlStablecoins[i] == _brlStablecoin) {
              brlStablecoins[i] = brlStablecoins[brlStablecoins.length - 1];
              brlStablecoins.pop();
              break;
          }
      } 
      // stablecoin not found in list
      revert("Stablecoin not found in list");
  }
  
}

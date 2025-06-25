// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.26;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// Import the Mocked Router
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract SplitPayment {
  using SafeERC20 for IERC20;

  address public owner;
  address public taxWallet;
  address[] public validStablecoins;
  uint256 public taxPercentage = 35; // 3,5%

  /**
   * @dev Constructor for the SplitPayment contract
   * @param _taxWallet The address of the tax wallet
   * @param _validStablecoins The addresses of the valid stablecoins
   */
  constructor(address _taxWallet, address[] memory _validStablecoins) {
    owner = msg.sender;
    taxWallet = _taxWallet;
    validStablecoins = _validStablecoins;
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
   * @dev Function to check if an address is a valid stablecoin
   * @param _stablecoinAddress The address to check
   * @return true if the address is a valid stablecoin, false otherwise
   */
  function isValidStablecoin(address _stablecoinAddress) public view returns (bool) {
    for (uint256 i = 0; i < validStablecoins.length; i++) {
      if (validStablecoins[i] == _stablecoinAddress) {
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

  function setTaxPercentage(uint256 _taxPercentage) public onlyOwner {
    require(_taxPercentage <= 1000, "Tax percentage cannot be greater than 1000 (100%)");
    taxPercentage = _taxPercentage;
  }

  /**
   * @dev Adds a stablecoin to the list of stablecoins
   * @param _validStablecoin The address of the stablecoin to add
   * @notice This function is only callable by the owner of the contract
   */

  function addValidStablecoin(address _validStablecoin) public onlyOwner{
    require(_validStablecoin != address(0), "Stablecoin address cannot be zero");
    require(!isValidStablecoin(_validStablecoin), "Stablecoin already exists in the list");
      validStablecoins.push(_validStablecoin);
  }

  /**
   * @dev Removes a stablecoin from the list of stablecoins
   * @param _validStablecoin The address of the stablecoin to remove
   * @notice This function is only callable by the owner of the contract
   */

  function removeValidStablecoin(address _validStablecoin) public onlyOwner {
      bool found = false;
      for (uint256 i = 0; i < validStablecoins.length; i++) {
          if (validStablecoins[i] == _validStablecoin) {
              validStablecoins[i] = validStablecoins[validStablecoins.length - 1];
              validStablecoins.pop();
              found = true;
              break;
          }
      }
      require(found, "Stablecoin not found in list");
  }
  /**
   * @dev Split payment, retain tax, then swap net amount and send to recipient
   * @param tokenIn Address of the input token (ERC20)
   * @param amountIn Amount of input token
   * @param tokenOut Address of the output token (ERC20)
   * @param recipient Address to receive the swapped tokens
   * @param feeTier Uniswap V3 fee tier (e.g., 3000 for 0.3%)
   * @param uniswapRouter Address of the Uniswap V2 router contract
   */
  function splitAndSwapPayment(
      address tokenIn,
      uint256 amountIn,
      address tokenOut,
      address recipient,
      uint24 feeTier, // Uniswap V3 fee tier, e.g., 3000 for 0.3%
      // uint256 amountOutMin,
      // address[] calldata path,
      // uint256 deadline,
      address uniswapRouter
  ) external returns (uint256 amountOut){
      require(amountIn > 0, "Amount must be greater than 0");
      require(recipient != address(0), "Recipient address cannot be the zero address");
      require(tokenIn != address(0) && tokenOut != address(0), "Token address cannot be the zero address");
      require(uniswapRouter != address(0), "Uniswap router cannot be the zero address");

      // Check if tokenIn is a valid stablecoin
      require(isValidStablecoin(tokenIn), "Token is not a valid stablecoin");
      // Transfer tokens from sender to contract
      TransferHelper.safeTransferFrom(
          tokenIn,
          msg.sender,
          address(this),
          amountIn
      );
      // require(IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn), "Transfer failed");

      // Calculate tax and net amount
      uint256 taxAmount = (amountIn * taxPercentage) / 1000;
      uint256 netAmount = amountIn - taxAmount;
      // Send tax to taxWallet
      TransferHelper.safeTransfer(tokenIn, taxWallet, taxAmount);
      // require(IERC20(tokenIn).transfer(taxWallet, taxAmount), "Tax transfer failed");

      TransferHelper.safeApprove(tokenIn, uniswapRouter, netAmount);
      // Approve Uniswap router to spend netAmount
      // require(IERC20(tokenIn).approve(uniswapRouter, netAmount), "Approve failed");

      // Swap netAmount via Uniswap
      ISwapRouter router = ISwapRouter(uniswapRouter);
      // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
      // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
      ISwapRouter.ExactInputSingleParams memory params =
          ISwapRouter.ExactInputSingleParams({
              tokenIn: tokenIn,
              tokenOut: tokenOut,
              fee: feeTier,
              recipient: recipient,
              deadline: block.timestamp + 300,
              amountIn: netAmount,
              amountOutMinimum: 0,
              sqrtPriceLimitX96: 0
          });
      amountOut = router.exactInputSingle(params);
      emit PaymentSplit(recipient, amountIn, taxAmount);
  }
}

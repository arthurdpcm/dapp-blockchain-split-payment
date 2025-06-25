const { expect } = require("chai");
const { ethers, network } = require("hardhat");
// Importe os helpers de rede do Hardhat
const { impersonateAccount, stopImpersonatingAccount, setBalance } = require("@nomicfoundation/hardhat-network-helpers");

describe("SplitPayment", function () {
    let owner, taxWallet, user, recipient, other;
    let splitPayment;
    let usdc, eure;
    let whaleSigner; // Não precisaremos mais deste se usarmos setBalance

    const taxPercent = 35; // 3.5%

    const uniswapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

    // Tokens
    const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Endereço do USDC na Polygon
    const EURE_ADDRESS = "0x18ec0A6E18E5bc3784fDd3a3634b31245ab704F6"; // Endereço do EURA na Polygon

    // Você não precisará mais do EURE_WHALE para simular saldos, usaremos setBalance
    // const EURE_WHALE = "0xBA12222222228d8Ba445958a75a0704d566BF2C8"; 

    const fee = 3000; // 0.3%

    before(async function () {
        [owner, taxWallet, user, recipient, other] = await ethers.getSigners();

        usdc = await ethers.getContractAt("Token", USDC_ADDRESS);
        eure = await ethers.getContractAt("Token", EURE_ADDRESS);

        const EURE_WHALE = "0xBA12222222228d8Ba445958a75a0704d566BF2C8"; 

        await impersonateAccount(EURE_WHALE);
        whaleSigner = await ethers.getSigner(EURE_WHALE); 

        const transferAmount = ethers.parseUnits("1", 18); 
        await eure.connect(whaleSigner).transfer(user.address, transferAmount);
        await eure.connect(whaleSigner).transfer(owner.address, transferAmount);
 
        await stopImpersonatingAccount(EURE_WHALE);
    });

    beforeEach(async function () {
        const SplitPayment = await ethers.getContractFactory("SplitPayment");
        splitPayment = await SplitPayment.deploy(
            taxWallet.address,
            [EURE_ADDRESS]
        );
        await splitPayment.waitForDeployment();
    });
    describe("Deployment", function () {
        it("should deploy successfully", async function () {
            expect(await splitPayment.taxWallet()).to.equal(taxWallet.address);
            expect(await splitPayment.isValidStablecoin(EURE_ADDRESS)).to.be.true;
        });

        it("should have the correct owner", async function () {
            expect(await splitPayment.owner()).to.equal(owner.address);
        });
    });

    describe("splitAndSwapPayment", function () {
        it("should split and swap EURE -> USDC", async function () {

            const amountIn = ethers.parseUnits("1", 18);

            const taxAmount = amountIn * BigInt(taxPercent) / BigInt(1000);
            const netAmount = amountIn - taxAmount;

            await eure.connect(user).approve(splitPayment.target, amountIn);

            const taxWalletInitial = await eure.balanceOf(taxWallet.address);
            const recipientInitial = await usdc.balanceOf(recipient.address);

            await expect(
                splitPayment.connect(user).splitAndSwapPayment(
                    EURE_ADDRESS,
                    amountIn,
                    USDC_ADDRESS,
                    recipient.address,
                    fee,
                    uniswapRouter
                )
            ).to.emit(splitPayment, "PaymentSplit");
            const taxWalletFinal = await eure.balanceOf(taxWallet.address);
            const recipientFinal = await usdc.balanceOf(recipient.address);

            expect(taxWalletFinal - taxWalletInitial).to.equal(taxAmount);
            expect(recipientFinal).to.be.gt(recipientInitial);
        });

        it('should revert if tokenIn is zero address', async function () {
            const amountIn = ethers.parseUnits("1", 6);
            await expect(
                splitPayment.connect(user).splitAndSwapPayment(
                    ethers.ZeroAddress,
                    amountIn,
                    EURE_ADDRESS,
                    recipient.address,
                    fee,
                    uniswapRouter
                )
            ).to.be.revertedWith("Token address cannot be the zero address");
        });

        it('should revert if amount is zero', async function () {
            await expect(
                splitPayment.connect(user).splitAndSwapPayment(
                    EURE_ADDRESS,
                    0,
                    USDC_ADDRESS,
                    recipient.address,
                    fee,
                    uniswapRouter
                )
            ).to.be.revertedWith("Amount must be greater than 0");
        });

        it('should revert if recipient address is zero address', async function () {
            const amountIn = ethers.parseUnits("1", 6);
            await expect(
                splitPayment.connect(user).splitAndSwapPayment(
                    EURE_ADDRESS,
                    amountIn,
                    USDC_ADDRESS,
                    ethers.ZeroAddress,
                    fee,
                    uniswapRouter
                )
            ).to.be.revertedWith("Recipient address cannot be the zero address");
        });

        it('should revert if Uniswap router is zero address', async function () {
            const amountIn = ethers.parseUnits("1", 6);
            await expect(
                splitPayment.connect(user).splitAndSwapPayment(
                    EURE_ADDRESS,
                    amountIn,
                    USDC_ADDRESS,
                    recipient.address,
                    fee,
                    ethers.ZeroAddress
                )
            ).to.be.revertedWith("Uniswap router cannot be the zero address");
        });

        it("should revert if tokenIn is not a valid stablecoin", async function () {
            const amountIn = ethers.parseUnits("1", 6);
            const nonStablecoinAddress = "0x0000000000000000000000000000000000000001";

            await expect(
                splitPayment.connect(user).splitAndSwapPayment(
                    nonStablecoinAddress,
                    amountIn,
                    EURE_ADDRESS,
                    recipient.address,
                    fee,
                    uniswapRouter
                )
            ).to.be.revertedWith("Token is not a valid stablecoin");
        });
    });

    describe("Stablecoin management", function () {
        it("should add and remove stablecoins only by owner", async function () {
            await expect(
                splitPayment.connect(user).addValidStablecoin(user.address)
            ).to.be.revertedWith("Only the owner can call this function.");

            await expect(
                splitPayment.connect(owner).addValidStablecoin(user.address)
            ).to.not.be.reverted;

            expect(await splitPayment.isValidStablecoin(user.address)).to.equal(true);

            await expect(
                splitPayment.connect(owner).removeValidStablecoin(user.address)
            ).to.not.be.reverted;

            await expect(
                splitPayment.connect(user).removeValidStablecoin(user.address)
            ).to.be.revertedWith("Only the owner can call this function.");

            expect(await splitPayment.isValidStablecoin(user.address)).to.equal(false);
        });

        it("should revert when removing a stablecoin not in the list", async function () {
            await expect(
                splitPayment.removeValidStablecoin(user.address)
            ).to.be.revertedWith("Stablecoin not found in list");
        });

        it("should not allow adding the same stablecoin twice", async function () {
            await expect(
                splitPayment.addValidStablecoin(user.address)
            ).to.not.be.reverted;

            await expect(
                splitPayment.addValidStablecoin(user.address)
            ).to.be.revertedWith("Stablecoin already exists in the list");

            await expect(
                splitPayment.removeValidStablecoin(user.address)
            ).to.not.be.reverted;
        });
    });

    describe("setTaxWallet", function () {
        it("should allow only owner to set tax wallet", async function () {
            await expect(
                splitPayment.connect(user).setTaxWallet(other.address)
            ).to.be.revertedWith("Only the owner can call this function.");

            await expect(
                splitPayment.setTaxWallet(other.address)
            ).to.not.be.reverted;

            expect(await splitPayment.taxWallet()).to.equal(other.address);
        });
    });

    describe("setTaxPercentage", function () {
        it("should allow only owner to set tax percentage", async function () {
            await expect(
                splitPayment.connect(user).setTaxPercentage(50)
            ).to.be.revertedWith("Only the owner can call this function.");

            await expect(
                splitPayment.setTaxPercentage(50)
            ).to.not.be.reverted;

            expect(await splitPayment.taxPercentage()).to.equal(50);
        });

        it("should revert if tax percentage is greater than 1000", async function () {
            await expect(
                splitPayment.setTaxPercentage(1200)
            ).to.be.revertedWith("Tax percentage cannot be greater than 1000 (100%)");
        });
    });

    describe("isValidStablecoin", function () {
        it("should return true if stablecoin is in the list", async function () {
            expect(await splitPayment.isValidStablecoin(EURE_ADDRESS)).to.equal(true);
        });

        it("should return false if stablecoin is NOT in the list", async function () {
            await splitPayment.removeValidStablecoin(EURE_ADDRESS);
            expect(await splitPayment.isValidStablecoin(EURE_ADDRESS)).to.equal(false);
        });
    });
    
    describe("getValidStablecoins", function () {
        it("should return the list of valid stablecoins", async function () {
            const stablecoins = await splitPayment.getValidStablecoins();
            expect(stablecoins.length).to.be.greaterThan(0);
            expect(stablecoins).to.include(EURE_ADDRESS);
        });

        it("should return an empty array if no stablecoins are valid", async function () {
            await splitPayment.removeValidStablecoin(EURE_ADDRESS);
            const stablecoins = await splitPayment.getValidStablecoins();
            expect(stablecoins.length).to.equal(0);
        });
    });
});

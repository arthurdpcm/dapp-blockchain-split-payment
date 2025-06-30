const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
    let token, owner, addr1, addr2;
    const initialSupply = ethers.parseUnits("1000", 18);
    const name = "TestToken";
    const symbol = "TTK";

    beforeEach(async function () {
        [owner, _, _, addr1, addr2] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(name, symbol, initialSupply);
        await token.waitForDeployment();
    });

    it("should have correct name and symbol", async function () {
        expect(await token.name()).to.equal(name);
        expect(await token.symbol()).to.equal(symbol);
    });

    it("should assign the initial supply to the owner", async function () {
        expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
    });

    it("should transfer tokens between accounts", async function () {
        await token.transfer(addr1.address, 100);
        expect(await token.balanceOf(addr1.address)).to.equal(100);
    });

    it("should approve and transferFrom correctly", async function () {
        await token.approve(addr1.address, 200);
        await token.connect(addr1).transferFrom(owner.address, addr2.address, 200);
        expect(await token.balanceOf(addr2.address)).to.equal(200);
    });

    it("should emit Transfer event on transfers", async function () {
        await expect(token.transfer(addr1.address, 50))
            .to.emit(token, "Transfer")
            .withArgs(owner.address, addr1.address, 50);
    });

    it("should emit Approval event on approve", async function () {
        await expect(token.approve(addr1.address, 123))
            .to.emit(token, "Approval")
            .withArgs(owner.address, addr1.address, 123);
    });
});

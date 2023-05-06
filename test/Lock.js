const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const [owner, otherAccount, t] = await ethers.getSigners();

    const Main = await ethers.getContractFactory("Main");
    const main = await Main.deploy();

    return { main, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should add and check if Temporary Certificate exist", async function () {
      const { main, owner, otherAccount } = await loadFixture(deploy);
      let vin = "123";
      expect(await main.isTemporaryCertificateExist(vin)).to.equal(0);
    });
    it("Should add and check if Temporary Certificate exist", async function () {
      const { main, owner, otherAccount } = await loadFixture(deploy);
      let vin = "123";
      await main.addRegisterCertificate(vin, 1, [otherAccount.address]);
      expect(await main.isTemporaryCertificateExist(vin)).to.equal(1);
    });
    it("Should add with 1 signer and check if Certificate pending", async function () {
      const { main, owner, otherAccount } = await loadFixture(deploy);
      let vin = "123";
      await main.addRegisterCertificate(vin, 1, [otherAccount.address]);
      await main
        .connect(otherAccount)
        .SigntemporaryRegisterCertificates(0, vin);

      expect(await main.isCertificateExist(vin)).to.equal(2);
    });
    it("Should be Pending when signed with one", async function () {
      const { main, owner, otherAccount } = await loadFixture(deploy);
      let vin = "123";
      await main.addRegisterCertificate(vin, 2, [
        owner.address,
        otherAccount.address,
      ]);
      await main.SigntemporaryRegisterCertificates(0, vin);

      expect(await main.isCertificateExist(vin)).to.equal(0);
    });
    it("Should be Accepted when signed with one when signed by all signers", async function () {
      const { main, owner, otherAccount } = await loadFixture(deploy);
      let vin = "123";
      await main.addRegisterCertificate(vin, 2, [
        owner.address,
        otherAccount.address,
      ]);
      await main.SigntemporaryRegisterCertificates(0, vin);
      await main
        .connect(otherAccount)
        .SigntemporaryRegisterCertificates(1, vin);
      expect(await main.isCertificateExist(vin)).to.equal(2);
    });
  });
});

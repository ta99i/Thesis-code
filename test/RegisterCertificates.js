const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("RegisterCertificates", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const [owner, otherAccount, t] = await ethers.getSigners();

    const RegisterCertificates = await ethers.getContractFactory(
      "RegisterCertificates"
    );
    const registerCertificates = await RegisterCertificates.deploy();

    return { registerCertificates, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should add and check if Temporary Certificate exist", async function () {
      const { registerCertificates, owner, otherAccount } = await loadFixture(
        deploy
      );
      let vin = "123";
      expect(
        await registerCertificates.isTemporaryCertificateExist(vin)
      ).to.equal(0);
    });
    it("Should add and check if Temporary Certificate exist", async function () {
      const { registerCertificates, owner, otherAccount } = await loadFixture(
        deploy
      );
      let vin = "123";
      await registerCertificates.addRegisterCertificate(vin, 1, [
        otherAccount.address,
      ]);
      expect(
        await registerCertificates.isTemporaryCertificateExist(vin)
      ).to.equal(1);
    });
    it("Should add with 1 signer and check if Certificate pending", async function () {
      const { registerCertificates, owner, otherAccount } = await loadFixture(
        deploy
      );
      let vin = "123";
      await registerCertificates.addRegisterCertificate(vin, 1, [
        otherAccount.address,
      ]);
      await registerCertificates
        .connect(otherAccount)
        .SigntemporaryRegisterCertificates(0, vin);

      expect(await registerCertificates.isCertificateExist(vin)).to.equal(2);
    });
    it("Should be Pending when signed with one", async function () {
      const { registerCertificates, owner, otherAccount } = await loadFixture(
        deploy
      );
      let vin = "123";
      await registerCertificates.addRegisterCertificate(vin, 2, [
        owner.address,
        otherAccount.address,
      ]);
      await registerCertificates.SigntemporaryRegisterCertificates(0, vin);

      expect(await registerCertificates.isCertificateExist(vin)).to.equal(0);
    });
    it("Should be Accepted when signed with one when signed by all signers", async function () {
      const { registerCertificates, owner, otherAccount } = await loadFixture(
        deploy
      );
      let vin = "123";
      await registerCertificates.addRegisterCertificate(vin, 2, [
        owner.address,
        otherAccount.address,
      ]);
      await registerCertificates.SigntemporaryRegisterCertificates(0, vin);
      await registerCertificates
        .connect(otherAccount)
        .SigntemporaryRegisterCertificates(1, vin);
      expect(await registerCertificates.isCertificateExist(vin)).to.equal(2);
    });
  });
});

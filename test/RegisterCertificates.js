const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");
const HashAcceptedMessage = (id, vin, vrp, uri, oldOwner, newOwner) => {
  const encodePackedpacked = ethers.utils.solidityPack(
    ["uint256", "string", "string", "string", "string", "string"],
    [id, vin, vrp, uri, oldOwner, newOwner]
  );
  const hash = ethers.utils.keccak256(encodePackedpacked);
  return hash;
};
const HashDeclinedMessage = (id) => {
  const encodePackedpacked = ethers.utils.solidityPack(
    ["uint256", "string"],
    [id, "Declined"]
  );
  const hash = ethers.utils.keccak256(encodePackedpacked);
  return hash;
};
const SignMessage = async (hash, account) => {
  const signMessage = await account.signMessage(ethers.utils.arrayify(hash));
  return signMessage;
};
describe("RegisterCertificates", function () {
  async function deploy() {
    const [government, employer, state, police, djondarm, tax] =
      await ethers.getSigners();

    const RegisterCertificates = await ethers.getContractFactory(
      "RegisterCertificates"
    );
    const registerCertificates = await RegisterCertificates.deploy();

    return {
      registerCertificates,
      government,
      employer,
      state,
      police,
      djondarm,
      tax,
    };
  }

  describe("Deployment", function () {
    it("Should be Certificate Id Counter 1", async function () {
      const { registerCertificates, employer, otherAccount } =
        await loadFixture(deploy);
      let expected = 1;
      expect(await registerCertificates.currentId()).to.equal(expected);
    });
    it("Should be the deployer an admin ", async function () {
      const { registerCertificates, government } = await loadFixture(deploy);
      let expected = true;
      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32),
          government.address
        )
      ).to.equal(expected);
    });
  });
  describe("Access Controle", function () {
    it("Should be added Police Address", async function () {
      const {
        registerCertificates,
        government,
        employer,
        state,
        police,
        djondarm,
        tax,
      } = await loadFixture(deploy);
      await registerCertificates
        .connect(government)
        .grantRole(
          hre.ethers.utils.formatBytes32String("POLICE"),
          police.address
        );

      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.formatBytes32String("POLICE"),
          police.address
        )
      ).to.equal(true);
    });
  });
  describe("Signin", function () {
    it("Should be the hash methode be the same on smart contract and js", async function () {
      const {
        registerCertificates,
        government,
        employer,
        state,
        police,
        djondarm,
        tax,
      } = await loadFixture(deploy);
      await registerCertificates.mintRegisterCertificate(
        "AA123456789AA",
        "001234-567-89",
        "12346789",
        "DZ132456"
      );
      const temporaryRegisterCertificate =
        await registerCertificates.getTemporaryRegisterCertificates_Others(1);
      const hashed = HashAcceptedMessage(
        temporaryRegisterCertificate.registerCertificateId,
        temporaryRegisterCertificate.vin,
        temporaryRegisterCertificate.vrp,
        temporaryRegisterCertificate.uri,
        temporaryRegisterCertificate.oldOwner,
        temporaryRegisterCertificate.newOwner
      );
      const contractSign = await registerCertificates.getMessageHashAccepted(
        temporaryRegisterCertificate.registerCertificateId,
        temporaryRegisterCertificate.vin,
        temporaryRegisterCertificate.vrp,
        temporaryRegisterCertificate.uri,
        temporaryRegisterCertificate.oldOwner,
        temporaryRegisterCertificate.newOwner
      );
      expect(hashed).to.equal(contractSign);
    });
    it("Should be the signed message can be verify on smart contract for Accepted", async function () {
      const {
        registerCertificates,
        government,
        employer,
        state,
        police,
        djondarm,
        tax,
      } = await loadFixture(deploy);
      await registerCertificates.mintRegisterCertificate(
        "AA123456789AA",
        "001234-567-89",
        "12346789",
        "DZ132456"
      );
      await registerCertificates
        .connect(government)
        .grantRole(
          hre.ethers.utils.formatBytes32String("POLICE"),
          police.address
        );
      const temporaryRegisterCertificate =
        await registerCertificates.getTemporaryRegisterCertificates_Others(1);
      const hashed = HashAcceptedMessage(
        temporaryRegisterCertificate.registerCertificateId,
        temporaryRegisterCertificate.vin,
        temporaryRegisterCertificate.vrp,
        temporaryRegisterCertificate.uri,
        temporaryRegisterCertificate.oldOwner,
        temporaryRegisterCertificate.newOwner
      );
      const messageSigned = await SignMessage(hashed, police);

      await registerCertificates
        .connect(police)
        .PoliceSiging(
          temporaryRegisterCertificate.registerCertificateId,
          messageSigned
        );
      const tce =
        await registerCertificates.getTemporaryRegisterCertificates_States(
          temporaryRegisterCertificate.registerCertificateId
        );
      const resultat = tce.signers[3];
      expect(resultat).to.equal(messageSigned);
      expect(tce.requireSigners).to.equal(5);
    });
    it("Should be the signed message can be verify on smart contract for Declined", async function () {
      const {
        registerCertificates,
        government,
        employer,
        state,
        police,
        djondarm,
        tax,
      } = await loadFixture(deploy);
      await registerCertificates.mintRegisterCertificate(
        "AA123456789AA",
        "001234-567-89",
        "12346789",
        "DZ132456"
      );
      await registerCertificates
        .connect(government)
        .grantRole(
          hre.ethers.utils.formatBytes32String("POLICE"),
          police.address
        );
      const temporaryRegisterCertificate =
        await registerCertificates.getTemporaryRegisterCertificates_Others(1);
      const hashed = HashDeclinedMessage(
        temporaryRegisterCertificate.registerCertificateId
      );
      const messageSigned = await SignMessage(hashed, police);

      await registerCertificates
        .connect(police)
        .PoliceSiging(
          temporaryRegisterCertificate.registerCertificateId,
          messageSigned
        );
      const tce =
        await registerCertificates.getTemporaryRegisterCertificates_States(
          temporaryRegisterCertificate.registerCertificateId
        );
      const resultat = tce.signers[3];
      expect(hre.ethers.utils.toUtf8String(resultat)).to.equal("DECLINED");
    });
    it("Should be the signed message can be verify on smart contract for wrong paramter with error", async function () {
      const {
        registerCertificates,
        government,
        employer,
        state,
        police,
        djondarm,
        tax,
      } = await loadFixture(deploy);
      await registerCertificates.mintRegisterCertificate(
        "AA123456789AA",
        "001234-567-89",
        "12346789",
        "DZ132456"
      );
      await registerCertificates
        .connect(government)
        .grantRole(
          hre.ethers.utils.formatBytes32String("POLICE"),
          police.address
        );
      const temporaryRegisterCertificate =
        await registerCertificates.getTemporaryRegisterCertificates_Others(1);
      const hashed = HashAcceptedMessage(
        temporaryRegisterCertificate.registerCertificateId,
        temporaryRegisterCertificate.vin,
        "error",
        temporaryRegisterCertificate.uri,
        temporaryRegisterCertificate.oldOwner,
        temporaryRegisterCertificate.newOwner
      );
      const messageSigned = await SignMessage(hashed, police);

      const contractSign = await registerCertificates
        .connect(police)
        .PoliceSiging(
          temporaryRegisterCertificate.registerCertificateId,
          messageSigned
        );
      const tce =
        await registerCertificates.getTemporaryRegisterCertificates_States(
          temporaryRegisterCertificate.registerCertificateId
        );
      const resultat = tce.signers[3];
      expect(hre.ethers.utils.toUtf8String(resultat)).to.equal("NOTSIGNED");
    });
  });
});

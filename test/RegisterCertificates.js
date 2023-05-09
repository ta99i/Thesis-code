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
    const [government, employer, state, police, gendarmerie, tax] =
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
      gendarmerie,
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
    it("Should be added all 5 roles", async function () {
      const {
        registerCertificates,
        government,
        employer,
        state,
        police,
        gendarmerie,
        tax,
      } = await loadFixture(deploy);
      await registerCertificates
        .connect(government)
        .grantRole(
          hre.ethers.utils.formatBytes32String("EMPLOYER"),
          employer.address
        );
      await registerCertificates
        .connect(government)
        .grantRole(
          hre.ethers.utils.formatBytes32String("STATE"),
          state.address
        );
      await registerCertificates
        .connect(government)
        .grantRole(
          hre.ethers.utils.formatBytes32String("POLICE"),
          police.address
        );
      await registerCertificates
        .connect(government)
        .grantRole(
          hre.ethers.utils.formatBytes32String("GENDARMERIE"),
          gendarmerie.address
        );
      await registerCertificates
        .connect(government)
        .grantRole(hre.ethers.utils.formatBytes32String("TAX"), tax.address);

      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.formatBytes32String("EMPLOYER"),
          employer.address
        )
      ).to.equal(true);
      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.formatBytes32String("STATE"),
          state.address
        )
      ).to.equal(true);
      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.formatBytes32String("POLICE"),
          police.address
        )
      ).to.equal(true);
      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.formatBytes32String("GENDARMERIE"),
          gendarmerie.address
        )
      ).to.equal(true);
      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.formatBytes32String("TAX"),
          tax.address
        )
      ).to.equal(true);
    });
  });
  describe("Message Hash & Sign", function () {
    describe("Hash", function () {
      let _contract;
      let _signers;
      let _roles = ["EMPLOYER", "STATE", "POLICE", "GENDARMERIE", "TAX"];
      beforeEach(async () => {
        const [employer, state, police, gendarmerie, tax] =
          await ethers.getSigners();

        const RegisterCertificates = await ethers.getContractFactory(
          "RegisterCertificates"
        );
        const registerCertificates = await RegisterCertificates.deploy();

        _contract = registerCertificates;
        _signers = [employer, state, police, gendarmerie, tax];
        await Promise.all(
          _roles.map(async (role, i) => {
            await registerCertificates.grantRole(
              hre.ethers.utils.formatBytes32String(role),
              _signers[i].address
            );
          })
        );
        await registerCertificates.mintRegisterCertificate(
          "AA123456789AA",
          "001234-567-89",
          "12346789",
          "DZ132456"
        );
      });
      it("Should be the hash methode be the same on smart contract and js", async function () {
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates_Others(1);
        const hashed = HashAcceptedMessage(
          temporaryRegisterCertificate.registerCertificateId,
          temporaryRegisterCertificate.vin,
          temporaryRegisterCertificate.vrp,
          temporaryRegisterCertificate.uri,
          temporaryRegisterCertificate.oldOwner,
          temporaryRegisterCertificate.newOwner
        );
        const contractSign = await _contract.getMessageHashAccepted(
          temporaryRegisterCertificate.registerCertificateId,
          temporaryRegisterCertificate.vin,
          temporaryRegisterCertificate.vrp,
          temporaryRegisterCertificate.uri,
          temporaryRegisterCertificate.oldOwner,
          temporaryRegisterCertificate.newOwner
        );
        expect(hashed).to.equal(contractSign);
      });
    });
    describe("Sign", function () {
      let _contract;
      let _signers;
      let _roles = ["EMPLOYER", "STATE", "POLICE", "GENDARMERIE", "TAX"];
      beforeEach(async () => {
        const [employer, state, police, gendarmerie, tax] =
          await ethers.getSigners();

        const RegisterCertificates = await ethers.getContractFactory(
          "RegisterCertificates"
        );
        const registerCertificates = await RegisterCertificates.deploy();

        _contract = registerCertificates;
        _signers = [employer, state, police, gendarmerie, tax];
        await Promise.all(
          _roles.map(async (role, i) => {
            await registerCertificates.grantRole(
              hre.ethers.utils.formatBytes32String(role),
              _signers[i].address
            );
          })
        );
        await registerCertificates.mintRegisterCertificate(
          "AA123456789AA",
          "001234-567-89",
          "12346789",
          "DZ132456"
        );
      });
      it("Should state can sign with ACCEPT", async () => {
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates_Others(1);
        const hashed = HashAcceptedMessage(
          temporaryRegisterCertificate.registerCertificateId,
          temporaryRegisterCertificate.vin,
          temporaryRegisterCertificate.vrp,
          temporaryRegisterCertificate.uri,
          temporaryRegisterCertificate.oldOwner,
          temporaryRegisterCertificate.newOwner
        );
        const signedMsg = await SignMessage(hashed, _signers[1]);
        await _contract
          .connect(_signers[1])
          .Siging(
            temporaryRegisterCertificate.registerCertificateId,
            1,
            hre.ethers.utils.formatBytes32String(_roles[1]),
            signedMsg
          );
        const tce = await _contract.getTemporaryRegisterCertificates_States(
          temporaryRegisterCertificate.registerCertificateId
        );
        const resultatSigner = tce.signers[1];
        const resultatStatus = tce.status[1];
        expect(resultatSigner).to.equal(signedMsg);
        expect(resultatStatus).to.equal(1);
        expect(tce.requireSigners).to.equal(4);
      });
      it("Should state can sign with DECLINED", async () => {
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates_Others(1);
        const hashed = HashDeclinedMessage(
          temporaryRegisterCertificate.registerCertificateId
        );
        const signedMsg = await SignMessage(hashed, _signers[1]);
        await _contract
          .connect(_signers[1])
          .Siging(
            temporaryRegisterCertificate.registerCertificateId,
            1,
            hre.ethers.utils.formatBytes32String(_roles[1]),
            signedMsg
          );
        const tce = await _contract.getTemporaryRegisterCertificates_States(
          temporaryRegisterCertificate.registerCertificateId
        );
        const resultatSigner = tce.signers[1];
        const resultatStatus = tce.status[1];
        expect(hre.ethers.utils.toUtf8String(resultatSigner)).to.equal(
          "DECLINED"
        );
      });
      it("Should state can sign with wrong param", async () => {
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates_Others(1);
        const hashed = HashAcceptedMessage(
          temporaryRegisterCertificate.registerCertificateId,
          temporaryRegisterCertificate.vin,
          "error",
          temporaryRegisterCertificate.uri,
          temporaryRegisterCertificate.oldOwner,
          temporaryRegisterCertificate.newOwner
        );
        const signedMsg = await SignMessage(hashed, _signers[1]);
        await _contract
          .connect(_signers[1])
          .Siging(
            temporaryRegisterCertificate.registerCertificateId,
            1,
            hre.ethers.utils.formatBytes32String(_roles[1]),
            signedMsg
          );
        const tce = await _contract.getTemporaryRegisterCertificates_States(
          temporaryRegisterCertificate.registerCertificateId
        );
        const resultatSigner = tce.signers[1];
        const resultatStatus = tce.status[1];
        expect(hre.ethers.utils.toUtf8String(resultatSigner)).to.equal(
          "NOTSIGNED"
        );
        expect(resultatStatus).to.equal(0);
      });
      it("Should all participants can sign", async function () {
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates_Others(1);
        const hashed = HashAcceptedMessage(
          temporaryRegisterCertificate.registerCertificateId,
          temporaryRegisterCertificate.vin,
          temporaryRegisterCertificate.vrp,
          temporaryRegisterCertificate.uri,
          temporaryRegisterCertificate.oldOwner,
          temporaryRegisterCertificate.newOwner
        );
        let messagesSigned = [];
        await Promise.all(
          _signers.map(async (signer) => {
            const res = await SignMessage(hashed, signer);
            messagesSigned.push(res);
          })
        );
        await Promise.all(
          messagesSigned.map(async (signedMsg, i) => {
            await _contract
              .connect(_signers[i])
              .Siging(
                temporaryRegisterCertificate.registerCertificateId,
                i,
                hre.ethers.utils.formatBytes32String(_roles[i]),
                signedMsg
              );
          })
        );
        const tce = await _contract.getTemporaryRegisterCertificates_States(
          temporaryRegisterCertificate.registerCertificateId
        );
        expect(tce.status[0]).to.equal(1);
        expect(tce.status[1]).to.equal(1);
        expect(tce.status[2]).to.equal(1);
        expect(tce.status[3]).to.equal(1);
        expect(tce.status[4]).to.equal(1);
      });
    });
  });
});

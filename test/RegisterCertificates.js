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
    const [state, employer, police, gendarmerie, tax] =
      await ethers.getSigners();

    const RegisterCertificates = await ethers.getContractFactory(
      "RegisterCertificates"
    );
    const registerCertificates = await RegisterCertificates.deploy();

    return {
      registerCertificates,
      state,
      employer,
      police,
      gendarmerie,
      tax,
    };
  }

  describe("Deployment", function () {
    it("Should be Certificate Id Counter 1", async function () {
      const { registerCertificates, state, employer } = await loadFixture(
        deploy
      );
      let expected = 1;
      expect(await registerCertificates.currentId()).to.equal(expected);
    });
    it("Should be the deployer an admin ", async function () {
      const { registerCertificates, state } = await loadFixture(deploy);
      let expected = true;
      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32),
          state.address
        )
      ).to.equal(expected);
    });
  });
  describe("Access Controle", function () {
    it("Should be added all 5 roles", async function () {
      const {
        registerCertificates,
        employer,
        state,
        police,
        gendarmerie,
        tax,
      } = await loadFixture(deploy);
      await registerCertificates
        .connect(state)
        .grantRole(
          hre.ethers.utils.formatBytes32String("EMPLOYER"),
          employer.address
        );
      await registerCertificates
        .connect(state)
        .grantRole(
          hre.ethers.utils.formatBytes32String("STATES"),
          state.address
        );
      await registerCertificates
        .connect(state)
        .grantRole(
          hre.ethers.utils.formatBytes32String("POLICE"),
          police.address
        );
      await registerCertificates
        .connect(state)
        .grantRole(
          hre.ethers.utils.formatBytes32String("GENDARMERIE"),
          gendarmerie.address
        );
      await registerCertificates
        .connect(state)
        .grantRole(hre.ethers.utils.formatBytes32String("TAX"), tax.address);

      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.formatBytes32String("EMPLOYER"),
          employer.address
        )
      ).to.equal(true);
      expect(
        await registerCertificates.hasRole(
          hre.ethers.utils.formatBytes32String("STATES"),
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
  describe("Create Register Certificate Hash & Sign", function () {
    describe("Hash", function () {
      let _contract;
      let _signers;
      let _roles = ["EMPLOYER", "STATES", "POLICE", "GENDARMERIE", "TAX"];
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
        await registerCertificates.connect(state).addEmployer(employer.address);

        await registerCertificates.mintRegisterCertificate(
          state.address,
          "AA123456789AA",
          "001234-567-89",
          "12346789",
          "DZ132456"
        );
      });
      it("Should be the hash methode be the same on smart contract and js", async function () {
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates(1);
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
      let _roles = ["EMPLOYER", "STATES", "POLICE", "GENDARMERIE", "TAX"];
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
        await registerCertificates.connect(state).addEmployer(employer.address);
        await registerCertificates
          .connect(employer)
          .mintRegisterCertificate(
            state.address,
            "AA123456789AA",
            "001234-567-89",
            "12346789",
            "DZ132456"
          );
      });
      it("Should state can sign with ACCEPT", async () => {
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates(1);
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
        const tce = await _contract.getTemporaryRegisterCertificates(
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
          await _contract.getTemporaryRegisterCertificates(1);
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
        const tce = await _contract.getTemporaryRegisterCertificates(
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
          await _contract.getTemporaryRegisterCertificates(1);
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
        const tce = await _contract.getTemporaryRegisterCertificates(
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
          await _contract.getTemporaryRegisterCertificates(1);
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
        const tce = await _contract.getTemporaryRegisterCertificates(
          temporaryRegisterCertificate.registerCertificateId
        );
        expect(tce.status[0]).to.equal(1);
        expect(tce.status[1]).to.equal(1);
        expect(tce.status[2]).to.equal(1);
        expect(tce.status[3]).to.equal(1);
        expect(tce.status[4]).to.equal(1);
      });
    });
    describe("Submit", function () {
      let _contract;
      let _signers;
      let _roles = ["EMPLOYER", "STATES", "POLICE", "GENDARMERIE", "TAX"];
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
        await registerCertificates.connect(state).addEmployer(employer.address);
        await registerCertificates
          .connect(employer)
          .mintRegisterCertificate(
            state.address,
            "AA123456789AA",
            "001234-567-89",
            "12346789",
            "DZ132456"
          );
      });
      it("Should can create Register Certificate when All parts submite", async () => {
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates(1);
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
        await _contract.SubmitRegisterCertificate(1);
        const trc = await _contract.getTemporaryRegisterCertificates(1);
        const rc = await _contract.getRegisterCertificates(1);
        expect(trc.status[0]).to.equal(0);
        expect(trc.status[1]).to.equal(0);
        expect(trc.status[2]).to.equal(0);
        expect(trc.status[3]).to.equal(0);
        expect(trc.status[4]).to.equal(0);
        expect(rc.status[0]).to.equal(1);
        expect(rc.status[1]).to.equal(1);
        expect(rc.status[2]).to.equal(1);
        expect(rc.status[3]).to.equal(1);
        expect(rc.status[4]).to.equal(1);
      });
      it("Shouldn't create a register certificate when one of the parts doesn't submit", async () => {
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates(1);
        const hashed = HashAcceptedMessage(
          temporaryRegisterCertificate.registerCertificateId,
          temporaryRegisterCertificate.vin,
          temporaryRegisterCertificate.vrp,
          temporaryRegisterCertificate.uri,
          temporaryRegisterCertificate.oldOwner,
          temporaryRegisterCertificate.newOwner
        );
        let messagesSigned = [];
        const declinedhashe = HashDeclinedMessage(
          temporaryRegisterCertificate.registerCertificateId
        );
        const signedMsg = await SignMessage(declinedhashe, _signers[2]);
        await _contract
          .connect(_signers[2])
          .Siging(
            temporaryRegisterCertificate.registerCertificateId,
            2,
            hre.ethers.utils.formatBytes32String(_roles[2]),
            signedMsg
          );
        await Promise.all(
          _signers.map(async (signer) => {
            const res = await SignMessage(hashed, signer);
            messagesSigned.push(res);
          })
        );
        await Promise.all(
          messagesSigned.map(async (signedMsg, i) => {
            if (i != 2) {
              await _contract
                .connect(_signers[i])
                .Siging(
                  temporaryRegisterCertificate.registerCertificateId,
                  i,
                  hre.ethers.utils.formatBytes32String(_roles[i]),
                  signedMsg
                );
            }
          })
        );
        const trc = await _contract.getTemporaryRegisterCertificates(1);
        const rc = await _contract.getRegisterCertificates(1);
        await expect(_contract.SubmitRegisterCertificate(1)).to.be.revertedWith(
          "The Police has declined"
        );
        expect(trc.status[0]).to.equal(1);
        expect(trc.status[1]).to.equal(1);
        expect(trc.status[2]).to.equal(2);
        expect(trc.status[3]).to.equal(1);
        expect(trc.status[4]).to.equal(1);
        expect(rc.status[0]).to.equal(0);
        expect(rc.status[1]).to.equal(0);
        expect(rc.status[2]).to.equal(0);
        expect(rc.status[3]).to.equal(0);
        expect(rc.status[4]).to.equal(0);
      });
    });
    describe("Transfer Register Certificate", async function () {
      let _contract;
      let _signers;
      let _signers1;
      let _signers2;
      let _roles = [
        "",
        "STATES",
        "STATES",
        "EMPLOYER",
        "EMPLOYER",
        "POLICE",
        "GENDARMERIE",
        "TAX",
      ];
      let _roles1 = ["EMPLOYER", "STATES", "POLICE", "GENDARMERIE", "TAX"];
      let _roles2 = ["EMPLOYER", "STATES", "POLICE", "GENDARMERIE", "TAX"];
      const vin = "AA123456789AA";
      const vrp = "001234-567-89";
      const uri = "12346789";
      const oldOwner = "DZ132456";
      const newOwner = "DZ654321";
      let newState;
      let oldState;
      beforeEach(async () => {
        const [
          government,
          state,
          state2,
          employer,
          employer2,
          police,
          gendarmerie,
          tax,
        ] = await ethers.getSigners();

        newState = state2.address;
        oldState = state.address;

        const RegisterCertificates = await ethers.getContractFactory(
          "RegisterCertificates"
        );
        const registerCertificates = await RegisterCertificates.connect(
          government
        ).deploy();

        _contract = registerCertificates;
        _signers = [
          government,
          state,
          state2,
          employer,
          employer2,
          police,
          gendarmerie,
          tax,
        ];
        _signers1 = [employer, state, police, gendarmerie, tax];
        _signers2 = [employer2, state2, police, gendarmerie, tax];
        await Promise.all(
          _roles.map(async (role, i) => {
            if (i != 0)
              await registerCertificates.grantRole(
                hre.ethers.utils.formatBytes32String(role),
                _signers[i].address
              );
          })
        );
        await registerCertificates.connect(state).addEmployer(employer.address);
        await registerCertificates
          .connect(state2)
          .addEmployer(employer2.address);

        await registerCertificates
          .connect(employer)
          .mintRegisterCertificate(state.address, vin, vrp, uri, oldOwner);
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates(1);
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
          _signers1.map(async (signer) => {
            const res = await SignMessage(hashed, signer);
            messagesSigned.push(res);
          })
        );
        await Promise.all(
          messagesSigned.map(async (signedMsg, i) => {
            await _contract
              .connect(_signers1[i])
              .Siging(
                temporaryRegisterCertificate.registerCertificateId,
                i,
                hre.ethers.utils.formatBytes32String(_roles1[i]),
                signedMsg
              );
          })
        );
        await _contract.SubmitRegisterCertificate(1);
      });
      it("Should can Transfer", async () => {
        await _contract
          .connect(_signers2[0])
          .transfer(1, oldOwner, newOwner, oldState, newState);
        const tce = await _contract.getTemporaryRegisterCertificates(1);
        expect(tce.registerCertificateId).to.equal(1);
        expect(tce.vin).to.equal(vin);
        expect(tce.vrp).to.equal(vrp);
        expect(tce.uri).to.equal(uri);
        expect(tce.oldOwner).to.equal(oldOwner);
        expect(tce.newOwner).to.equal(newOwner);
      });
      it("Should can Sign", async () => {
        await _contract
          .connect(_signers2[0])
          .transfer(1, oldOwner, newOwner, oldState, newState);
        const temporaryRegisterCertificate =
          await _contract.getTemporaryRegisterCertificates(1);
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
          _signers2.map(async (signer) => {
            const res = await SignMessage(hashed, signer);
            messagesSigned.push(res);
          })
        );
        await Promise.all(
          messagesSigned.map(async (signedMsg, i) => {
            await _contract
              .connect(_signers2[i])
              .Siging(
                temporaryRegisterCertificate.registerCertificateId,
                i,
                hre.ethers.utils.formatBytes32String(_roles2[i]),
                signedMsg
              );
          })
        );
        const trc = await _contract.getTemporaryRegisterCertificates(1);
        const rc = await _contract.getRegisterCertificates(1);

        await _contract.SubmitRegisterCertificate(1);
        expect(rc.status[0]).to.equal(1);
        expect(rc.status[1]).to.equal(1);
        expect(rc.status[2]).to.equal(1);
        expect(rc.status[3]).to.equal(1);
        expect(rc.status[4]).to.equal(1);
      });
    });
  });
});

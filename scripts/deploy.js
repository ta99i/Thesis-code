const hre = require("hardhat");
//ganache --chain.allowUnlimitedContractSize=true --wallet.mnemonic="money casual program think loop broccoli link hamster resemble pad put december"
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
async function main() {
  //console.log(await hre.ethers.getSigners());
  const y = await hre.ethers.getSigners();
  const RegisterCertificates = await hre.ethers.getContractFactory(
    "RegisterCertificates"
  );
  const registerCertificates = await RegisterCertificates.connect(
    y[0]
  ).deploy();

  await registerCertificates.deployed();

  console.log("Smart Contract deployed on : ", registerCertificates.address);

  // - add signers to smart contract
  await Promise.all(
    _roles.map(async (role, i) => {
      if (i != 0) {
        let ad = y[i].address;

        await registerCertificates
          .connect(y[0])
          .grantRole(ethers.utils.formatBytes32String(role), ad);
        console.log("ADDED ", ad, " AS ", role);
      }
    })
  ).then(async () => {
    await registerCertificates.connect(y[1]).addEmployer(y[3].address);
    await registerCertificates.connect(y[2]).addEmployer(y[4].address);
    console.log("Employers added to States");
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

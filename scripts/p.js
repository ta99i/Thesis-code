const hre = require("hardhat");

const _signers = [
  "0x9afe727521d7d2e16b1d7af8733913783465d1efef23fe1e66f0f5961412a2d9",
  "0x8e7467c3e223322bed3cc2334f7113e50f425e7d2ed84d5073dae24a71e71bb6",
  "0x6387d20551e1ac2860227752d83b15c892d9e278949c8b6a5f4f1eb86d92f5a6",
  "0x4a3be4bb1cd09d5ecac32998c2784fc87f0292b42f5537bac6ce78bf6ac01665",
  "0xccb9921c9dea2f2e00cd95dc64774cd61cf4d20bca0bc753278e788e39a8ec7c",
];
function main() {
  let _address = [];
  _signers.map((pk, i) => {
    let wallet = new hre.ethers.Wallet(pk);
    _address[i] = wallet.address;
    console.log(_address[i]);
  });
}
main();

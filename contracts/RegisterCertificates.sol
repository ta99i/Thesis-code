// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "hardhat/console.sol";
//import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

//import "./IVerifySignature.sol";
interface IVerifySignature {
    function verifyAccepted(
        address _signer,
        uint256 id,
        string memory vin,
        string memory vrp,
        string memory uri,
        string memory oldOwner,
        string memory newOwner,
        bytes memory signature
    ) external pure returns (bool);

    function verifyDeclined(
        address _signer,
        uint256 id,
        bytes memory signature
    ) external pure returns (bool);
}

contract RegisterCertificates is AccessControl {
    //using Counters for Counters.Counter;
    uint256 private _certificateIdCounter;
    address _verifySignatureAddress;
    enum Status {
        PENDING,
        ACCEPTED,
        DECLINED,
        CANCELED
    }
    struct RegisterCertificate {
        uint registerCertificateId;
        string vin;
        string vrp;
        string uri;
        string owner;
        bytes[5] signers;
        Status[5] status;
    }
    struct TemporaryRegisterCertificate {
        uint registerCertificateId;
        address employer;
        string vin;
        string vrp;
        string uri;
        string oldOwner;
        string newOwner;
        address newState;
        address oldState;
        uint8 requireSigners;
        bytes[5] signers;
        Status[5] status;
    }
    mapping(uint256 => TemporaryRegisterCertificate)
        public _idToTemporaryRegisterCertificates;

    mapping(uint256 => RegisterCertificate) private _idToRegisterCertificates;
    mapping(string => uint256[]) _ownerToRegisterCertificate;
    //Vehicle Identification Number
    mapping(string => uint256) _vinToId;
    // Vehicle Registration Plates to id
    mapping(string => uint256) _vrpToId;
    mapping(uint256 => mapping(bytes32 => bool)) _roles;
    mapping(address => mapping(address => bool)) _statsToEmployer;
    event Transfer(uint256 indexed registerCertificateId);
    event Submit(
        uint256 indexed registerCertificateId,
        string indexed oldOwner,
        string indexed newOwner
    );

    constructor(address verifySignatureAddress) {
        _verifySignatureAddress = verifySignatureAddress;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _certificateIdCounter++;
        _roles[0][bytes32("EMPLOYER")] = true;
        _roles[1][bytes32("STATES")] = true;
        _roles[2][bytes32("POLICE")] = true;
        _roles[3][bytes32("GENDARMERIE")] = true;
        _roles[4][bytes32("TAX")] = true;
    }

    function getTemporaryRegisterCertificates(
        uint256 id
    ) external view returns (TemporaryRegisterCertificate memory) {
        return _idToTemporaryRegisterCertificates[id];
    }

    function getRegisterCertificates(
        uint256 id
    ) external view returns (RegisterCertificate memory) {
        return _idToRegisterCertificates[id];
    }

    function currentId() public view returns (uint256) {
        return _certificateIdCounter;
    }

    function addEmployer(address employer) external {
        require(
            hasRole(bytes32("STATES"), msg.sender),
            "Only state can add employers."
        );
        _statsToEmployer[msg.sender][employer] = true;
    }

    function deleteEmployer(address employer) external {
        require(
            hasRole(bytes32("STATES"), msg.sender),
            "Only state can delete employers."
        );
        _statsToEmployer[msg.sender][employer] = false;
    }

    function mintRegisterCertificate(
        address state,
        string memory vin,
        string memory vrp,
        string memory uri,
        string memory owner
    ) public {
        require(
            hasRole(bytes32("EMPLOYER"), msg.sender),
            "Only employers can add a new registration certificate."
        );
        require(
            _statsToEmployer[state][msg.sender] == true,
            "STATE OR EMPLOYER"
        );
        require(
            _vinToId[vin] == 0,
            "The Vehicle Identification Number already registred"
        );
        require(
            _vrpToId[vrp] == 0,
            "The Vehicle Registration Plates already registred"
        );
        uint256 certificatId = _certificateIdCounter;
        _certificateIdCounter++;
        _transfer(certificatId, vin, vrp, uri, owner, owner, state, state);
    }

    function transfer(
        uint256 certificatId,
        string memory oldOwner,
        string memory newOwner,
        address oldState,
        address newState
    ) external {
        require(
            hasRole(bytes32("EMPLOYER"), msg.sender),
            "Only employers can transfer registration certificate."
        );
        require(
            _statsToEmployer[newState][msg.sender] == true,
            "STATE OR EMPLOYER"
        );
        RegisterCertificate memory rc = _idToRegisterCertificates[certificatId];
        _transfer(
            certificatId,
            rc.vin,
            rc.vrp,
            rc.uri,
            oldOwner,
            newOwner,
            oldState,
            newState
        );
    }

    function _transfer(
        uint256 certificatId,
        string memory vin,
        string memory vrp,
        string memory uri,
        string memory oldOwner,
        string memory newOwner,
        address oldState,
        address newState
    ) internal {
        _idToTemporaryRegisterCertificates[
            certificatId
        ] = TemporaryRegisterCertificate(
            certificatId,
            msg.sender,
            vin,
            vrp,
            uri,
            oldOwner,
            newOwner,
            oldState,
            newState,
            5,
            [
                bytes("NOTSIGNED"),
                bytes("NOTSIGNED"),
                bytes("NOTSIGNED"),
                bytes("NOTSIGNED"),
                bytes("NOTSIGNED")
            ],
            [
                Status.PENDING,
                Status.PENDING,
                Status.PENDING,
                Status.PENDING,
                Status.PENDING
            ]
        );
        emit Transfer(certificatId);
    }

    function SubmitRegisterCertificate(uint256 id) public {
        TemporaryRegisterCertificate
            memory tce = _idToTemporaryRegisterCertificates[id];
        uint256 requireSigners = tce.requireSigners;
        require(requireSigners == 0, "No Enough Signateur");
        require(
            tce.status[0] == Status.ACCEPTED,
            "The Government has declined"
        );
        require(tce.status[1] == Status.ACCEPTED, "The Employer has declined");
        require(tce.status[2] == Status.ACCEPTED, "The Police has declined");
        require(tce.status[3] == Status.ACCEPTED, "The Djondarm has declined");
        require(tce.status[4] == Status.ACCEPTED, "The Taxes has declined");
        RegisterCertificate memory rc = RegisterCertificate(
            tce.registerCertificateId,
            tce.vin,
            tce.vrp,
            tce.uri,
            tce.newOwner,
            tce.signers,
            tce.status
        );
        _idToRegisterCertificates[id] = rc;
        //We need To Delete asset from old owner
        uint256 lengthOfAssetsOfOldOwner = _ownerToRegisterCertificate[
            tce.oldOwner
        ].length;
        if (lengthOfAssetsOfOldOwner > 1) {
            uint256[] memory assetesOfOldOwner = new uint256[](
                lengthOfAssetsOfOldOwner - 1
            );
            uint256 index = 0;
            for (uint256 i = 0; i < lengthOfAssetsOfOldOwner; i++) {
                if (_ownerToRegisterCertificate[tce.oldOwner][i] != id) {
                    assetesOfOldOwner[index] = _ownerToRegisterCertificate[
                        tce.oldOwner
                    ][i];
                    index++;
                }
            }
            _ownerToRegisterCertificate[tce.oldOwner] = assetesOfOldOwner;
        } else {
            _ownerToRegisterCertificate[tce.oldOwner] = new uint256[](0);
            // delete _ownerToRegisterCertificate[tce.oldOwner];
        }
        // We need To add Asset To new Owner
        uint256 lengthOfAssetsOfNewOwner = _ownerToRegisterCertificate[
            tce.newOwner
        ].length;
        uint256[] memory assetesOfNewOwner = new uint256[](
            lengthOfAssetsOfNewOwner + 1
        );
        for (uint256 i = 0; i < lengthOfAssetsOfNewOwner; i++) {
            assetesOfNewOwner[i] = _ownerToRegisterCertificate[tce.newOwner][i];
        }
        assetesOfNewOwner[lengthOfAssetsOfNewOwner] = tce.registerCertificateId;
        _ownerToRegisterCertificate[tce.newOwner] = assetesOfNewOwner;
        _vinToId[tce.vin] = tce.registerCertificateId;
        _vrpToId[tce.vrp] = tce.registerCertificateId;
        delete _idToTemporaryRegisterCertificates[tce.registerCertificateId];
        emit Submit(tce.registerCertificateId, tce.oldOwner, tce.newOwner);
    }

    function Siging(
        uint256 id,
        uint256 idrole,
        bytes32 role,
        bytes memory signature
    ) public {
        require(_roles[idrole][role], "This role is not registred");
        require(hasRole(role, msg.sender), "error on role");
        TemporaryRegisterCertificate
            storage tce = _idToTemporaryRegisterCertificates[id];
        require(
            keccak256(abi.encodePacked(tce.signers[idrole])) ==
                keccak256(abi.encodePacked(bytes("NOTSIGNED"))),
            "Already Signed"
        );
        if (
            IVerifySignature(_verifySignatureAddress).verifyAccepted(
                msg.sender,
                tce.registerCertificateId,
                tce.vin,
                tce.vrp,
                tce.uri,
                tce.oldOwner,
                tce.newOwner,
                signature
            )
        ) {
            console.log("accept");
            tce.status[idrole] = Status.ACCEPTED;
            tce.signers[idrole] = signature;
            tce.requireSigners--;
        } else if (
            IVerifySignature(_verifySignatureAddress).verifyDeclined(
                msg.sender,
                id,
                signature
            )
        ) {
            console.log("decline");
            tce.status[idrole] = Status.DECLINED;
            tce.signers[idrole] = bytes("DECLINED");
            tce.requireSigners--;
        }
    }
}

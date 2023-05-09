// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./VerifySignature.sol";

contract RegisterCertificates is AccessControl, VerifySignature {
    using Counters for Counters.Counter;
    Counters.Counter private _certificateIdCounter;

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
        string oldowner;
        string newOwner;
        bytes32 proof;
        Status status;
    }
    struct TemporaryRegisterCertificate {
        uint registerCertificateId;
        string vin;
        string vrp;
        string uri;
        string oldOwner;
        string newOwner;
        uint8 requireSigners;
        bytes[5] signers;
        Status[5] status;
    }
    mapping(uint256 => TemporaryRegisterCertificate) _idToTemporaryRegisterCertificates;

    mapping(uint256 => RegisterCertificate) _idToRegisterCertificates;
    mapping(uint256 => string) _owners;
    //Vehicle Identification Number
    mapping(string => uint256) _vinToId;
    // Vehicle Registration Plates to id
    mapping(string => uint256) _vrpToId;
    mapping(uint256 => mapping(bytes32 => bool)) _roles;
    event Transfer(uint256 indexed registerCertificateId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _certificateIdCounter.increment();
        _roles[0][bytes32("EMPLOYER")] = true;
        _roles[1][bytes32("STATE")] = true;
        _roles[2][bytes32("POLICE")] = true;
        _roles[3][bytes32("GENDARMERIE")] = true;
        _roles[4][bytes32("TAX")] = true;
    }

    function currentId() public view returns (uint256) {
        return _certificateIdCounter.current();
    }

    function mintRegisterCertificate(
        string memory vin,
        string memory vrp,
        string memory uri,
        string memory owner
    ) public {
        require(
            getvin(vin) == 0,
            "The Vehicle Identification Number Already Registred"
        );
        require(
            getvrp(vrp) == 0,
            "The Vehicle Registration Plates Already Registred"
        );
        uint256 certificatId = _certificateIdCounter.current();
        _certificateIdCounter.increment();
        TemporaryRegisterCertificate memory TRC = TemporaryRegisterCertificate(
            certificatId,
            vin,
            vrp,
            uri,
            owner,
            owner,
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
        _idToTemporaryRegisterCertificates[certificatId] = TRC;
        emit Transfer(certificatId);
    }

    function getvin(string memory vin) public view returns (uint256) {
        return _vinToId[vin];
    }

    function getvrp(string memory vrp) public view returns (uint256) {
        return _vrpToId[vrp];
    }

    function getTemporaryRegisterCertificates_States(
        uint256 id
    ) external view returns (TemporaryRegisterCertificate memory) {
        return _idToTemporaryRegisterCertificates[id];
    }

    function getTemporaryRegisterCertificates_Others(
        uint256 id
    ) external view returns (TemporaryRegisterCertificate memory) {
        TemporaryRegisterCertificate
            memory tce = _idToTemporaryRegisterCertificates[id];
        tce.requireSigners = 0;
        tce.signers = [bytes(""), bytes(""), bytes(""), bytes(""), bytes("")];
        return tce;
    }

    function GendarmerieSiging(uint256 id, bytes memory signature) external {
        require(
            hasRole(bytes32("GENDARMERIE"), msg.sender),
            "Only Gendarmerie can access to this method"
        );
        TemporaryRegisterCertificate
            storage tce = _idToTemporaryRegisterCertificates[id];
        require(
            keccak256(abi.encodePacked(tce.signers[4])) ==
                keccak256(abi.encodePacked(bytes("NOTSIGNED"))),
            "Already Signed"
        );
        if (
            verifyAccepted(
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
            tce.status[4] = Status.ACCEPTED;
            tce.signers[4] = signature;
            tce.requireSigners--;
        } else if (verifyDeclined(msg.sender, id, signature)) {
            tce.status[4] = Status.DECLINED;
            tce.signers[4] = bytes("DECLINED");
        }
    }

    function PoliceSiging(uint256 id, bytes memory signature) external {
        require(
            hasRole(bytes32("POLICE"), msg.sender),
            "Only Polices can access to this method"
        );
        TemporaryRegisterCertificate
            storage tce = _idToTemporaryRegisterCertificates[id];
        require(
            keccak256(abi.encodePacked(tce.signers[2])) ==
                keccak256(abi.encodePacked(bytes("NOTSIGNED"))),
            "Already Signed"
        );
        if (
            verifyAccepted(
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
            tce.status[2] = Status.ACCEPTED;
            tce.signers[2] = signature;
            tce.requireSigners--;
        } else if (verifyDeclined(msg.sender, id, signature)) {
            tce.status[2] = Status.DECLINED;
            tce.signers[2] = bytes("DECLINED");
        }
    }

    function bytes32ToString(
        bytes32 _bytes32
    ) public pure returns (string memory) {
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function Siging(
        uint256 id,
        uint256 idrole,
        bytes32 role,
        bytes memory signature
    ) external {
        require(_roles[idrole][role], "This role is not registred");
        require(hasRole(role, msg.sender), bytes32ToString(role));
        TemporaryRegisterCertificate
            storage tce = _idToTemporaryRegisterCertificates[id];
        require(
            keccak256(abi.encodePacked(tce.signers[idrole])) ==
                keccak256(abi.encodePacked(bytes("NOTSIGNED"))),
            "Already Signed"
        );
        if (
            verifyAccepted(
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
            tce.status[idrole] = Status.ACCEPTED;
            tce.signers[idrole] = signature;
            tce.requireSigners--;
        } else if (verifyDeclined(msg.sender, id, signature)) {
            tce.status[idrole] = Status.DECLINED;
            tce.signers[idrole] = bytes("DECLINED");
        }
    }
}

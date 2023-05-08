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
        nil,
        Pending,
        Accepted,
        Canceled
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
        bytes[6] signers;
    }
    mapping(uint256 => TemporaryRegisterCertificate) _idToTemporaryRegisterCertificates;

    mapping(uint256 => RegisterCertificate) _idToRegisterCertificates;
    mapping(uint256 => string) _owners;
    //Vehicle Identification Number
    mapping(string => uint256) _vinToId;
    // Vehicle Registration Plates to id
    mapping(string => uint256) _vrpToId;

    event Transfer(uint256 indexed registerCertificateId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _certificateIdCounter.increment();
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
            6,
            [
                bytes("NOTSIGNED"),
                bytes("NOTSIGNED"),
                bytes("NOTSIGNED"),
                bytes("NOTSIGNED"),
                bytes("NOTSIGNED"),
                bytes("NOTSIGNED")
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
        tce.signers = [
            bytes(""),
            bytes(""),
            bytes(""),
            bytes(""),
            bytes(""),
            bytes("")
        ];
        return tce;
    }

    function PoliceSiging(uint256 id, bytes memory signature) external {
        require(
            hasRole(bytes32("POLICE"), msg.sender),
            "Only Polices can access to this method"
        );
        TemporaryRegisterCertificate
            storage tce = _idToTemporaryRegisterCertificates[id];
        require(
            keccak256(abi.encodePacked(tce.signers[3])) ==
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
            tce.signers[3] = signature;
            tce.requireSigners--;
        } else if (verifyDeclined(msg.sender, id, signature)) {
            tce.signers[3] = bytes("DECLINED");
        }
    }
}

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
        string owner;
        bytes[5] signers;
        Status[5] status;
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
    mapping(string => uint256[]) _ownerToRegisterCertificate;
    //Vehicle Identification Number
    mapping(string => uint256) _vinToId;
    // Vehicle Registration Plates to id
    mapping(string => uint256) _vrpToId;
    mapping(uint256 => mapping(bytes32 => bool)) _roles;
    event Transfer(uint256 indexed registerCertificateId);
    event Submit(
        uint256 indexed registerCertificateId,
        string indexed oldOwner,
        string indexed newOwner
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _certificateIdCounter.increment();
        _roles[0][bytes32("EMPLOYER")] = true;
        _roles[1][bytes32("GOVERNMENT")] = true;
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
            hasRole(bytes32("EMPLOYER"), msg.sender),
            "Only employers can add a new registration certificate."
        );
        require(
            getvin(vin) == 0,
            "The Vehicle Identification Number already registred"
        );
        require(
            getvrp(vrp) == 0,
            "The Vehicle Registration Plates already registred"
        );
        uint256 certificatId = _certificateIdCounter.current();
        _certificateIdCounter.increment();
        _idToTemporaryRegisterCertificates[
            certificatId
        ] = createTemporaryRegisterCertificate(
            certificatId,
            vin,
            vrp,
            uri,
            owner,
            owner
        );
        emit Transfer(certificatId);
    }

    function transfer(
        uint256 certificatId,
        string memory oldOwner,
        string memory newOwner
    ) external {
        require(
            hasRole(bytes32("EMPLOYER"), msg.sender),
            "Only employers can add a new registration certificate."
        );

        RegisterCertificate memory ce = _idToRegisterCertificates[certificatId];
        string memory ownerOfRegisterCertificate = _idToRegisterCertificates[
            certificatId
        ].owner;
        require(
            keccak256(abi.encodePacked(ownerOfRegisterCertificate)) ==
                keccak256(abi.encodePacked(oldOwner)),
            "Only Owner can transfer RegisterCertificate"
        );
        //create new TemporaryRegisterCertificates
        _idToTemporaryRegisterCertificates[
            certificatId
        ] = createTemporaryRegisterCertificate(
            certificatId,
            ce.vin,
            ce.vrp,
            ce.uri,
            oldOwner,
            newOwner
        );
        emit Transfer(certificatId);
    }

    function createTemporaryRegisterCertificate(
        uint256 certificatId,
        string memory vin,
        string memory vrp,
        string memory uri,
        string memory oldOwner,
        string memory newOwner
    ) internal pure returns (TemporaryRegisterCertificate memory) {
        TemporaryRegisterCertificate memory TRC = TemporaryRegisterCertificate(
            certificatId,
            vin,
            vrp,
            uri,
            oldOwner,
            newOwner,
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
        return TRC;
    }

    function getvin(string memory vin) public view returns (uint256) {
        return _vinToId[vin];
    }

    function getvrp(string memory vrp) public view returns (uint256) {
        return _vrpToId[vrp];
    }

    function getRegisterCertificates_Government(
        uint256 id
    ) external view returns (RegisterCertificate memory) {
        return _idToRegisterCertificates[id];
    }

    function getTemporaryRegisterCertificates_Government(
        uint256 id
    ) external view returns (TemporaryRegisterCertificate memory) {
        return _idToTemporaryRegisterCertificates[id];
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
        _idToTemporaryRegisterCertificates[
            tce.registerCertificateId
        ] = TemporaryRegisterCertificate(
            0,
            "",
            "",
            "",
            "",
            "",
            0,
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
        emit Submit(tce.registerCertificateId, tce.oldOwner, tce.newOwner);
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
            tce.requireSigners--;
        }
    }
}

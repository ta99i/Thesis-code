// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "hardhat/console.sol";

contract Main {
    enum Status {
        nil,
        Pending,
        Accepted,
        Canceled
    }
    struct RegisterCertificate {
        string vin;
        uint8 requireSigners;
        address[] signers;
        Status status;
    }
    mapping(address => bool) _policesAddress;
    mapping(address => bool) _statesAddress;
    mapping(bytes32 => RegisterCertificate) _registerCertificates;
    mapping(bytes32 => RegisterCertificate) _temporaryRegisterCertificates;

    function addRegisterCertificate(
        string memory vin,
        uint8 requireSigners,
        address[] memory signers
    ) public {
        bytes32 kVIN = keccak256(abi.encodePacked(vin));
        require(
            _registerCertificates[kVIN].status == Status.nil,
            "Certificate Already On Sytem"
        );
        RegisterCertificate memory certificate = RegisterCertificate(
            vin,
            requireSigners,
            signers,
            Status.Pending
        );
        _temporaryRegisterCertificates[kVIN] = certificate;
    }

    function SigntemporaryRegisterCertificates(
        uint8 id,
        string memory vin
    ) public {
        require(
            isTemporaryCertificateExist(vin) == Status.Pending,
            "this certificate already exist"
        );

        bytes32 kVIN = keccak256(abi.encodePacked(vin));
        RegisterCertificate storage ce = _temporaryRegisterCertificates[kVIN];
        require(ce.signers[id] == msg.sender, "ee");

        ce.signers[id] = address(0x0000000000000000000000000000);
        ce.requireSigners--;
        if (ce.requireSigners == 0) {
            temporaryExecuteCertificate(vin);
        }
    }

    function temporaryExecuteCertificate(string memory vin) internal {
        bytes32 kVIN = keccak256(abi.encodePacked(vin));

        RegisterCertificate storage tce = _temporaryRegisterCertificates[kVIN];

        require(
            tce.requireSigners == 0,
            "executeCertificate : Error in Signer"
        );
        tce.status = Status.Accepted;
        _registerCertificates[kVIN] = tce;
        console.log(uint(_temporaryRegisterCertificates[kVIN].status));
        delete _temporaryRegisterCertificates[kVIN];
        console.log(uint(_temporaryRegisterCertificates[kVIN].status));
    }

    function addPolice(address police) public {
        _policesAddress[police] = true;
    }

    function deletePolice(address police) public {
        _policesAddress[police] = false;
    }

    function addState(address state) public {
        _statesAddress[state] = true;
    }

    function deleteState(address state) public {
        _statesAddress[state] = false;
    }

    function isTemporaryCertificateExist(
        string memory vin
    ) public view returns (Status) {
        bytes32 kVIN = keccak256(abi.encodePacked(vin));
        return _temporaryRegisterCertificates[kVIN].status;
    }

    function isCertificateExist(
        string memory vin
    ) public view returns (Status) {
        bytes32 kVIN = keccak256(abi.encodePacked(vin));
        return _registerCertificates[kVIN].status;
    }
}

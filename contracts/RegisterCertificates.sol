// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "hardhat/console.sol";

/*
    /// 
        certificate :
            Temporary
                param:
                    id
                    uri
                    VIN
                    Sginers[]:
                        0=> Employer
                        1=> Original State
                        2=> Target State
                        3=> Police
                        4=> Djondarm
                        5=> Taxes
                Etat : 
                    Pending
                Signers :
                    Employer:bool / State:bool / Police:bool / Djondarm:bool / Taxes:bool
            Final
                Param:
                    id
                    uri
                    VIN
                    MerkleTree
                Etat:
                    Baladiya:
                        Accepted / Canceled / Thifed /  Pending
                    Police :
                        true / false
                    Taxes : 
                        true / false
                    Djondarm : 
                        true / false
                MerkleTree :
                    MerkleTree(Employer / State / Police / Djondarm / Taxes)

    ///
        vars:
            mapping(id=>cerificate) 
            mapping(id=>owner)    
            mapping(VRI=>id)
            mapping(RN=>id)
    ///
        functions : 
            createRC(VRI,RN,Owner,URI)=>{Signed By Employer / State / Police / Djondarm / Taxes} :
                in this case the target state will be the same Original State
            Transfer :
            On all Transfer we need to check first Etat of RC:{We need To be all False and baladiya Accepted} 
                transferIN(URI,new Owner)=>{Signed By Employer / Original State / Target State/ Police / Djondarm / Taxes} :
                    in this case the target state will be the same Original State
                transferOut(URI,new Owner,TatgetState)=>{Signed By Employer / Original State / Target State/ Police / Djondarm / Taxes}
    /// How To manage Signs ?
        We need At first to register all members and give every member a role & We need to register Every Signed 
            we will use access contrle ?
            we will save on merkletree ?:
                the certificate will have two etats :   - On transfer or create (Temporary): 
                                                                                            - That we will have all signs
                                                                                            - When we Complted we will deleted

                                                        - On Final Etate (Final):
                                                                                            - From all signs we will generate a Merkletree to save all data in one hash

    /// How The Sign will be 
        hash(hash(id) + hash(URI) + hash(VIN) + hash(old owner) + hash(newOwner))*Sign offchain
 */
contract RegisterCertificates {
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
    address _policeAddress;
    address _stateAddress;
    address _taxAddress;
    mapping(bytes32 => RegisterCertificate) _registerCertificates;
    mapping(bytes32 => RegisterCertificate) _temporaryRegisterCertificates;

    function addRegisterCertificate(
        string memory vin,
        uint8 requireSigners,
        /*
        0 for original State
        1 for target State
        2 for Police
        3 for taxes
        */
        address[] memory signers
    ) public {
        bytes32 kVIN = keccak256(abi.encodePacked(vin));
        require(
            _registerCertificates[kVIN].status == Status.nil,
            "Certificate Already On System"
        );
        RegisterCertificate memory certificate = RegisterCertificate(
            vin,
            requireSigners,
            signers,
            Status.Pending
        );
        _temporaryRegisterCertificates[kVIN] = certificate;
    }

    // function transferOnTheState(){}
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

    function updatePolice(address police) public {
        require(
            police != address(0x0000000000000000000000000000),
            "Cant update with address 0"
        );
        _policeAddress = police;
    }

    function updatetate(address state) public {
        require(
            state != address(0x0000000000000000000000000000),
            "Cant update with address 0"
        );

        _stateAddress = state;
    }

    function updateTax(address tax) public {
        require(
            tax != address(0x0000000000000000000000000000),
            "Cant update with address 0"
        );

        _taxAddress = tax;
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

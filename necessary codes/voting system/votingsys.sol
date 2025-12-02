// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

    contract voting_sys
    {
        struct  Voter
        {
            string name;
            uint age;
            uint voterId;
            string gender;
            uint votecandidateId;
            address voterAddress;
        }

        struct Candidate
        {
            string name;
            uint age;
            uint candidateId;
            address candidateAddress;
            string gender;
            uint votes;
        }

        address electionComission;
        address public owner;

        uint nextVoterId=1;
        uint nextCandidateId =1;
        
        uint startTime;
        uint endTime;

        mapping(uint=> Voter)voterDetails;
        mapping(uint => Candidate)candidateDetails;
        bool stopVoting;

        constructor() {
            electionComission=msg.sender;
        }

        modifier onlyCommissioner(){
            require(msg.sender == electionComission, "you are not from election comission");
        _;}

    function candidateRegister(string calldata _name , uint _age , string calldata _gender ) external
    {
        require(_age>= 18 , " age should be atleast 18");
        require(candidateVerification(msg.sender), " you have been already registered");
        require(nextCandidateId < 3 , "full");

        candidateDetails[nextCandidateId] = Candidate(
            {
                name : _name,
                age : _age,
                candidateId : nextCandidateId,
                candidateAddress : msg.sender,
                gender : _gender,
                votes : 0
            }
        );
         nextCandidateId++;
    }

    function candidateVerification (address _person) internal view returns ( bool ) {
        for(uint i =1 ; i< nextCandidateId; i++)
        {
            if(candidateDetails[i].candidateAddress == _person)
            {
                return false;
            }
        }
            return true;
    }


    function candidateList() public view returns(Candidate[] memory)
    {
        Candidate[] memory candidateArr = new Candidate[](nextCandidateId-1);

        for( uint i =1 ; i< nextCandidateId ; i++)
        {
            candidateArr[i-1] = candidateDetails[i];
    
        }
        return candidateArr;
    }
        function voterRegister( string calldata _name, uint  _age , string calldata _gender) external {
            require(_age>=18 , "age must be atleast 18");
            require(verificationVoter(msg.sender), " voter has already been registered");
            voterDetails[nextVoterId]= Voter({
                name : _name ,
                age : _age ,
                voterId : nextVoterId,
                gender : _gender,
                votecandidateId : 0,
                voterAddress : msg.sender

            });
            nextVoterId++;
        }
        function verificationVoter(address _person) public view returns (bool){
            for(uint i = 1 ; i< nextVoterId ; i++){
                if( voterDetails[i].voterAddress == _person){
                    return false;
                }
            }
             return true;
        }
        function voterList() public view returns(Voter[] memory) {
            Voter[] memory voterArr = new Voter[](nextVoterId-1);
            for (uint i = 1 ; i< nextVoterId ; i++)
            {
                voterArr[i-1]=voterDetails[i];
            }        
            return voterArr;
    }

     function emergency() external onlyCommissioner{
         stopVoting = true;
     }
    
    function vote( uint _voterId , uint _candidateId) external{
        require(startTime !=0 , " voting has not started yet");
        require(voterDetails[_voterId].voterAddress == msg.sender , "you are not registered voter");
        require(_candidateId >0 && _candidateId<3," candidate id not valid");
        require(nextCandidateId ==3 , " candidates have not registered");
        require(voterDetails[_voterId].votecandidateId ==0 , "you have already voted");
        voterDetails[_voterId].votecandidateId = _candidateId;
        candidateDetails[_candidateId].votes++;
    }
    
    function voteTime(uint _startTime , uint _duration) external onlyCommissioner{

        startTime = _startTime;
        endTime = _startTime + _duration;
    }
    function votingStatus() public view returns(string memory)
    {
        if(startTime ==0){
            return "voting has not started Yet!";
        }
        
        else if( endTime > block.timestamp && stopVoting == false){
            return "voting is live";
        }

        else {
                return "voting has ended";
        }
    }
    
    function result() public view returns (string memory winnerName , uint winnerVotes){
        
        require(endTime>block.timestamp || stopVoting == true , "voting is still live");
uint highestVotes =0;
        string memory topCandidateName="";

        for(uint i = 0 ; i< nextCandidateId ; i++){
            if(candidateDetails[i].votes > highestVotes){
                highestVotes=candidateDetails[i].votes;
                topCandidateName=candidateDetails[i].name;
            }
        }
        return(topCandidateName , highestVotes) ;
    }
    }
    
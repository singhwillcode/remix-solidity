// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Tweeter {

    struct Tweet {
        uint id;
        string content;
        uint createdAt;
        address author;
    }

    struct Message {
        uint id;
        string content;
        uint createdAt;
        address to;
        address from;
    }

    mapping(uint => Tweet) public tweets;
    mapping(address => uint[]) public tweetsof;
    mapping(address => address[]) public following;
    mapping(address => mapping(address => bool)) public access;
    mapping(address => Message[]) public messages;

    uint nextId;
    uint nextMessageId;

    function _tweet(address _from, string memory _content) internal {
        tweets[nextId] = Tweet(nextId, _content, block.timestamp, _from);
        tweetsof[_from].push(nextId); // Important to store this
        nextId++;
    }

    function _sendMessage(address _from, address _to, string memory _content) internal {
        messages[_from].push(Message(nextMessageId, _content, block.timestamp, _to, _from));
        nextMessageId++;
    }

    function tweet(string memory _content) public {
        _tweet(msg.sender, _content);
    }

    function tweetFrom(address _from, string memory _content) public {
        _tweet(_from, _content);
    }

    function sendMessage(string memory _content, address _to) public {
        _sendMessage(msg.sender, _to, _content);
    }

    function sendMessageFrom(string memory _content, address _from, address _to) public {
        _sendMessage(_from, _to, _content);
    }

    function allowAccess(address _operator) public {
        access[msg.sender][_operator] = true;
    }

    function denyAccess(address _operator) public {
        access[msg.sender][_operator] = false;
    }

    function getLatestTweets(uint count) public view returns (Tweet[] memory) {
        require(count > 0 && count <= nextId, "Invalid count");
        Tweet[] memory _tweets = new Tweet[](count);
        uint j;

        for (uint i = nextId - count; i < nextId; i++) {
            Tweet storage _t = tweets[i];
            _tweets[j] = Tweet(_t.id, _t.content, _t.createdAt, _t.author);
            j++;
        }

        return _tweets;
    }

    function getLatesttweetofUser(address _user, uint count) public view returns (Tweet[] memory) {
        uint[] memory ids = tweetsof[_user];
        require(count > 0 && count <= ids.length, "error");

        Tweet[] memory _tweets = new Tweet[](count);
        uint j;

        for (uint i = ids.length - count; i < ids.length; i++) {
            Tweet storage _structure = tweets[ids[i]];
            _tweets[j] = Tweet(_structure.id, _structure.content, _structure.createdAt, _structure.author);
            j++;
        }

        return _tweets;
    }
}

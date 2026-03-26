// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, ebool, euint8, externalEuint8} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title PrivateVoting
/// @notice Minimal confidential voting example for the Zama tutorial.
/// @dev Keeps vote choices and intermediate tallies encrypted while exposing
/// public metadata such as title, options and voting window.
contract PrivateVoting is ZamaEthereumConfig {
    uint8 public constant MAX_OPTIONS = 3;

    error InvalidVotingWindow();
    error InvalidOptionCount();
    error VotingNotStarted();
    error VotingClosed();
    error AlreadyVoted();
    error ResultsUnavailable();
    error ResultsAlreadyPublished();
    error OptionOutOfBounds();

    address public immutable owner;
    string public title;
    uint64 public startTime;
    uint64 public endTime;
    bool public resultsPublished;

    string[] private _options;
    mapping(address => bool) private _hasVoted;
    mapping(uint8 => euint8) private _encryptedTallies;

    event VoteSubmitted(address indexed voter);
    event ResultsPublished();
    event ResultAccessGranted(address indexed viewer);

    constructor(string memory title_, string[] memory options_, uint64 startTime_, uint64 endTime_) {
        if (options_.length < 2 || options_.length > MAX_OPTIONS) {
            revert InvalidOptionCount();
        }
        if (startTime_ >= endTime_) {
            revert InvalidVotingWindow();
        }

        owner = msg.sender;
        title = title_;
        startTime = startTime_;
        endTime = endTime_;

        for (uint8 i = 0; i < options_.length; i++) {
            _options.push(options_[i]);
            _encryptedTallies[i] = FHE.asEuint8(0);
            FHE.allowThis(_encryptedTallies[i]);
        }
    }

    function optionCount() external view returns (uint256) {
        return _options.length;
    }

    function getOptions() external view returns (string[] memory) {
        return _options;
    }

    function hasVoted(address voter) external view returns (bool) {
        return _hasVoted[voter];
    }

    function vote(externalEuint8 encryptedOption, bytes calldata inputProof) external {
        if (block.timestamp < startTime) {
            revert VotingNotStarted();
        }
        if (block.timestamp >= endTime) {
            revert VotingClosed();
        }
        if (_hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }

        euint8 choice = FHE.fromExternal(encryptedOption, inputProof);

        for (uint8 i = 0; i < _options.length; i++) {
            ebool isSelected = FHE.eq(choice, i);
            euint8 increment = FHE.select(isSelected, FHE.asEuint8(1), FHE.asEuint8(0));
            _encryptedTallies[i] = FHE.add(_encryptedTallies[i], increment);
            FHE.allowThis(_encryptedTallies[i]);
        }

        _hasVoted[msg.sender] = true;
        emit VoteSubmitted(msg.sender);
    }

    function publishResults() external {
        if (block.timestamp < endTime) {
            revert ResultsUnavailable();
        }
        if (resultsPublished) {
            revert ResultsAlreadyPublished();
        }

        resultsPublished = true;

        for (uint8 i = 0; i < _options.length; i++) {
            FHE.allowThis(_encryptedTallies[i]);
            FHE.allow(_encryptedTallies[i], owner);
        }

        emit ResultsPublished();
    }

    function grantResultAccess(address viewer) external {
        if (!resultsPublished) {
            revert ResultsUnavailable();
        }

        for (uint8 i = 0; i < _options.length; i++) {
            FHE.allow(_encryptedTallies[i], viewer);
        }

        emit ResultAccessGranted(viewer);
    }

    function getEncryptedTally(uint8 optionIndex) external view returns (euint8) {
        if (!resultsPublished) {
            revert ResultsUnavailable();
        }
        if (optionIndex >= _options.length) {
            revert OptionOutOfBounds();
        }

        return _encryptedTallies[optionIndex];
    }
}

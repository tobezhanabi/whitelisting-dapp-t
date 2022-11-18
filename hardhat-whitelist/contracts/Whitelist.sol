// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Whitelist {
  // max number of whitelist
  uint8 public maxWhitelistedAddress;
  // current whitelisted address, starting at 0
  uint8 public numAddressWhitelisted;

  mapping(address => bool) public whitelistedAddresses;

  constructor(uint8 _maxWhitelistedAddress) {
    maxWhitelistedAddress = _maxWhitelistedAddress;
  }

  function addressToWhitelist() public {
    require(
      !whitelistedAddresses[msg.sender],
      "sender already exist in whitelist "
    );
    require(
      numAddressWhitelisted < maxWhitelistedAddress,
      "Miax whitelisted address reach!"
    );
    whitelistedAddresses[msg.sender] = true;
    numAddressWhitelisted += 1;
  }
}

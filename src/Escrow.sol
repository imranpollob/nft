// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public rentalManager;
    mapping(uint256 => uint256) public balances;

    event FundsDeposited(uint256 indexed rentalId, uint256 amount);
    event PayoutReleased(uint256 indexed rentalId, address indexed to, uint256 amount);

    constructor(address _rentalManager) {
        rentalManager = _rentalManager;
    }

    modifier onlyRentalManager() {
        require(msg.sender == rentalManager, "Escrow: only rental manager");
        _;
    }

    function deposit(uint256 rentalId) external payable {
        balances[rentalId] += msg.value;
        emit FundsDeposited(rentalId, msg.value);
    }

    function release(uint256 rentalId, address to, uint256 amount) external onlyRentalManager {
        require(balances[rentalId] >= amount, "Escrow: insufficient balance");
        balances[rentalId] -= amount;
        payable(to).transfer(amount);
        emit PayoutReleased(rentalId, to, amount);
    }
}

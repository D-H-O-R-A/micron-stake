// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/token/ERC20/utils/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/access/Ownable.sol";

contract StakingContract is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    uint256 public apr; // Annual Percentage Rate in basis points (1% = 100 basis points)
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 duration;
        bool claimed;
    }

    mapping(address => Stake[]) public stakes;

    event Staked(address indexed user, uint256 amount, uint256 duration);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event Claimed(address indexed user, uint256 amount);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    event APRChanged(uint256 oldAPR, uint256 newAPR);
    event TokenChanged(IERC20 oldToken, IERC20 newToken);
    event FundsWithdrawn(address indexed admin, uint256 etherAmount, uint256 tokenAmount);

    constructor(IERC20 _stakingToken, uint256 _apr) {
        stakingToken = _stakingToken;
        apr = _apr;
    }

    function setAdmin(address newAdmin) external onlyOwner {
        require(newAdmin != address(0), "New admin is the zero address");
        emit AdminChanged(owner(), newAdmin);
        transferOwnership(newAdmin);
    }

    function setAPR(uint256 newAPR) external onlyOwner {
        emit APRChanged(apr, newAPR);
        apr = newAPR;
    }

    function setStakingToken(IERC20 newToken) external onlyOwner {
        emit TokenChanged(stakingToken, newToken);
        stakingToken = newToken;
    }

    function stakeOneWeek(uint256 amount) external {
        _stake(amount, 1 weeks);
    }

    function stakeOneMonth(uint256 amount) external {
        _stake(amount, 4 weeks);
    }

    function stakeThreeMonths(uint256 amount) external {
        _stake(amount, 12 weeks);
    }

    function _stake(uint256 amount, uint256 duration) internal {
        require(amount > 0, "Amount must be greater than 0");
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        stakes[msg.sender].push(Stake({
            amount: amount,
            timestamp: block.timestamp,
            duration: duration,
            claimed: false
        }));

        emit Staked(msg.sender, amount, duration);
    }

    function unstake(uint256 stakeIndex) external {
        require(stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        Stake storage userStake = stakes[msg.sender][stakeIndex];
        require(!userStake.claimed, "Stake already claimed or unstaked");
        require(block.timestamp >= userStake.timestamp + userStake.duration, "Stake is still locked");

        uint256 reward = calculateReward(userStake.amount, userStake.duration);
        userStake.claimed = true;

        stakingToken.safeTransfer(msg.sender, userStake.amount);  // Devolvendo tokens ao usuário
        payable(msg.sender).transfer(reward);  // Transferindo recompensa em Ether

        emit Unstaked(msg.sender, userStake.amount, reward);
    }

    function calculateReward(uint256 amount, uint256 duration) public view returns (uint256) {
        uint256 totalEth = address(this).balance;
        uint256 totalTokens = stakingToken.balanceOf(address(this));

        // APR is calculated per second
        uint256 aprPerSecond = apr * 1e16 / (365 days);

        uint256 reward = (amount * duration * aprPerSecond) / 1e18;
        
        return (reward * totalEth) / totalTokens;
    }

    function getStakes(address user) external view returns (Stake[] memory) {
        return stakes[user];
    }

    function adminWithdraw(uint256 etherAmount, uint256 tokenAmount) external onlyOwner {
        require(etherAmount <= address(this).balance, "Not enough Ether in contract");
        require(tokenAmount <= stakingToken.balanceOf(address(this)), "Not enough tokens in contract");

        if (etherAmount > 0) {
            payable(owner()).transfer(etherAmount);
        }

        if (tokenAmount > 0) {
            stakingToken.safeTransfer(owner(), tokenAmount);
        }

        emit FundsWithdrawn(owner(), etherAmount, tokenAmount);
    }

    receive() external payable {}

    fallback() external payable {}
}

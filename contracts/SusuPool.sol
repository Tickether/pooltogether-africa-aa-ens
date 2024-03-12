//SPDX-License-Identifier: MIT
//Code by @0xGeeLoko

pragma solidity ^0.8.19;
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';



contract SusuPool is Ownable {
    constructor(address initialOwner) 
        Ownable(initialOwner)
    {}
    
    //confirm vault before deploy!!!!!!
    address public ptaUSDC = 0xA723Cf5D90c1A472c7de7285e5bD314AeA107EDe; //pUSDC-LY-T ARB SEPOLIA
    IERC20 ptaVaultToken = IERC20(ptaUSDC);


    function dripSusuPool(address to, uint256 amount) external onlyOwner {
        require(ptaVaultToken.balanceOf(address(this)) >= 0, 'zero balance');
        require(ptaVaultToken.balanceOf(address(this)) >= amount, 'low balance');
        
        //release amountDollar of tokens depending on exchange rate/origin/amountLocal
        bool ptaTransferred = ptaVaultToken.transfer(to, amount);
        require(ptaTransferred, 'Transfer failed.');
    } 
    

    //withdraw onlyOwner
    function withdraw() external onlyOwner {
        require(ptaVaultToken.balanceOf(address(this)) >= 0, 'zero balance');
        
        //clear distro vault
        uint256 balance = ptaVaultToken.balanceOf(address(this));
        bool ptaTransferred = ptaVaultToken.transfer(msg.sender, balance);
        require(ptaTransferred, 'Transfer failed.');
    } 


    //E!-withdraw
    function eWithdraw(address token) external onlyOwner {
        IERC20 erc20Token = IERC20(token);
        require(erc20Token.balanceOf(address(this)) >= 0, 'zero balance');

        //clear token balance
        uint256 balance = erc20Token.balanceOf(address(this));
        bool tokenTransferred = erc20Token.transfer(msg.sender, balance);
        require(tokenTransferred, 'Transfer failed.');
    } 


    //E!-withdraw E
    function eWithdrawE() external onlyOwner {
        require(address(this).balance >= 0, 'zero balance');
        //clear eth balance
        (bool success, ) =  msg.sender.call{value: address(this).balance}('');
        require(success, 'Transfer failed.');
    }
}
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WidgetsFactory is ERC20, Ownable {
    // warehouse managers: mapping to keep track of managers
    mapping(address => bool) public _managers;        
    // factory stock indicator: this indicates the amount of factory widgets
    uint256 private _stock;
    // accepted customer order mapping: if customer has successfully ordered, they are added to the 'list'
    mapping(uint256 => address) public _acceptedOrder;
    // mapping for accepted orders, ready to ship
    mapping(address => uint256) public _acceptedShip;
    // mapping to store and track shipped orders
    mapping(uint256 => address) public _shipedOrder;
    // the index of order which was last shipped
    uint256 public _lastShippedOrder = 0;
    // the index of current order
    uint256 public _currentOrderId = 0;
    
    constructor() ERC20("WidgetsFactory", "Widgets") {    
        _addManager(msg.sender);    
    }    

    /**
    @dev Add a manager of the factory. 
    @param user Manager address
   */
    function _addManager(
        address user
    ) public onlyOwner {
        _managers[user] = true;
    }

    /**
    @dev Delete manager. Although, out of scope for assignment, a real world scenario would likely require this.
    @param user Manager address
   */
    function _deleteManager(
        address user
    ) public onlyOwner {
        _managers[user] = false;
    }

    /**
    @dev Get the amount of stock
    @return uint256 The amount of stock 
   */
    function _getAmount(
    ) public view returns (uint256) {
        return _stock;
    }
    
    /**
    @dev Inventory management
    @param recipient User address
    @param amount The amount of stock
   */
    function InventoryManagement(
        address recipient,
        uint256 amount
    ) public {
        require(_managers[recipient] == true, 'Customer can not alter stock in inventory');
        require(amount > 0, 'The factory has not produced the stock yet');
        
        _stock += amount;
        _mint(address(this), amount);
    }
    
    /**
    @dev A customer is able to place an order for a certain number of widgets
    @param orderer The customer address
    @param amount The order amount
    */
    function OrderPurchase(address orderer, uint256 amount) public payable{
        require(_managers[orderer] == false, "Orderer should not be a manager");
        require(_getAmount() > amount, "Not enough stock");
        require(msg.value > amount * 10 ** 16, "Not enough funds");

        _acceptedOrder[_currentOrderId] = orderer;
        _acceptedShip[orderer] = amount;
        _stock -= amount;

        _currentOrderId++;
    }

    /**
    @dev Manager function to ship a customer order
    */
    function OrderShip() public {
        require(_managers[msg.sender] == true, "Can only be shipped by manager");

        uint loop = _currentOrderId - _lastShippedOrder;
        if (loop > 0) {
            for (uint256 i = 0; i < loop; i++) {
                _shipedOrder[_lastShippedOrder] = _acceptedOrder[_lastShippedOrder];
                _transfer(address(this), _acceptedOrder[_lastShippedOrder], _acceptedShip[_acceptedOrder[_lastShippedOrder]]);
                _lastShippedOrder++;
            }
        }        
    }
}
const { expect } = require("chai");

describe("WidgetsFactory", function () {
  it("InventoryManagement: manager adds 10 stock resulting in success", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF');
    expect(await factory._managers('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF')).to.equal(true);

    await factory.InventoryManagement('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF', 10);
    expect(await factory._getAmount()).to.equal(10);
  });

  it("InventoryManagement: manager adds 0 stock resulting in fail", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF');
    expect(await factory._managers('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF')).to.equal(true);

    await expect(factory.InventoryManagement('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF', 0)).to.be.revertedWith("The factory has not produced the stock yet");
  });

  it("InventoryManagement: customer adds 10 stock resulting in fail", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF');
    expect(await factory._managers('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF')).to.equal(true);

    await expect(factory.InventoryManagement('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 10)).to.be.revertedWith("Customer can not alter stock in inventory");
  });

  it("CustomerPurchase(OrderPurchase): customer order 1 stock resulting in success", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF');
    expect(await factory._managers('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF')).to.equal(true);

    await factory.InventoryManagement('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF', 10);
    await factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1, {
      value: ethers.utils.parseEther("1.0")
    });
    
    expect(await factory._acceptedOrder(0)).to.equal('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48');
    expect(await factory._acceptedShip('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48')).to.equal(1);
  });

  
  it("CustomerPurchase(OrderPurchase): customer order 1, stock fail for empty stock", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF');
    expect(await factory._managers('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF')).to.equal(true);

    await expect(factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1, {
      value: ethers.utils.parseEther("1.0")
    })).to.be.revertedWith("Not enough stock");    
  });

  it("CustomerPurchase(OrderPurchase): customer order 1, stock fail for insufficient funds", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF');
    expect(await factory._managers('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF')).to.equal(true);

    await factory.InventoryManagement('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF', 10);
    await expect(factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1)).to.be.revertedWith("Not enough funds");    
  });

  it("CustomerPurchase(OrderPurchase): manager cannot order resulting in fail", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF');
    expect(await factory._managers('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF')).to.equal(true);

    await factory.InventoryManagement('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF', 10);    
    await expect(factory.OrderPurchase('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF', 1, {
      value: ethers.utils.parseEther("1.0")
    })).to.be.revertedWith("Orderer should not be a manager");    
  });

  it("CustomerPurchase(OrderShip): manager ship resulting in success", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF');
    expect(await factory._managers('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF')).to.equal(true);

    await factory.InventoryManagement('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF', 10);
    await factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1, {
      value: ethers.utils.parseEther("1.0")
    });

    await factory.OrderShip();
    
    expect(await factory._shipedOrder(0)).to.equal('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48');
  });

  it("CustomerPurchase(OrderShip): customer ship resulting in fail", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF');
    expect(await factory._managers('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF')).to.equal(true);
    await factory._deleteManager('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(await factory._managers('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).to.equal(false);

    await factory.InventoryManagement('0x6a839285E5F86cF3ED0820a799EE84D4FF7656BF', 10);
    await factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1, {
      value: ethers.utils.parseEther("1.0")
    });

    await expect(factory.OrderShip()).to.be.revertedWith("Can only be shipped by manager");
  });
});
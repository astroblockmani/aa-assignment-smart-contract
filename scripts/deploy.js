const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const widgetsFactory = await hre.ethers.getContractFactory("WidgetsFactory");
  const widgetContract = await widgetsFactory.deploy();
  await widgetContract.deployed();

  console.log("Widgets Factory address: ", widgetContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
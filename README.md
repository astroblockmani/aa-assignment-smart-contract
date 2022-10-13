# ACME Widget Factory Assignment

Although I appreciate that deployment was not a requirement of the assignment, I have deployed to Goerli Testnet to demonstrate knowledge of deployment.

This can be found at https://goerli.etherscan.io/address/0x034FBf90dC93B152F2AD2Cee30d972Fe707ae2a7

Otherwise, for local deployment;

`npx hardhat compile`

`npx hardhat run ./scripts/deploy.js`

`npx hardhat test`

This should run the test cases.

In order to use local deployment with front end, MetaMask will need to be set up and point network to :8545.

Some notes, assumptions & further work (improvements);

- use dotenv to conceal environment variables. I'm unsure of the remit of these assignments and how far to take them and whether it's better to be completely explicit in my approach.
- created a deleteManager function, although outside of the remit of the assignment, I'd assume this would be needed in a real life environment which would likely have multiple managers(?). I could improve on this to offer a dashboard on the front end that allows for management.


# NFT1155 Smart Contract for Selling NFTs with Post-Mint Reveal Mechanic

This project implements a Solidity smart contract that allows the selling of NFTs using the NFT1155 standard. It also includes a Minting contract that sets the price of the NFTs in MATIC and handles the minting process. The contract has functionality to grant admin roles, allowing only designated accounts to deploy contracts or set the NFT prices.

## Features

- NFT1155 Contract:
  - Deploy and mint multiple types of NFTs.
  - Grant admin role to specific accounts.
  
- Minting Contract:
  - Link to the NFT1155 contract.
  - Set the price of NFTs in MATIC.
  - Allow users to purchase NFTs from the collection.
  - Restrict users to minting at most 1 NFT.
  - Reveal the metadata of the bought NFT after a specific date/time.
  - Withdraw funds collected through NFT purchases to a specific account.

## Optional DApp Web Features

A simple front-end page has been implemented to interact with the smart contracts. Users can authenticate using Metamask, pay in MATIC, and mint a random NFT. Once the metadata of the minted NFT is revealed, it is displayed on the page. Here, I set 10 days as reveal day.

## Tech Stack

- Solidity: The smart contract language used for development.
- Hardhat: The chosen framework for contract development and testing.
- Go-Ethereum: Used for testing the contracts on the Polygon testnet.
- React, MUI: Used for simple frontend of contract.

## Project Structure

- `contracts/`: Contains the Solidity smart contract files.
- `test/`: Includes unit tests for the smart contracts.
- `scripts/`: Includes deploy and verify for the smart contracts.
- `frontend/`: Holds the front-end code (optional feature).
- `README.md`: This file, providing an overview of the project.

## Deployment and Testing

To deploy and test the smart contracts, follow these steps:

1. Unzip file
2. Navigate to the project directory: `cd NFT1155_Contract_Test_Assignment`
3. Install the dependencies: `npm install`
4. Configure the deployment and testing parameters in the Hardhat configuration file (`hardhat.config.ts`) (already default set).
5. Deploy the contracts on the Polygon testnet: `npm run deploy`
6. Run the unit tests: `npm run test`

## Front-end Interface (Optional)

This is simple front-end of contract.

1. Navigate to the `frontend/` directory: `cd frontend`
2. Install the required dependencies: `npm install`
3. Start the development server: `npm start`
4. Access the DApp in your browser at `http://localhost:3000`.
5. First login in Metamask by clicking [connect wallet] button and click [mint] button
6. Before Reveal timestamp, question picture is displayed, after Reveal timestamp, token URI picture is displayed.

## Additional Materials

Please find the following additional materials included in the zip file:

- `.env`: The full Solidity smart contract environments settings for deployment.
- `README.md`: This README file providing instructions and explanations.
- `frontend/`: Front-end code.
- `frontend-view.wmv/`: Front-end execution video.

## Contact

If you have any questions or need further assistance, please feel free to reach out to us at [@chibayakuya@gmail.com]

I am really work in Crstonic company and will have destiny with company. 

Thank you!
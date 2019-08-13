const { Blockchain, Transaction } = require("./blockchain");

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('42fe442dd6cb4d8eebf09af79549cc72594148fcffe71c68448eadc0d6f4067a')
const myWalletAddress = myKey.getPublic('hex')

let fakeCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 15)
tx1.signTransaction(myKey);
fakeCoin.addTransaction(tx1)

// fakeCoin.createTransaction(new Transaction("address1", "address2", 20));
// fakeCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\n Starting the miner");
fakeCoin.minePendingTransaction(myWalletAddress);
// fakeCoin.minePendingTransaction("address3");

console.log(
  "\n Balance of myWalletAddress is ",
  fakeCoin.getBalanceOfAddress(myWalletAddress)
);

console.log('Is chain valid', fakeCoin.isChainValid())

fakeCoin.chain[1].transactions[0].amount = 1

console.log('Is chain valid', fakeCoin.isChainValid())


// console.log('Mining block 1...')
// fakeCoin.addBlock(new Block(1, "8/9/2019", { amount: 10 }));

// console.log('Mining block 2...')
// fakeCoin.addBlock(new Block(2, "8/10/2019", { amount: 15 }));

// fakeCoin.isChainValid();
// fakeCoin.chain[1].transactions = { amount: 100 };
// fakeCoin.chain[1].hash = fakeCoin.chain[1].calculateHash();
// fakeCoin.isChainValid();

// console.log(JSON.stringify(fakeCoin, null, 4));

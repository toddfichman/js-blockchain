const SHA256 = require("crypto-js/sha256");


class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}


class Block {
  constructor(timestamp, transactions, previousHash = "") {
    // transactions could include sender, revicer,
    // how much currency was transfered, ect
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // nonce is a number added to a hashed block that, when rehashed, meets the difficulty level restrictions
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    // making the hash of block start with certain amount
    // of '0's, depending on value of diffucutly.
    // This determines how long is takes to mine block
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = []; // holds all transactions that occur between mined blocks
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("8/8/2019", "Genesis Block", 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransaction(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty)

    console.log('Block successfully mined')
    this.chain.push(block);
    
    // resetting pendingTransactions and 
    // seding reward once this block has been mined
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount
        }

        if (transaction.toAddress === address) {
          balance += transaction.amount
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log("Invalid Chain");
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log("Invalid Chain");
        return false;
      }
    }
    console.log("Valid Chain");
    return true;
  }
}

let fakeCoin = new Blockchain();
fakeCoin.createTransaction(new Transaction('address1', 'address2', 20))
fakeCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log('\n Starting the miner')
fakeCoin.minePendingTransaction('address3')
fakeCoin.minePendingTransaction('address3')

console.log('\n Balance of address3 is ', fakeCoin.getBalanceOfAddress('address3'))

// console.log('Mining block 1...')
// fakeCoin.addBlock(new Block(1, "8/9/2019", { amount: 10 }));

// console.log('Mining block 2...')
// fakeCoin.addBlock(new Block(2, "8/10/2019", { amount: 15 }));

// fakeCoin.isChainValid();
// fakeCoin.chain[1].transactions = { amount: 100 };
// fakeCoin.chain[1].hash = fakeCoin.chain[1].calculateHash();
// fakeCoin.isChainValid();

// console.log(JSON.stringify(fakeCoin, null, 4));

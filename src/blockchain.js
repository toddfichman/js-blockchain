const SHA256 = require("crypto-js/sha256");

const EC = require('elliptic').ec;
// Create and initialize EC context
// (better do it once and reuse it)
const ec = new EC('secp256k1');


class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  // this hash will sign w/ private key
  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString()
  }

  // signingKey is the key obj from elliptic 
  // that has getPublic and getPriavte methods
  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets')
    }

    const hashTransaction = this.calculateHash();
    const signature = signingKey.sign(hashTransaction, 'base64');
    this.signature = signature.toDER('hex')
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if(!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction')
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
    return publicKey.verify(this.calculateHash(), this.signature)
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

  hasValidTransaction() {
    for(const transaction of this.transactions) {
      if (!transaction.isValid()) {
        return false
      }
    }
    return true;
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
    const rewardTransaction = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTransaction);

    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if(!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must have a to and from address')
    }

    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to the chain')
    }

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

      if(!currentBlock.hasValidTransaction()) {
        return false;
      }

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

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
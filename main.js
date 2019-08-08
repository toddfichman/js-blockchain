const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    // data could include sender, revicer, 
    // how much currency was transfered, ect
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "8/8/2019", "Genesis Block", 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('Invalid Chain')
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log('Invalid Chain')
        return false
      }
    }
    console.log('Valid Chain')
    return true
  }
}

let fakeCoin = new Blockchain();
fakeCoin.addBlock(new Block(1, "8/9/2019", { amount: 10 }));
fakeCoin.addBlock(new Block(2, "8/10/2019", { amount: 15 }));
fakeCoin.isChainValid();

fakeCoin.chain[1].data = {amount: 100}
fakeCoin.chain[1].hash = fakeCoin.chain[1].calculateHash()

fakeCoin.isChainValid();

// console.log(JSON.stringify(fakeCoin, null, 4));

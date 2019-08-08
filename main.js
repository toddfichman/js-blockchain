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
    this.nonce = 0; // nonce is a number added to a hashed block that, when rehashed, meets the difficulty level restrictions
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    // making the hash of block start with certain amount
    // of '0's, depending on value of diffucutly.
    // This determines how long is takes to mine block
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('Block mined: ' + this.hash)
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5;
  }

  createGenesisBlock() {
    return new Block(0, "8/8/2019", "Genesis Block", 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock);
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
console.log('Mining block 1...')
fakeCoin.addBlock(new Block(1, "8/9/2019", { amount: 10 }));

console.log('Mining block 2...')
fakeCoin.addBlock(new Block(2, "8/10/2019", { amount: 15 }));



// fakeCoin.isChainValid();
// fakeCoin.chain[1].data = { amount: 100 };
// fakeCoin.chain[1].hash = fakeCoin.chain[1].calculateHash();
// fakeCoin.isChainValid();

// console.log(JSON.stringify(fakeCoin, null, 4));

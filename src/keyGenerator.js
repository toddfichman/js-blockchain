const EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
const ec = new EC('secp256k1');
 
// Generate keys
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex')
const privekey = key.getPrivate('hex')

console.log('Private key: ' + privekey + '\n')
console.log('Public key: ' + publicKey)

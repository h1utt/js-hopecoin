const { Blockchain, Transaction, Block } = require("./blockchain")
const EC = require("elliptic").ec
const ec = new EC("secp256k1")

const myKey = ec.keyFromPrivate("638a23a5792b8eb9c23258b8bbfc2b18fd3af3d376d6b5e59a0a7575625e29")
const myWalletAddress = myKey.getPublic("hex")

let hopeCoin = new Blockchain()

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10)
tx1.signTransaction(myKey)
hopeCoin.addTransaction(tx1)

console.log(`\nStarting the miner...`)
hopeCoin.minePendingTransctions(myWalletAddress)

console.log(`\nBalance of miner is`, hopeCoin.getBalanceOfAddress(myWalletAddress))

hopeCoin.chain[1].transactions[0].amount = 1

console.log("Is chain valid?", hopeCoin.isChainValid())

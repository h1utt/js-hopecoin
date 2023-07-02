// Creating a blockchain
const SHA256 = require("crypto-js/sha256")

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = "") {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return SHA256(
            this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
        ).toString()
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash()
        }
        console.log("Block mined: " + this.hash)
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransactions = []
        this.miningReward = 100
    }

    createGenesisBlock() {
        return new Block("01/06/2023", "Genesis block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransctions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions)
        block.mineBlock(this.difficulty)

        console.log("Block successfully mined!")
        this.chain.push(block)

        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)]
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address) {
        let balance = 0

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount
                }
                if (trans.toAddress === address) {
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }
        return true
    }
}

let hopeCoin = new Blockchain()
hopeCoin.createTransaction(new Transaction("address1", "address2", 100))
hopeCoin.createTransaction(new Transaction("address1", "address1", 50))

console.log(`\nStarting the miner...`)
hopeCoin.minePendingTransctions("miner-address")

console.log(`\nBalance of miner is`, hopeCoin.getBalanceOfAddress("miner-address"))

console.log(`\nStarting the miner again...`)
hopeCoin.minePendingTransctions("miner-address")

console.log(`\nBalance of miner is`, hopeCoin.getBalanceOfAddress("miner-address"))


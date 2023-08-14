import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {

  const [blockNumber, setBlockNumber] = useState('17910164');
  const [block, setBlock] = useState(null);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }
    getBlockNumber();
    async function getBlock() {
      setBlock(await alchemy.core.getBlockWithTransactions())
    }
    getBlock();
  });

  const formatValue = (value) => {
    if (value.gt(Utils.parseEther('0.001'))) {
      return Utils.formatEther(value).slice(0, 6) + ' ether'
    }

    for (let unit of ["finney", "szabo", "gwei", "mwei", "kwei", "wei"]) {
      if (value.gt(Utils.parseUnits('1', unit))) {
        return Utils.formatUnits(value, unit) + ' ' + unit
      }
    }

    return Utils.formatUnits(value, 'wei') + ' wei';
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-4 bg-slate-100">
      <div className="w-full bg-white max-w-3xl rounded">
        <div className="w-full">
          <div className="text-xl p-4 border-b">Current block # {blockNumber}</div>
        </div>
        <div className="w-full p-4">
          <table className="w-full text-xm">
            <tbody>
              {block ? (
                <>
                  <tr>
                    <td className="border py-1 px-2">Hash</td>
                    <td className="border py-1 px-2" colSpan={3}>{block.hash}</td>
                  </tr>
                  <tr>
                    <td className="border py-1 px-2 whitespace-nowrap">Parent Hash</td>
                    <td className="border py-1 px-2" colSpan={3}>{block.parentHash}</td>
                  </tr>
                  <tr>
                    <td className="border py-1 px-2 whitespace-nowrap">Nonce</td>
                    <td className="border py-1 px-2">{block.nonce}</td>
                    <td className="border py-1 px-2 whitespace-nowrap">Time Stamp</td>
                    <td className="border py-1 px-2">{block.timestamp}</td>
                  </tr>
                  <tr>
                    <td className="border py-1 px-2 whitespace-nowrap">Difficulty</td>
                    <td className="border py-1 px-2">{block.difficulty}</td>
                    <td className="border py-1 px-2 whitespace-nowrap">Gas Limit</td>
                    <td className="border py-1 px-2">{block.gasLimit.toString()}</td>
                  </tr>
                  <tr>
                    <td className="border py-1 px-2 whitespace-nowrap">Gas Fee</td>
                    <td className="border py-1 px-2">{Utils.formatUnits(block.baseFeePerGas, 'gwei')} gwei</td>
                    <td className="border py-1 px-2 whitespace-nowrap">Gas Used</td>
                    <td className="border py-1 px-2">{block.gasUsed.toString()}</td>
                  </tr>
                  <tr>
                    <td className="border py-1 px-2 whitespace-nowrap">Miner</td>
                    <td className="border py-1 px-2" colSpan={3}>{block.miner}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td className="py-4 text-center"> Loading ...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {(block && block.transactions && block.transactions.length) && (
          <div className="w-full p-4">
            <table className="w-full text-xm">
              <thead>
                <tr>
                  <th className="border text-cnetr text-xl py-2" colSpan={4}>Transactions</th>
                </tr>
                <tr>
                  <th className="border">Hash</th>
                  <th className="border">From</th>
                  <th className="border">Value</th>
                  <th className="border">To</th>
                </tr>
              </thead>
              <tbody>
                {block.transactions.map(transaction => (
                  <tr key={transaction.transactionIndex}>
                    <td className="border whitespace-nowrap">{transaction.hash.slice(0, 6)}...{transaction.hash.slice(-4)}</td>
                    <td className="border whitespace-nowrap">{transaction.from.slice(0, 6)}...{transaction.from.slice(-4)}</td>
                    <td className="border whitespace-nowrap">{formatValue(transaction.value)}</td>
                    <td className="border whitespace-nowrap">{transaction.to ? transaction.to.slice(0, 6) : ''}...{transaction.to ? transaction.to.slice(-4) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

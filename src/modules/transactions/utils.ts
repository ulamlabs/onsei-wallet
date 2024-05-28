export function getTxEventQueries(address: string) {
  return [
    `message.sender='${address}'`, // sending most transactions, including smart contracts
    `transfer.recipient='${address}'`, // receiving token
    `wasm.to='${address}'`, // receiving CW20
  ];
}

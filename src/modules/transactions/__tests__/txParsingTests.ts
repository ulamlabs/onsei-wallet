import { parseTx } from "../parsing";

import astroportSwapTx from "./fixtures/astroportSwapTx.json";
import createDenomMetadataTx from "./fixtures/createDenomMetadataTx.json";
import noEventsTx from "./fixtures/noEventsTx.json";
import transferCw20Tx from "./fixtures/transferCw20Tx.json";
import transferIcs20Tx from "./fixtures/transferIcs20Tx.json";
import transferNativeTx from "./fixtures/transferNativeTx.json";
import transferSeiMultisendTx from "./fixtures/transferSeiMultisendTx.json";
import transferSeiTx from "./fixtures/transferSeiTx.json";

it("parse createDenomMetadataTx", () => {
  expect(parseTx(createDenomMetadataTx.tx_response)).toEqual({
    amount: 0n,
    token: "",
    timestamp: new Date("2024-05-16T09:56:03Z"),
    fee: 21740n,
    from: "",
    hash: "3E10693DDA076C33EB2303430C30C739940ADB3DEC15A9B4AB2D719BE4EDD507",
    status: "success",
    to: "",
    type: "MsgSetDenomMetadata",
    contract: "",
    contractAction: "",
    sender: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    memo: "",
    auth_info: {
      amount: [{ amount: "21740", denom: "usei" }],
    },
  });
});

it("parse transferSeiTx", () => {
  expect(parseTx(transferSeiTx.tx_response)).toEqual({
    timestamp: new Date("2024-05-24T12:26:10Z"),
    fee: 87017n,
    hash: "30EF7F34ECF094DBF73D6031C659AA2F15C7C32229DEA6DF39715BBC1D21FA3D",
    status: "success",
    type: "MsgSend",
    contract: "",
    contractAction: "",
    token: "usei",
    amount: 10000n,
    from: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    to: "sei1h90zjqlfvqm3q7d6fhsmstulhz7wllnj6up5n5",
    sender: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    memo: "test memo",
    auth_info: {
      amount: [{ amount: "87017", denom: "usei" }],
    },
  });
});

it("parse transferSeiMultisendTx", () => {
  expect(parseTx(transferSeiMultisendTx.tx_response)).toEqual({
    timestamp: new Date("2024-05-24T13:07:46Z"),
    fee: 87753n,
    hash: "F87CA38A0320FE45E74A97A442569C1CC7ABFB28EB14E3A931A10DEBD600B6E4",
    status: "success",
    type: "MsgMultiSend",
    contract: "",
    contractAction: "",
    token: "usei",
    amount: 5000000n,
    from: "",
    to: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    sender: "sei1qhu8qamnlql3c3gfv985xs255fr208qs987qzh",
    memo: "",
    auth_info: {
      amount: [{ amount: "87753", denom: "usei" }],
    },
  });
});

it("parse transferNativeTx", () => {
  expect(parseTx(transferNativeTx.tx_response)).toEqual({
    timestamp: new Date("2024-05-24T12:25:16Z"),
    fee: 94282n,
    hash: "FA546FC8324F53A5B6A7B48311FBDB4A994DBC42D2AE8E001AB8198C6CE25186",
    status: "success",
    type: "MsgSend",
    contract: "",
    contractAction: "",
    token: "factory/sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y/LLAMA",
    amount: 15n,
    from: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    to: "sei1h90zjqlfvqm3q7d6fhsmstulhz7wllnj6up5n5",
    sender: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    memo: "",
    auth_info: {
      amount: [{ amount: "94282", denom: "usei" }],
    },
  });
});

it("parse transferCw20Tx", () => {
  expect(parseTx(transferCw20Tx.tx_response)).toEqual({
    timestamp: new Date("2024-05-24T12:18:51Z"),
    fee: 152889n,
    hash: "EDE6501BB685B2B71347B2DD540FB55A51ACD4BE37A99E47390FB491414C64D7",
    status: "success",
    type: "MsgExecuteContract",
    contract: "sei1ctwaptjnwkx863sgsge4lq44rf0dkxr02px9z8vtptwsnj7w0cxqd6tyht",
    contractAction: "transfer",
    token: "sei1ctwaptjnwkx863sgsge4lq44rf0dkxr02px9z8vtptwsnj7w0cxqd6tyht",
    amount: 5000000n,
    from: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    to: "sei1h90zjqlfvqm3q7d6fhsmstulhz7wllnj6up5n5",
    sender: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    memo: "",
    auth_info: {
      amount: [{ amount: "152889", denom: "usei" }],
    },
  });
});

it("parse transferIcs20Tx", () => {
  expect(parseTx(transferIcs20Tx.tx_response)).toEqual({
    timestamp: new Date("2024-05-24T12:27:52Z"),
    fee: 94627n,
    hash: "E82207A25B682CCAB1445986FC88556A1185C3797BFE1BA9932B20027E88E872",
    status: "success",
    type: "MsgSend",
    contract: "",
    contractAction: "",
    token:
      "ibc/6CDD4663F2F09CD62285E2D45891FC149A3568E316CE3EBBE201A71A78A69388",
    amount: 100n,
    from: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    to: "sei1h90zjqlfvqm3q7d6fhsmstulhz7wllnj6up5n5",
    sender: "sei14y5ar52zcg0jxencdxpqf65kld33m70fr3wf7y",
    memo: "",
    auth_info: {
      amount: [{ amount: "94627", denom: "usei" }],
    },
  });
});

it("parse astroportSwapTx", () => {
  expect(parseTx(astroportSwapTx.tx_response)).toEqual({
    timestamp: new Date("2024-05-24T12:25:50Z"),
    fee: 781174n,
    hash: "A78922D7DD2EA124E488024FFEEC6CA5DB92B4F4AD0D9E1E585CD7EAC2F0F13A",
    status: "success",
    type: "MsgExecuteContract",
    contract: "sei1ltr0r989uds8y0gahfl6uqec5rqulks06fyugpre0syml8ul0jtsjgv69c",
    contractAction: "swap",
    token: "",
    amount: 0n,
    from: "",
    to: "",
    sender: "sei1f8se40xdwnaaj66hsndt2ch8ppusah4yuw8s9p",
    memo: "",
    auth_info: {
      amount: [{ amount: "781174", denom: "usei" }],
    },
  });
});

it("parse noEventsTx", () => {
  expect(parseTx(noEventsTx.tx_response)).toEqual({
    timestamp: new Date("2024-05-24T12:26:10Z"),
    fee: 87017n,
    hash: "30EF7F34ECF094DBF73D6031C659AA2F15C7C32229DEA6DF39715BBC1D21FA3D",
    status: "success",
    type: "",
    contract: "",
    contractAction: "",
    token: "",
    amount: 0n,
    from: "",
    to: "",
    sender: "",
    memo: "",
    auth_info: {
      amount: [{ amount: "87017", denom: "usei" }],
    },
  });
});

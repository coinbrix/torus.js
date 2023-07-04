import { TORUS_LEGACY_NETWORK } from "@toruslabs/constants";
import NodeManager from "@toruslabs/fetch-node-details";
import BN from "bn.js";
import { expect } from "chai";
import faker from "faker";

import { keccak256 } from "../src";
import TorusUtils from "../src/torus";
import { generateIdToken } from "./helpers";

const TORUS_TEST_EMAIL = "hello@tor.us";
const TORUS_TEST_VERIFIER = "torus-test-health";
const TORUS_TEST_AGGREGATE_VERIFIER = "torus-test-health-aggregate";

describe("torus utils cyan", function () {
  let torus: TorusUtils;
  let TORUS_NODE_MANAGER: NodeManager;

  beforeEach("one time execution before all tests", async function () {
    torus = new TorusUtils({
      // signerHost: "https://signer-polygon.tor.us/api/sign",
      allowHost: "https://signer-polygon.tor.us/api/allow",
      network: "cyan",
      clientId: "YOUR_CLIENT_ID",
    });
    TORUS_NODE_MANAGER = new NodeManager({ network: TORUS_LEGACY_NETWORK.CYAN });
  });
  it("should fetch public address", async function () {
    const verifier = "tkey-google-cyan"; // any verifier
    const verifierDetails = { verifier, verifierId: TORUS_TEST_EMAIL };
    const { torusNodeEndpoints, torusNodePub } = await TORUS_NODE_MANAGER.getNodeDetails(verifierDetails);
    const result = await torus.getPublicAddress(torusNodeEndpoints, torusNodePub, verifierDetails);
    expect(result.finalPubKeyData.evmAddress).to.equal("0xA3767911A84bE6907f26C572bc89426dDdDB2825");
    expect(result).eql({
      oAuthPubKeyData: {
        evmAddress: "0xA3767911A84bE6907f26C572bc89426dDdDB2825",
        x: "2853f323437da98ce021d06854f4b292db433c0ad03b204ef223ac2583609a6a",
        y: "f026b4788e23523e0c8fcbf0bdcf1c1a62c9cde8f56170309607a7a52a19f7c1",
      },
      finalPubKeyData: {
        evmAddress: "0xA3767911A84bE6907f26C572bc89426dDdDB2825",
        x: "2853f323437da98ce021d06854f4b292db433c0ad03b204ef223ac2583609a6a",
        y: "f026b4788e23523e0c8fcbf0bdcf1c1a62c9cde8f56170309607a7a52a19f7c1",
      },
      metadata: {
        pubNonce: undefined,
        nonce: new BN(0),
        upgraded: false,
        typeOfUser: "v1",
      },
      nodesData: { nodeIndexes: [] },
    });
  });

  it("should fetch user type and public address", async function () {
    const verifier = "tkey-google-cyan"; // any verifier
    const verifierDetails = { verifier, verifierId: TORUS_TEST_EMAIL };
    const { torusNodeEndpoints, torusNodePub } = await TORUS_NODE_MANAGER.getNodeDetails(verifierDetails);
    const result1 = await torus.getUserTypeAndAddress(torusNodeEndpoints, torusNodePub, verifierDetails);
    expect(result1.finalPubKeyData.evmAddress).to.equal("0xA3767911A84bE6907f26C572bc89426dDdDB2825");
    expect(result1.metadata.typeOfUser).to.equal("v1");
    expect(result1).eql({
      oAuthPubKeyData: {
        evmAddress: "0xA3767911A84bE6907f26C572bc89426dDdDB2825",
        x: "2853f323437da98ce021d06854f4b292db433c0ad03b204ef223ac2583609a6a",
        y: "f026b4788e23523e0c8fcbf0bdcf1c1a62c9cde8f56170309607a7a52a19f7c1",
      },
      finalPubKeyData: {
        evmAddress: "0xA3767911A84bE6907f26C572bc89426dDdDB2825",
        x: "2853f323437da98ce021d06854f4b292db433c0ad03b204ef223ac2583609a6a",
        y: "f026b4788e23523e0c8fcbf0bdcf1c1a62c9cde8f56170309607a7a52a19f7c1",
      },
      metadata: {
        pubNonce: undefined,
        nonce: new BN(0),
        upgraded: false,
        typeOfUser: "v1",
      },
      nodesData: { nodeIndexes: [] },
    });

    const v2Verifier = "tkey-google-cyan";
    // 1/1 user
    const v2TestEmail = "somev2user@gmail.com";
    const result2 = await torus.getUserTypeAndAddress(torusNodeEndpoints, torusNodePub, {
      verifier: v2Verifier,
      verifierId: v2TestEmail,
    });
    expect(result2.finalPubKeyData.evmAddress).to.equal("0x8EA83Ace86EB414747F2b23f03C38A34E0217814");
    expect(result2.metadata.typeOfUser).to.equal("v2");
    expect(result2).eql({
      oAuthPubKeyData: {
        evmAddress: "0x29446f428293a4E6470AEaEDa6EAfA0F842EF54e",
        x: "8b6f2048aba8c7833e3b02c5b6522bb18c484ad0025156e428f17fb8d8c34021",
        y: "cd9ba153ff89d665f655d1be4c6912f3ff93996e6fe580d89e78bf1476fef2aa",
      },
      finalPubKeyData: {
        evmAddress: "0x8EA83Ace86EB414747F2b23f03C38A34E0217814",
        x: "cbe7b0f0332e5583c410fcacb6d4ff685bec053cfd943ac75f5e4aa3278a6fbb",
        y: "b525c463f438c7a3c4b018c8c5d16c9ef33b9ac6f319140a22b48b17bdf532dd",
      },
      metadata: {
        pubNonce: {
          x: "da0039dd481e140090bed9e777ce16c0c4a16f30f47e8b08b73ac77737dd2d4",
          y: "7fecffd2910fa47dbdbc989f5c119a668fc922937175974953cbb51c49268265",
        },
        nonce: new BN(0),
        upgraded: false,
        typeOfUser: "v2",
      },
      nodesData: { nodeIndexes: [] },
    });
    // 2/n user
    const v2nTestEmail = "caspertorus@gmail.com";
    const result3 = await torus.getUserTypeAndAddress(torusNodeEndpoints, torusNodePub, {
      verifier: v2Verifier,
      verifierId: v2nTestEmail,
    });
    expect(result3.finalPubKeyData.evmAddress).to.equal("0xCC1f953f6972a9e3d685d260399D6B85E2117561");
    expect(result3.metadata.typeOfUser).to.equal("v2");
    expect(result3).eql({
      oAuthPubKeyData: {
        evmAddress: "0xe8a19482cbe5FaC896A5860Ca4156fb999DDc73b",
        x: "c491ba39155594896b27cf71a804ccf493289d918f40e6ba4d590f1c76139e9e",
        y: "d4649ed9e46461e1af00399a4c65fabb1dc219b3f4af501a7d635c17f57ab553",
      },
      finalPubKeyData: {
        evmAddress: "0xCC1f953f6972a9e3d685d260399D6B85E2117561",
        x: "8d784434becaad9b23d9293d1f29c4429447315c4cac824cbf2eb21d3f7d79c8",
        y: "fe46a0ef5efe33d16f6cfa678a597be930fbec5432cbb7f3580189c18bd7e157",
      },
      metadata: {
        pubNonce: {
          x: "50e250cc6ac1d50d32d2b0f85f11c6625a917a115ced4ef24f4eac183e1525c7",
          y: "8067a52d02b8214bf82e91b66ce5009f674f4c3998b103059c46c386d0c17f90",
        },
        nonce: new BN(0),
        upgraded: false,
        typeOfUser: "v2",
      },
      nodesData: { nodeIndexes: [] },
    });
  });

  it("should be able to key assign", async function () {
    const verifier = "tkey-google-cyan"; // any verifier
    const email = faker.internet.email();
    const verifierDetails = { verifier, verifierId: email };
    const { torusNodeEndpoints, torusNodePub } = await TORUS_NODE_MANAGER.getNodeDetails(verifierDetails);
    const { finalPubKeyData, oAuthPubKeyData, metadata } = await torus.getPublicAddress(torusNodeEndpoints, torusNodePub, verifierDetails);
    expect(finalPubKeyData.evmAddress).to.not.equal("");
    expect(finalPubKeyData.evmAddress).to.not.equal(null);
    expect(oAuthPubKeyData.evmAddress).to.not.equal("");
    expect(oAuthPubKeyData.evmAddress).to.not.equal(null);
    expect(metadata.typeOfUser).to.equal("v1");
    expect(metadata.upgraded).to.equal(false);
  });

  it("should be able to login", async function () {
    const token = generateIdToken(TORUS_TEST_EMAIL, "ES256");
    const verifierDetails = { verifier: TORUS_TEST_VERIFIER, verifierId: TORUS_TEST_EMAIL };
    const { torusNodeEndpoints, torusIndexes } = await TORUS_NODE_MANAGER.getNodeDetails(verifierDetails);
    const result = await torus.retrieveShares(torusNodeEndpoints, torusIndexes, TORUS_TEST_VERIFIER, { verifier_id: TORUS_TEST_EMAIL }, token);
    expect(result.finalKeyData.privKey).to.be.equal("1e0c955d73e73558f46521da55cc66de7b8fcb56c5b24e851616849b6a1278c8");
    expect(result).eql({
      finalKeyData: {
        evmAddress: "0x0b6DB33d8F0A2b47B802845ABc65BB0D9CA287D1",
        X: "50867735990590650825986678207784558058703777081079233752705274413018909339153",
        Y: "67047321934048669297167101107494432621754670744245489707041940312227332527294",
        privKey: "1e0c955d73e73558f46521da55cc66de7b8fcb56c5b24e851616849b6a1278c8",
      },
      oAuthKeyData: {
        evmAddress: "0x8AA6C8ddCD868873120aA265Fc63E3a2180375BA",
        X: "35739417e3be1b1e56cdf8c509d8dee5412712514b18df1bc961ac6465a0c949",
        Y: "887497602e62ced686eb99eaa0020b0c0d705cad96eafeec2dd1bbfb6a9d42c2",
        privKey: "1e0c955d73e73558f46521da55cc66de7b8fcb56c5b24e851616849b6a1278c8",
      },
      sessionData: { sessionTokenData: [], sessionAuthKey: "" },
      metadata: { pubNonce: undefined, nonce: new BN(0), typeOfUser: "v1", upgraded: null },
      nodesData: { nodeIndexes: [] },
    });
  });

  it("should be able to aggregate login", async function () {
    const idToken = generateIdToken(TORUS_TEST_EMAIL, "ES256");
    const hashedIdToken = keccak256(Buffer.from(idToken, "utf8"));
    const verifierDetails = { verifier: TORUS_TEST_AGGREGATE_VERIFIER, verifierId: TORUS_TEST_EMAIL };
    const { torusNodeEndpoints, torusIndexes } = await TORUS_NODE_MANAGER.getNodeDetails(verifierDetails);
    const result = await torus.retrieveShares(
      torusNodeEndpoints,
      torusIndexes,
      TORUS_TEST_AGGREGATE_VERIFIER,
      {
        verify_params: [{ verifier_id: TORUS_TEST_EMAIL, idtoken: idToken }],
        sub_verifier_ids: [TORUS_TEST_VERIFIER],
        verifier_id: TORUS_TEST_EMAIL,
      },
      hashedIdToken.substring(2)
    );

    expect(result.oAuthKeyData.evmAddress).to.be.equal("0x34117FDFEFBf1ad2DFA6d4c43804E6C710a6fB04");
    expect(result.finalKeyData.evmAddress).to.be.equal("0xD10F46947f693A6Bf141a014FB98Fd098353Dbd9");
    expect(result).eql({
      finalKeyData: {
        evmAddress: "0xD10F46947f693A6Bf141a014FB98Fd098353Dbd9",
        X: "64201800157983909861269393755427755617091903692160691735745245668626073125014",
        Y: "97059606175845927312559999719544608745140123184872684648625895866431249911982",
        privKey: "45a5b62c4ff5490baa75d33bf4f03ba6c5b0095678b0f4055312eef7b780b7bf",
      },
      oAuthKeyData: {
        evmAddress: "0x34117FDFEFBf1ad2DFA6d4c43804E6C710a6fB04",
        X: "afd12f2476006ef6aa8778190b29676a70039df8688f9dee69c779bdc8ff0223",
        Y: "e557a5ee879632727f5979d6b9cea69d87e3dab54a8c1b6685d86dfbfcd785dd",
        privKey: "45a5b62c4ff5490baa75d33bf4f03ba6c5b0095678b0f4055312eef7b780b7bf",
      },
      sessionData: { sessionTokenData: [], sessionAuthKey: "" },
      metadata: { pubNonce: undefined, nonce: new BN(0), typeOfUser: "v1", upgraded: null },
      nodesData: { nodeIndexes: [] },
    });
  });
});

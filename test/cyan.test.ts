import { TORUS_LEGACY_NETWORK } from "@toruslabs/constants";
import NodeManager from "@toruslabs/fetch-node-details";
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
    const { finalPubKeyData } = await torus.getPublicAddress(torusNodeEndpoints, torusNodePub, verifierDetails);
    expect(finalPubKeyData.evmAddress).to.equal("0xA3767911A84bE6907f26C572bc89426dDdDB2825");
  });

  it("should fetch user type and public address", async function () {
    const verifier = "tkey-google-cyan"; // any verifier
    const verifierDetails = { verifier, verifierId: TORUS_TEST_EMAIL };
    const { torusNodeEndpoints, torusNodePub } = await TORUS_NODE_MANAGER.getNodeDetails(verifierDetails);
    const { finalPubKeyData, metadata } = await torus.getUserTypeAndAddress(torusNodeEndpoints, torusNodePub, verifierDetails);
    expect(finalPubKeyData.evmAddress).to.equal("0xA3767911A84bE6907f26C572bc89426dDdDB2825");
    expect(metadata.typeOfUser).to.equal("v1");

    const v2Verifier = "tkey-google-cyan";
    // 1/1 user
    const v2TestEmail = "somev2user@gmail.com";
    const { finalPubKeyData: finalPubKeyData1, metadata: metadata1 } = await torus.getUserTypeAndAddress(torusNodeEndpoints, torusNodePub, {
      verifier: v2Verifier,
      verifierId: v2TestEmail,
    });
    expect(finalPubKeyData1.evmAddress).to.equal("0x8EA83Ace86EB414747F2b23f03C38A34E0217814");
    expect(metadata1.typeOfUser).to.equal("v2");

    // 2/n user
    const v2nTestEmail = "caspertorus@gmail.com";
    const { finalPubKeyData: finalPubKeyData2, metadata: metadata2 } = await torus.getUserTypeAndAddress(torusNodeEndpoints, torusNodePub, {
      verifier: v2Verifier,
      verifierId: v2nTestEmail,
    });
    expect(finalPubKeyData2.evmAddress).to.equal("0xCC1f953f6972a9e3d685d260399D6B85E2117561");
    expect(metadata2.typeOfUser).to.equal("v2");
  });

  it("should be able to key assign", async function () {
    const verifier = "tkey-google-cyan"; // any verifier
    const email = faker.internet.email();
    const verifierDetails = { verifier, verifierId: email };
    const { torusNodeEndpoints, torusNodePub } = await TORUS_NODE_MANAGER.getNodeDetails(verifierDetails);
    const { finalPubKeyData } = await torus.getPublicAddress(torusNodeEndpoints, torusNodePub, verifierDetails);
    expect(finalPubKeyData.evmAddress).to.not.equal("");
    expect(finalPubKeyData.evmAddress).to.not.equal(null);
  });

  it("should be able to login", async function () {
    const token = generateIdToken(TORUS_TEST_EMAIL, "ES256");
    const verifierDetails = { verifier: TORUS_TEST_VERIFIER, verifierId: TORUS_TEST_EMAIL };
    const { torusNodeEndpoints, torusIndexes } = await TORUS_NODE_MANAGER.getNodeDetails(verifierDetails);
    const { finalKeyData } = await torus.retrieveShares(
      torusNodeEndpoints,
      torusIndexes,
      TORUS_TEST_VERIFIER,
      { verifier_id: TORUS_TEST_EMAIL },
      token
    );
    expect(finalKeyData.privKey).to.be.equal("1e0c955d73e73558f46521da55cc66de7b8fcb56c5b24e851616849b6a1278c8");
  });

  it("should be able to aggregate login", async function () {
    const idToken = generateIdToken(TORUS_TEST_EMAIL, "ES256");
    const hashedIdToken = keccak256(Buffer.from(idToken, "utf8"));
    const verifierDetails = { verifier: TORUS_TEST_AGGREGATE_VERIFIER, verifierId: TORUS_TEST_EMAIL };
    const { torusNodeEndpoints, torusIndexes } = await TORUS_NODE_MANAGER.getNodeDetails(verifierDetails);
    const { finalKeyData, oAuthKeyData } = await torus.retrieveShares(
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

    expect(oAuthKeyData.evmAddress).to.be.equal("0x34117FDFEFBf1ad2DFA6d4c43804E6C710a6fB04");
    expect(finalKeyData.evmAddress).to.be.equal("0xD10F46947f693A6Bf141a014FB98Fd098353Dbd9");
  });
});

import { time } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";

import { PrivateVoting, PrivateVoting__factory } from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const title = "Best Zama feature?";
  const options = ["Encrypted balances", "Private voting", "Blind auctions"];
  const startTime = BigInt((await time.latest()) + 10);
  const endTime = startTime + 3600n;

  const factory = (await ethers.getContractFactory("PrivateVoting")) as PrivateVoting__factory;
  const privateVoting = (await factory.deploy(title, options, startTime, endTime)) as PrivateVoting;
  const privateVotingAddress = await privateVoting.getAddress();

  return { privateVoting, privateVotingAddress, title, options, startTime, endTime };
}

describe("PrivateVoting", function () {
  let signers: Signers;

  before(async function () {
    const ethSigners = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      alice: ethSigners[1],
      bob: ethSigners[2],
    };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This test suite is intended for the local fhevm mock environment.");
      this.skip();
    }
  });

  it("stores public metadata on deployment", async function () {
    const { privateVoting, title, options, startTime, endTime } = await deployFixture();

    expect(await privateVoting.title()).to.eq(title);
    expect(await privateVoting.optionCount()).to.eq(options.length);
    expect(await privateVoting.getOptions()).to.deep.eq(options);
    expect(await privateVoting.startTime()).to.eq(startTime);
    expect(await privateVoting.endTime()).to.eq(endTime);
    expect(await privateVoting.resultsPublished()).to.eq(false);
  });

  it("rejects votes before the voting window starts", async function () {
    const { privateVoting, privateVotingAddress } = await deployFixture();
    const encryptedVote = await fhevm
      .createEncryptedInput(privateVotingAddress, signers.alice.address)
      .add8(1)
      .encrypt();

    await expect(
      privateVoting.connect(signers.alice).vote(encryptedVote.handles[0], encryptedVote.inputProof),
    ).to.be.revertedWithCustomError(privateVoting, "VotingNotStarted");
  });

  it("records encrypted votes and reveals tallies after publication", async function () {
    const { privateVoting, privateVotingAddress, startTime, endTime } = await deployFixture();

    await time.increaseTo(Number(startTime) + 1);

    const aliceVote = await fhevm
      .createEncryptedInput(privateVotingAddress, signers.alice.address)
      .add8(1)
      .encrypt();
    const bobVote = await fhevm
      .createEncryptedInput(privateVotingAddress, signers.bob.address)
      .add8(0)
      .encrypt();

    await (await privateVoting.connect(signers.alice).vote(aliceVote.handles[0], aliceVote.inputProof)).wait();
    await (await privateVoting.connect(signers.bob).vote(bobVote.handles[0], bobVote.inputProof)).wait();

    expect(await privateVoting.hasVoted(signers.alice.address)).to.eq(true);
    expect(await privateVoting.hasVoted(signers.bob.address)).to.eq(true);

    await time.increaseTo(Number(endTime) + 1);
    await (await privateVoting.publishResults()).wait();
    await (await privateVoting.grantResultAccess(signers.alice.address)).wait();

    const encryptedTally0 = await privateVoting.getEncryptedTally(0);
    const encryptedTally1 = await privateVoting.getEncryptedTally(1);
    const encryptedTally2 = await privateVoting.getEncryptedTally(2);

    const tally0 = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedTally0,
      privateVotingAddress,
      signers.alice,
    );
    const tally1 = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedTally1,
      privateVotingAddress,
      signers.alice,
    );
    const tally2 = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedTally2,
      privateVotingAddress,
      signers.alice,
    );

    expect(tally0).to.eq(1);
    expect(tally1).to.eq(1);
    expect(tally2).to.eq(0);
  });

  it("prevents duplicate voting", async function () {
    const { privateVoting, privateVotingAddress, startTime } = await deployFixture();
    await time.increaseTo(Number(startTime) + 1);

    const encryptedVote = await fhevm
      .createEncryptedInput(privateVotingAddress, signers.alice.address)
      .add8(2)
      .encrypt();

    await (await privateVoting.connect(signers.alice).vote(encryptedVote.handles[0], encryptedVote.inputProof)).wait();

    await expect(
      privateVoting.connect(signers.alice).vote(encryptedVote.handles[0], encryptedVote.inputProof),
    ).to.be.revertedWithCustomError(privateVoting, "AlreadyVoted");
  });

  it("does not expose encrypted tallies before publication", async function () {
    const { privateVoting } = await deployFixture();

    await expect(privateVoting.getEncryptedTally(0)).to.be.revertedWithCustomError(privateVoting, "ResultsUnavailable");
  });
});

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const DEFAULT_TITLE = "Private Voting Demo";
const DEFAULT_OPTIONS = ["Option A", "Option B", "Option C"];
const DEFAULT_DURATION_SECONDS = 24 * 60 * 60;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const latestBlock = await hre.ethers.provider.getBlock("latest");
  const startTime = BigInt((latestBlock?.timestamp ?? Math.floor(Date.now() / 1000)) + 60);
  const endTime = startTime + BigInt(DEFAULT_DURATION_SECONDS);

  const deployment = await deploy("PrivateVoting", {
    args: [DEFAULT_TITLE, DEFAULT_OPTIONS, startTime, endTime],
    from: deployer,
    log: true,
  });

  console.log("PrivateVoting contract:", deployment.address);
  console.log("Start time:", startTime.toString());
  console.log("End time:", endTime.toString());
};

export default func;
func.id = "deploy_private_voting";
func.tags = ["PrivateVoting"];

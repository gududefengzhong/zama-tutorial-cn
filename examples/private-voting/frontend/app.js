import { BrowserProvider, Contract } from "../node_modules/ethers/lib.esm/index.js";

const ABI = [
  "function owner() view returns (address)",
  "function title() view returns (string)",
  "function startTime() view returns (uint64)",
  "function endTime() view returns (uint64)",
  "function resultsPublished() view returns (bool)",
  "function getOptions() view returns (string[])",
  "function hasVoted(address voter) view returns (bool)",
  "function getEncryptedTally(uint8 optionIndex) view returns (bytes32)",
  "function vote(bytes32 encryptedOption, bytes inputProof)",
  "function publishResults()",
  "function grantResultAccess(address viewer)",
];

const DEFAULT_CHAIN_ID = 31337;
const PHASE_LABELS = {
  before_start: "尚未开始",
  live: "投票进行中",
  ended: "投票已结束，结果待发布",
  results_published: "结果已发布",
};

const els = {
  connectWallet: document.getElementById("connect-wallet"),
  refreshButton: document.getElementById("refresh-button"),
  publishResults: document.getElementById("publish-results"),
  grantAccess: document.getElementById("grant-access"),
  decryptResults: document.getElementById("decrypt-results"),
  contractAddress: document.getElementById("contract-address"),
  voteOption: document.getElementById("vote-option"),
  submitEncryptedVote: document.getElementById("submit-encrypted-vote"),
  walletAddress: document.getElementById("wallet-address"),
  chainId: document.getElementById("chain-id"),
  recommendedChain: document.getElementById("recommended-chain"),
  networkStatus: document.getElementById("network-status"),
  phaseBadge: document.getElementById("phase-badge"),
  voteTitle: document.getElementById("vote-title"),
  startTime: document.getElementById("start-time"),
  endTime: document.getElementById("end-time"),
  resultsStatus: document.getElementById("results-status"),
  hasVoted: document.getElementById("has-voted"),
  ownerAddress: document.getElementById("owner-address"),
  optionsContainer: document.getElementById("options-container"),
  decryptedResults: document.getElementById("decrypted-results"),
  statusLine: document.getElementById("status-line"),
  statusMessage: document.getElementById("status-message"),
};

const state = {
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  snapshot: null,
  relayerModule: null,
  relayerInstance: null,
};

els.recommendedChain.textContent = String(DEFAULT_CHAIN_ID);

function getEthereum() {
  return window.ethereum ?? null;
}

function setStatus(message, tone = "idle") {
  els.statusLine.className = `status-line status-${tone}`;
  els.statusMessage.textContent = message;
}

function formatTimestamp(value) {
  return new Date(Number(value) * 1000).toLocaleString("zh-CN", { hour12: false });
}

function getPhase(snapshot) {
  const now = Math.floor(Date.now() / 1000);
  const start = Number(snapshot.startTime);
  const end = Number(snapshot.endTime);

  if (now < start) {
    return "before_start";
  }
  if (now >= end && snapshot.resultsPublished) {
    return "results_published";
  }
  if (now >= end) {
    return "ended";
  }
  return "live";
}

function clearSnapshot() {
  els.phaseBadge.textContent = "等待读取";
  els.voteTitle.textContent = "-";
  els.startTime.textContent = "-";
  els.endTime.textContent = "-";
  els.resultsStatus.textContent = "-";
  els.hasVoted.textContent = "-";
  els.ownerAddress.textContent = "-";
  els.optionsContainer.innerHTML = `
    <div class="option-card empty-state-card">
      <span class="option-index">等待读取</span>
      <strong>连接钱包并读取合约后显示候选项</strong>
    </div>
  `;
  els.voteOption.innerHTML = `<option value="">请先读取候选项</option>`;
  els.voteOption.disabled = true;
  els.submitEncryptedVote.disabled = true;
  els.publishResults.disabled = true;
  els.grantAccess.disabled = true;
  els.decryptResults.disabled = true;
  els.decryptedResults.innerHTML = `
    <div class="result-card">
      <span class="detail-label">等待结果</span>
      <strong>结果发布并授权后，这里会显示解密票数。</strong>
    </div>
  `;
}

function renderSnapshot(snapshot) {
  const phase = getPhase(snapshot);
  const isOwner = state.account && snapshot.owner.toLowerCase() === state.account.toLowerCase();
  const isSepolia = state.chainId === 11155111;

  els.phaseBadge.textContent = PHASE_LABELS[phase];
  els.voteTitle.textContent = snapshot.title;
  els.startTime.textContent = formatTimestamp(snapshot.startTime);
  els.endTime.textContent = formatTimestamp(snapshot.endTime);
  els.resultsStatus.textContent = snapshot.resultsPublished ? "已发布" : "未发布";
  els.hasVoted.textContent = snapshot.hasConnectedWalletVoted ? "已投票" : "未投票 / 未连接";
  els.ownerAddress.textContent = snapshot.owner;
  els.optionsContainer.innerHTML = snapshot.options
    .map(
      (option, index) => `
        <div class="option-card">
          <span class="option-index">选项 ${index + 1}</span>
          <strong>${option}</strong>
        </div>
      `,
    )
    .join("");
  els.voteOption.innerHTML = snapshot.options
    .map((option, index) => `<option value="${index}">${index + 1}. ${option}</option>`)
    .join("");
  els.voteOption.disabled = !isSepolia;

  els.submitEncryptedVote.disabled = !(
    isSepolia &&
    state.account &&
    phase === "live" &&
    !snapshot.hasConnectedWalletVoted
  );
  els.publishResults.disabled = !(isOwner && phase === "ended");
  els.grantAccess.disabled = !(snapshot.resultsPublished && state.account);
  els.decryptResults.disabled = !(isSepolia && snapshot.resultsPublished && state.account);
}

async function getContract(withSigner = false) {
  const address = els.contractAddress.value.trim();
  if (!address) {
    throw new Error("请先输入合约地址。");
  }
  if (!state.provider) {
    throw new Error("请先连接钱包。");
  }

  return new Contract(address, ABI, withSigner ? state.signer : state.provider);
}

async function readSnapshot() {
  try {
    const contract = await getContract(false);
    const [owner, title, startTime, endTime, resultsPublished, options, hasConnectedWalletVoted] = await Promise.all([
      contract.owner(),
      contract.title(),
      contract.startTime(),
      contract.endTime(),
      contract.resultsPublished(),
      contract.getOptions(),
      state.account ? contract.hasVoted(state.account) : Promise.resolve(false),
    ]);

    state.snapshot = {
      owner,
      title,
      startTime,
      endTime,
      resultsPublished,
      options,
      hasConnectedWalletVoted,
    };
    renderSnapshot(state.snapshot);
    setStatus("已读取链上公开状态。", "confirmed");
  } catch (error) {
    state.snapshot = null;
    clearSnapshot();
    setStatus(error instanceof Error ? error.message : "读取合约失败。", "error");
  }
}

async function connectWallet() {
  try {
    const ethereum = getEthereum();
    if (!ethereum) {
      throw new Error("未检测到浏览器钱包，请先安装 MetaMask。");
    }

    const provider = new BrowserProvider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    state.provider = provider;
    state.signer = signer;
    state.account = await signer.getAddress();
    state.chainId = Number(network.chainId);

    els.walletAddress.textContent = state.account;
    els.chainId.textContent = String(state.chainId);
    els.networkStatus.textContent = state.chainId === DEFAULT_CHAIN_ID ? "已对齐" : "请切换到配置链";

    setStatus("钱包已连接。", "confirmed");
    if (els.contractAddress.value.trim()) {
      await readSnapshot();
    }
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "钱包连接失败。", "error");
  }
}

async function runOwnerAction(action) {
  try {
    const contract = await getContract(true);
    setStatus("交易已发送，等待链上确认。", "idle");

    const tx =
      action === "publish"
        ? await contract.publishResults()
        : await contract.grantResultAccess(await state.signer.getAddress());

    await tx.wait();
    setStatus(action === "publish" ? "结果已发布。" : "已为当前钱包授予结果访问权限。", "confirmed");
    await readSnapshot();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "交易执行失败。", "error");
  }
}

async function getRelayerInstance() {
  if (state.chainId !== 11155111) {
    throw new Error("浏览器端加密投票和结果解密当前按 Sepolia 路径接入。请切换到 Sepolia 再试。");
  }

  if (state.relayerInstance) {
    return state.relayerInstance;
  }

  if (!state.account) {
    throw new Error("请先连接钱包。");
  }

  if (!state.provider) {
    throw new Error("请先连接钱包。");
  }

  if (!state.relayerModule) {
    state.relayerModule = await import("../node_modules/@zama-fhe/relayer-sdk/bundle.js");
    await state.relayerModule.initSDK();
  }

  state.relayerInstance = await state.relayerModule.createInstance({
    ...state.relayerModule.SepoliaConfig,
    network: getEthereum(),
  });

  return state.relayerInstance;
}

async function submitEncryptedVote() {
  try {
    const selectedIndex = els.voteOption.value;
    if (selectedIndex === "") {
      throw new Error("请先选择一个候选项。");
    }

    const contract = await getContract(true);
    const relayer = await getRelayerInstance();

    setStatus("正在生成加密输入并提交交易。", "idle");

    const encryptedInput = await relayer
      .createEncryptedInput(els.contractAddress.value.trim(), state.account)
      .add8(Number(selectedIndex))
      .encrypt();

    const tx = await contract.vote(encryptedInput.handles[0], encryptedInput.inputProof);
    await tx.wait();

    setStatus("加密投票已提交。", "confirmed");
    await readSnapshot();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "加密投票提交失败。", "error");
  }
}

async function decryptResults() {
  try {
    if (!state.snapshot) {
      throw new Error("请先读取合约状态。");
    }

    const contract = await getContract(false);
    const relayer = await getRelayerInstance();

    setStatus("正在申请用户解密。", "idle");

    const handles = await Promise.all(
      state.snapshot.options.map(async (_, index) => ({
        handle: await contract.getEncryptedTally(index),
        contractAddress: els.contractAddress.value.trim(),
      })),
    );

    const keypair = relayer.generateKeypair();
    const startTimestamp = Math.floor(Date.now() / 1000);
    const durationDays = 1;
    const eip712 = relayer.createEIP712(keypair.publicKey, [els.contractAddress.value.trim()], startTimestamp, durationDays);

    const types = { ...eip712.types };
    delete types.EIP712Domain;

    const signature = await state.signer.signTypedData(eip712.domain, types, eip712.message);
    const decrypted = await relayer.userDecrypt(
      handles,
      keypair.privateKey,
      keypair.publicKey,
      signature,
      [els.contractAddress.value.trim()],
      state.account,
      startTimestamp,
      durationDays,
    );

    els.decryptedResults.innerHTML = state.snapshot.options
      .map((option, index) => {
        const handle = handles[index].handle;
        const clearValue = decrypted[handle]?.toString?.() ?? decrypted[handle] ?? "不可用";

        return `
          <div class="result-card">
            <span class="detail-label">选项 ${index + 1}</span>
            <strong>${option}</strong>
            <span class="result-value">${clearValue} 票</span>
          </div>
        `;
      })
      .join("");

    setStatus("结果已完成用户解密。", "confirmed");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "结果解密失败。", "error");
  }
}

els.connectWallet.addEventListener("click", () => {
  connectWallet();
});

els.refreshButton.addEventListener("click", () => {
  readSnapshot();
});

els.publishResults.addEventListener("click", () => {
  runOwnerAction("publish");
});

els.grantAccess.addEventListener("click", () => {
  runOwnerAction("grant");
});

els.submitEncryptedVote.addEventListener("click", () => {
  submitEncryptedVote();
});

els.decryptResults.addEventListener("click", () => {
  decryptResults();
});

els.contractAddress.addEventListener("change", () => {
  if (els.contractAddress.value.trim()) {
    readSnapshot();
  } else {
    clearSnapshot();
  }
});

const ethereum = getEthereum();
if (ethereum?.on) {
  ethereum.on("accountsChanged", async (accounts) => {
    state.account = Array.isArray(accounts) && accounts[0] ? accounts[0] : null;
    els.walletAddress.textContent = state.account ?? "未连接";
    if (els.contractAddress.value.trim()) {
      await readSnapshot();
    }
  });

  ethereum.on("chainChanged", async (chainIdHex) => {
    state.chainId = Number.parseInt(chainIdHex, 16);
    els.chainId.textContent = String(state.chainId);
    els.networkStatus.textContent = state.chainId === DEFAULT_CHAIN_ID ? "已对齐" : "请切换到配置链";
    if (els.contractAddress.value.trim()) {
      await readSnapshot();
    }
  });
}

clearSnapshot();

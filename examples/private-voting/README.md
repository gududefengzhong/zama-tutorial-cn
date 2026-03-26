# Private Voting

这是整套中文 Zama 教程的主线案例。

我们会围绕一个“私密投票”应用，逐步把概念、代码、测试、部署和前端交互串起来。

## 当前状态

这个目录现在已经包含一个可编译、可测试的最小 Hardhat FHE 工程：

- 合约：`contracts/PrivateVoting.sol`
- 测试：`test/PrivateVoting.ts`
- 部署脚本：`deploy/01_deploy_private_voting.ts`
- 配置：`hardhat.config.ts`

当前这版示例聚焦一个最小闭环：

- 三个候选项以内
- 用户提交加密投票
- 合约在密文状态下累计票数
- 结束后发布结果
- 结果发布后向指定地址授予解密访问权

## 为什么选择它

这个案例非常适合做入门主线，因为它同时具备下面几个特点：

- 隐私价值直观，读者容易理解
- 能自然引出密文输入和权限问题
- 合约逻辑足够简单，适合逐步展开
- 后续容易扩展成完整 dApp

## 当前阶段

目前这个目录已经具备一版最小可运行形态，已经完成：

- 最小合约
- 本地 mock 测试
- 本地部署脚本
- 一个最小前端界面

后续更适合继续补的是：

1. 更多截图和操作说明
2. 更多测试覆盖和 FAQ
3. 浏览器端隐私交互链路的进一步打磨

## 目录规划

```text
private-voting/
├── README.md
├── ARCHITECTURE.md
├── package.json
├── hardhat.config.ts
├── contracts/
│   ├── DESIGN.md
│   ├── README.md
│   └── PrivateVoting.sol
├── deploy/
│   ├── FLOW.md
│   ├── README.md
│   └── 01_deploy_private_voting.ts
├── test/
│   ├── README.md
│   ├── SCENARIOS.md
│   └── PrivateVoting.ts
└── frontend/
```

## 快速开始

在这个目录下运行：

```bash
npm install
npm run compile
npm test
```

如果你想启动本地链并部署：

```bash
npm run chain
npm run deploy:localhost
```

更完整的本地运行顺序可以直接看 [RUNBOOK.md](/Users/mudimu/mudi/web3/rochestor/zama-tutorial-cn/examples/private-voting/RUNBOOK.md)。
常见问题可以看 [FAQ.md](/Users/mudimu/mudi/web3/rochestor/zama-tutorial-cn/examples/private-voting/FAQ.md)。

## 你应该如何阅读这个案例

建议配合教程章节一起看：

1. 先读概念章节，理解为什么投票是合适的示例
2. 再读环境搭建章节，先把 Hardhat 工程跑起来
3. 最后再进入这个案例目录，看每个模块如何落地

## 当前约束

在第一版里，我们会优先保证：

- 结构清晰
- 概念可解释
- 路径可跑通

而不是追求一开始就做成完整产品。

另外需要明确一点：

- 本教程不会提供预部署的 Sepolia 合约地址
- 如果读者希望验证测试网路径，应自行完成部署
- 本地链仍然是这套教程的默认主路径

## 截图建议

后续补图时，最值得优先补这几张：

1. `npm test` 全绿截图
2. `npm run deploy:localhost` 输出合约地址截图
3. 前端读取公开状态后的页面截图
4. 发布结果后的页面状态截图

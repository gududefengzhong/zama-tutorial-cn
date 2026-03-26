# Zama 开发教程（中文）

面向中文区开发者的 Zama / FHEVM 入门与实战教程。

这个仓库的目标不是简单翻译官方文档，而是帮助开发者用中文快速建立正确认知，并真正跑通第一个 Zama 应用。

## 我们想解决什么问题

- 用中文解释 Zama 和 FHE 的核心概念
- 帮助开发者在较短时间内跑通第一个示例
- 提供从概念理解到项目实战的完整路径
- 沉淀常见坑、调试经验和工程实践

## 教程定位

这套教程适合以下读者：

- 想了解 Zama / FHEVM 能做什么的 Web3 开发者
- 有 Solidity / 前端基础，但没接触过 FHE 的开发者
- 想做隐私投票、密文竞价、链上隐私状态等应用的团队

这套教程不会默认你有密码学背景，但会默认你具备基本的智能合约开发经验。

## 仓库结构

```text
.
├── README.md
├── docs
│   ├── 01-why-zama.md
│   ├── 02-core-concepts.md
│   ├── 03-setup.md
│   ├── 04-first-demo.md
│   ├── 05-full-dapp.md
│   ├── 06-debugging-and-pitfalls.md
│   └── 07-from-demo-to-project.md
└── examples
    ├── README.md
    └── private-voting
        ├── README.md
        ├── RUNBOOK.md
        ├── contracts/PrivateVoting.sol
        ├── test/PrivateVoting.ts
        ├── deploy/01_deploy_private_voting.ts
        └── frontend/
            ├── index.html
            ├── app.js
            └── styles.css
```

## 建议学习路径

1. 先看 [为什么是 Zama](docs/01-why-zama.md)，建立问题意识
2. 再看 [核心概念](docs/02-core-concepts.md)，理解 FHEVM 的基本模型
3. 按 [环境搭建](docs/03-setup.md) 完成本地准备
4. 跑通 [第一个 Demo](docs/04-first-demo.md)
5. 最后进入 [完整 dApp](docs/05-full-dapp.md)

## 快速开始

如果你想直接上手主线案例，建议走这条最短路径：

1. 阅读 [docs/README.md](docs/README.md)
2. 进入 [examples/private-voting/README.md](examples/private-voting/README.md)
3. 按 [examples/private-voting/RUNBOOK.md](examples/private-voting/RUNBOOK.md) 跑本地示例
4. 卡住时查 [docs/FAQ.md](docs/FAQ.md) 和 [examples/private-voting/FAQ.md](examples/private-voting/FAQ.md)

## 当前进度

当前仓库已经完成第一版教程正文框架，包含：

- 第 1 章到第 7 章的中文正文
- 一个可编译、可测试的私密投票示例工程
- 一个可读取公开状态的最小前端界面
- 环境搭建、Demo 路径、完整 dApp、调试和项目化章节

接下来会优先补充：

- 每章对应的截图与运行演示
- 更细的 FAQ 和排错记录
- 浏览器端隐私交互链路的进一步打磨

## 配套资料

- 文档总览：[docs/README.md](docs/README.md)
- 主线案例：[examples/private-voting/README.md](examples/private-voting/README.md)
- 本地运行手册：[examples/private-voting/RUNBOOK.md](examples/private-voting/RUNBOOK.md)
- 常见问题：[docs/FAQ.md](docs/FAQ.md)
- 截图素材清单：[docs/SCREENSHOT-CHECKLIST.md](docs/SCREENSHOT-CHECKLIST.md)

## 主线案例

我们会优先围绕“私密投票”来组织教程，因为它同时具备：

- 足够直观的隐私价值
- 适中的合约复杂度
- 易于扩展到前端交互和权限控制

后续还可以扩展出：

- 隐私余额 / 工资展示
- 密文竞价
- 链上游戏中的私密状态

## 参与方式

如果你也在做 Zama / FHEVM 相关开发，欢迎一起完善这套中文教程。后续可以按以下方向逐步补充：

- 勘误和术语统一
- 不同开发环境的搭建笔记
- 更多真实项目案例
- 面向中文区读者的图解内容

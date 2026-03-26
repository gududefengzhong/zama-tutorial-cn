# FAQ

这份 FAQ 面向第一次跟着这套教程动手的读者，集中回答最容易卡住的问题。

## 1. 为什么我已经运行了前端页面，却看不到投票结果

最常见的原因不是页面坏了，而是当前阶段本来就不应该看到结果。

先检查：

- 投票是否已经结束
- 合约是否已经执行 `publishResults`
- 当前钱包是否已经获得结果访问授权

在这套示例里，“当前不可见”本身就是正常状态，不一定是 bug。

## 2. 为什么 `npm run compile` 通过了，但我还是跑不起来

编译通过只说明语法和依赖基本可用，不代表完整流程已经打通。

更稳的检查顺序是：

1. `npm run compile`
2. `npm test`
3. `npm run chain`
4. `npm run deploy:localhost`
5. 打开前端读取公开状态

只有这几步都成立，才能说明你真的把示例跑起来了。

## 3. 为什么前端里没有直接完成完整隐私交互

因为这套教程默认是“本地优先”的学习路径。

本地链和 mocked mode 更适合：

- 理解公开状态
- 理解时间流程
- 验证合约逻辑
- 演示 owner 操作

浏览器端真实加密输入和结果解密，更适合读者在需要时自行部署到 Sepolia 后继续验证。

## 4. 为什么教程不直接给我一个可用的 Sepolia 合约地址

因为那种地址很容易过期，也会让读者绕过真正重要的部署过程。

这套教程更希望你掌握：

- 如何本地验证
- 如何自己部署
- 如何判断问题出在本地流程、前端流程还是测试网配置

而不是依赖一个共享地址。

## 5. 为什么页面能读到标题和候选项，却读不到内部结果

这是示例故意设计的公开/私密分层。

公开信息包括：

- 标题
- 候选项
- 时间窗口
- 是否已投票
- 是否已发布结果

私密信息包括：

- 用户具体投给了谁
- 过程中不应提前暴露的计票状态

## 6. 为什么我在本地链里只能演示一部分前端能力

因为本地链主要承担的是开发与教学功能，不是完整真实网络替代品。

在当前仓库里：

- 本地链适合读取公开状态、跑测试、演示 owner 操作
- Sepolia 更适合浏览器端真实加密输入和结果解密

## 7. 为什么我看到 Node.js 版本提示或依赖异常

先回头检查 Node.js 版本。

这套工程更适合在稳定的 LTS 或官方模板要求的版本范围内运行。  
如果你使用过新的实验性版本，很多问题都可能和 FHE 逻辑无关。

## 8. 我应该先看文档还是先跑代码

最推荐的顺序是：

1. 先看 [docs/01-why-zama.md](/Users/mudimu/mudi/web3/rochestor/zama-tutorial-cn/docs/01-why-zama.md) 和 [docs/02-core-concepts.md](/Users/mudimu/mudi/web3/rochestor/zama-tutorial-cn/docs/02-core-concepts.md)
2. 再看 [docs/03-setup.md](/Users/mudimu/mudi/web3/rochestor/zama-tutorial-cn/docs/03-setup.md)
3. 再按 [examples/private-voting/RUNBOOK.md](/Users/mudimu/mudi/web3/rochestor/zama-tutorial-cn/examples/private-voting/RUNBOOK.md) 跑本地示例

这样最不容易在环境和概念之间同时卡住。

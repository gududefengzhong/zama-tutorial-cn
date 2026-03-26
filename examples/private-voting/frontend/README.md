# Frontend

这里现在已经包含一个最小浏览器版界面：

- `index.html`
- `styles.css`
- `app.js`

这一版前端不依赖额外框架，直接复用上层工程已经安装好的 `ethers`。

## 当前支持

- 连接 MetaMask
- 输入合约地址并读取公开状态
- 展示投票阶段、候选项、时间窗口、结果发布状态
- 在 Sepolia 上提交加密投票
- 合约所有者发布结果
- 为当前钱包授予结果访问权限
- 在 Sepolia 上尝试用户端结果解密

## 当前限制

- 本地 `31337` / mocked mode 主要适合读取公开状态和演示 owner 操作
- 浏览器端加密投票和结果解密当前按官方 relayer SDK 的 Sepolia 路径接入
- 如果你只在本地链测试，前端不会替代合约测试里的 mock 解密流程
- 教程仓库不会提供预部署的 Sepolia 合约地址；如需验证真实网络链路，请读者自行部署

## 如何运行

在 `examples/private-voting` 目录先确保：

```bash
npm run compile
npm run chain
```

另开一个终端部署：

```bash
npm run deploy:localhost
```

然后继续在 `examples/private-voting` 目录运行：

```bash
python3 -m http.server 4173
```

最后打开：

```text
http://localhost:4173/frontend/
```

## 双路径说明

### 本地链

适合：

- 读取公开状态
- 检查页面阶段切换
- 演示发布结果和授权按钮

### Sepolia

适合：

- 浏览器端加密投票输入
- 授权后用户端结果解密

如果你要验证完整的前端隐私链路，建议把合约部署到 Sepolia 后再测试。

## 截图建议

后续补图时，建议至少补：

1. 钱包连接成功截图
2. 输入合约地址并读取公开状态后的截图
3. owner 发布结果后的截图
4. 如果读者自行部署到 Sepolia，再补加密投票和结果解密截图

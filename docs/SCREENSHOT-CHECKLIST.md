# 截图素材清单

这份清单用于后续补截图时统一命名、统一位置、统一用途，避免临时想到哪补到哪。

## 建议目标

优先补“最能帮助读者建立信心”的截图，而不是追求数量。

最值得优先展示的是：

- 本地环境已经跑通
- 测试已经通过
- 合约已经部署
- 前端已经能读取公开状态
- 结果状态切换已经发生

## 建议目录

如果后面你要真正落图，建议在仓库根目录新增：

```text
assets/
└── screenshots/
    ├── setup/
    ├── testing/
    ├── deploy/
    └── frontend/
```

## 第一批最值得补的截图

### 1. 环境准备

建议文件名：

- `assets/screenshots/setup/node-version-check.png`
- `assets/screenshots/setup/install-dependencies.png`

建议用途：

- 放到 [docs/03-setup.md](03-setup.md)
- 证明读者的基础环境已经准备好

### 2. 测试通过

建议文件名：

- `assets/screenshots/testing/private-voting-tests-green.png`

建议用途：

- 放到 [examples/private-voting/README.md](../examples/private-voting/README.md)
- 放到 [examples/private-voting/RUNBOOK.md](../examples/private-voting/RUNBOOK.md)
- 让读者知道“本地 mock 测试已经通了”

### 3. 本地部署

建议文件名：

- `assets/screenshots/deploy/localhost-deploy-output.png`

建议用途：

- 放到 [examples/private-voting/RUNBOOK.md](../examples/private-voting/RUNBOOK.md)
- 重点展示合约地址输出位置

### 4. 前端首页

建议文件名：

- `assets/screenshots/frontend/private-voting-home.png`

建议用途：

- 放到 [examples/private-voting/frontend/README.md](../examples/private-voting/frontend/README.md)
- 放到 [docs/05-full-dapp.md](05-full-dapp.md)

### 5. 前端读取公开状态

建议文件名：

- `assets/screenshots/frontend/private-voting-public-state.png`

建议用途：

- 展示标题、候选项、时间窗口、结果状态
- 体现“公开信息和私密信息分层”

### 6. 结果发布后的页面状态

建议文件名：

- `assets/screenshots/frontend/private-voting-results-published.png`

建议用途：

- 展示状态从“未发布”切换到“已发布”
- 适合放到 [docs/06-debugging-and-pitfalls.md](06-debugging-and-pitfalls.md) 或案例 README

## 每张截图建议包含什么

为了让截图更有教学价值，建议每张图尽量满足：

- 只聚焦一个核心信息
- 终端截图保留命令和关键输出
- 页面截图保留关键状态区域
- 不要截太多无关桌面内容

## 截图补充顺序

如果你时间有限，建议严格按这个顺序补：

1. 测试通过
2. 本地部署输出
3. 前端读取公开状态
4. 前端结果状态切换
5. 环境准备

这样投入最少，但对读者帮助最大。

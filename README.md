# 假如你是 Gay

10 个日常小场景，8 种有趣的相处角色。一个纯前端的娱乐角色测试，用第一反应拼出相处风格。

**纯属娱乐，不用于判断性取向或专业心理评估。** 角色和互动搭配均为虚构。

## 开发

使用 Node.js 22.20+（CI 使用 Node 22），然后运行：

```sh
npm ci
npm run dev
```

访问终端显示的 `/Gay-test/` 地址。项目使用 TypeScript、Vite 和原生 DOM，生产页面没有框架运行时、远程字体或答案上传服务。

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 本地开发 |
| `npm run typecheck` | 严格类型检查 |
| `npm test` | 评分、题库、状态和存储测试 |
| `npm run analyze` | 穷举全部答案组合，更新分布报告 |
| `npm run build` | 类型检查并构建静态产物到 `dist/` |
| `npm run preview` | 预览生产构建 |
| `npm run check` | 类型、单元测试、分布约束和生产构建 |
| `npm run test:e2e` | 构建后运行浏览器验收 |

首次运行浏览器测试前：

```sh
npx playwright install chromium
npm run test:e2e
```

也可以用本机 Chrome。在 PowerShell 中先执行 `$env:PLAYWRIGHT_CHANNEL='chrome'`，再运行 `npm run test:e2e`；其他 shell 可使用 `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`。测试会自行启动预览服务，请确保 4173 端口空闲。

依赖已固定版本并保留完整性哈希。若所在网络无法连接 npm 官方源，可在安装命令后加 `--registry=https://registry.npmmirror.com`，无需修改全局 npm 设置或仓库锁文件。

## 代码职责

```text
src/data/quiz.ts              角色、题目、选项与配分
src/domain/types.ts           数据接口和稳定类型 ID
src/domain/scoring.ts         从完整答案计算得分和全部最高分角色
src/domain/validate-quiz.ts   构建时与启动时的内容约束检查
src/domain/quiz-state.ts      无 DOM 的答题状态转换
src/storage.ts                版本化标签页进度，容错恢复
src/ui/                       欢迎、答题、结果与 DOM 辅助函数
src/main.ts                   事件、状态、页面和存储的连接
src/styles.css                布局、控件、颜色与减少动态效果支持
scripts/                      全组合分布分析
tests/                        单元测试和生产构建浏览器测试
```

答案是计分的唯一依据。返回前题改选后，结果从完整答案重新计算；切题不会重复增加历史分数。选择选项时保留原生单选组，避免键盘焦点被重绘打断。

## 评分与题库维护

题库固定为 10 题、每题 4 项、8 个角色。每个选项只提供一组 `primary`（2 分）和不同的 `secondary`（1 分）：

- 每题 8 个角色各出现一次，即 4 个主要位置、4 个次要位置。
- 每类跨 10 题占 5 个主要位置和 5 个次要位置，可达最高分均为 15；每份完整答案分配 30 分。
- 唯一最高分展示单一角色；并列展示所有最高分角色，作为复合型。排序只影响展示，不会排除并列者。
- 分数是游戏偏好得分，不是概率、置信度或专业测量结果。

修改内容时保留稳定的类型、题目和选项 ID；修改题目、配分或结果语义时递增 `quiz.version`，让旧进度不会被新规则误读。互动搭配通过类型 ID 引用，不以名称字符串匹配。

运行 `npm run analyze` 会生成 [`docs/score-distribution.json`](docs/score-distribution.json)，包含每类独立获胜组合数、可达分数、示例答案、全部并列和最多并列的示例。检查要求：每类可独立获胜，等概率模型中最大与最小预期结果占比之比不超过 2。

当前题库已分析全部 1,048,576 种答案序列：各类型占比约 12.33%–12.63%，最大/最小之比约 1.024。这里假设各题选项独立等概率，并列时为统计平均分摊；它不代表真实用户分布，也不证明心理测量有效性。实际界面保留全部并列角色。

## 进度与隐私

答案仅在浏览器中处理。当前标签页的 `sessionStorage` 保存题库版本、当前题号及答案；刷新后可选择继续或重新开始。完成后可查看上次结果，重测会清理旧记录。

这是标签页会话进度，不是跨设备、跨浏览器或永久历史记录；浏览器恢复标签页时可能恢复对应会话。禁用存储或写入失败时，测试仍可完成。旧版本、损坏数据、未知选项或不连续的答案历史会被清理。

## GitHub Pages

生产地址：`https://wudiwzh801.github.io/Gay-test/`，`vite.config.ts` 的 `base` 已设置为 `/Gay-test/`。部署目录是构建后的 `dist/`，不是源码根目录。

**合并此重构前，在仓库 Settings → Pages → Build and deployment 中，将 Source 设为 GitHub Actions。** 原项目使用动态 Pages 流程；若仍从分支根目录直接发布，新版 TypeScript 入口无法作为生产页面运行。

`.github/workflows/ci.yml` 在 PR 和 main 上执行检查。`.github/workflows/deploy.yml` 只允许 main 构建和部署；通过类型、单元测试、配分约束、构建和浏览器测试后再发布。功能分支和 PR 不会部署到线上。

如果改用自定义域名或改仓库名，需要同时调整 Vite `base`、页面 canonical/og:url 以及预览测试地址。部署完成后检查入口、脚本、样式和 favicon 均能从目标子路径访问。可参照 [Vite 的 Pages 部署说明](https://vite.dev/guide/static-deploy.html#github-pages)。

## 验证范围

单元测试覆盖计分、稳定并列、内容完整性、全部组合分布、回退改选、重复完成、重测和存储异常。浏览器测试针对实际生产构建，覆盖刷新恢复、存储禁用、键盘单选与焦点、减少动态效果，以及 320/390/768/1280 像素宽度下的欢迎、题目和最多并列结果页面。

本地验证使用 Chrome；CI 使用 Playwright Chromium。没有在真实 iOS Safari、Android 设备或屏幕阅读器上完成验证，也未开展心理学有效性研究。

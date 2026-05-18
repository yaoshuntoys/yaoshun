# Yaoshun Toys Google Ads 投放配置与执行手册

更新日期：2026-05-18  
适用网站：`https://www.yaoshuntoys.com`  
适用业务：玩具 OEM/ODM、堡垒拼搭玩具、STEM building kits、定制包装、工厂询盘获客

## 1. 投放目标

本次 Google Ads 的核心目标是获取海外 B2B 询盘，而不是做面向儿童的零售曝光。

| 优先级 | 目标 | 说明 | 衡量方式 |
| --- | --- | --- | --- |
| P0 | 表单询盘 | 首页表单、Contact 页面表单提交 | Google Ads website conversion + GA4 `generate_lead` |
| P1 | 高意向联系点击 | WhatsApp、邮箱、电话等 contact click | Google Ads secondary conversion + GA4 `contact_click` |
| P2 | 产品目录深度浏览 | 产品详情页、Solutions、FAQ 浏览 | GA4 engagement，不作为主出价目标 |
| P3 | 品牌保护 | Yaoshun / Yaoshun Toys 品牌词搜索 | 独立品牌 Search Campaign |

投放口径：先跑 Search 精准获客，转化数据稳定后再加 Performance Max 做增量。不要一开始就把预算全部交给 Performance Max。

## 2. 当前网站可用追踪能力

网站已经具备以下能力：

| 项目 | 当前值 / 文件 | 说明 |
| --- | --- | --- |
| GA4 Measurement ID | `G-G0GJ1LYXW1` | 来自 `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` |
| Google Ads Tag ID | `AW-14360820542` | 来自 `NEXT_PUBLIC_GOOGLE_ADS_ID` |
| 表单询盘转化 | `AW-14360820542/L8PoCOjfhJocENni3q1D` | 来自 `NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO` |
| 转化币种 | `USD` | 来自 `NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_CURRENCY` |
| 转化价值 | `1` | 来自 `NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_VALUE` |
| 表单事件 | `generate_lead` | `home_lead_form`、`contact_form` 提交成功后触发 |
| 表单开始事件 | `form_start` | 用户首次聚焦表单时触发 |
| 表单错误事件 | `form_submit_error` | 网络或接口错误时触发 |
| 联系点击事件 | `contact_click` | 页面中带 `data-track-event="contact_click"` 的入口触发 |
| 归因参数 | `utm_*`、`gclid`、`gbraid`、`wbraid`、`msclkid` | 保存 first touch / last touch 到浏览器本地存储 |
| Consent Mode | `ad_storage`、`analytics_storage`、`ad_user_data`、`ad_personalization` | 用户接受 Cookie 后才加载第三方追踪脚本 |

代码位置：

| 能力 | 文件 |
| --- | --- |
| Google Ads/GA4 环境变量 | `apps/website/src/lib/site-config.ts` |
| Google tag 加载与 Consent Mode | `apps/website/src/components/tracking/tracking-scripts.tsx` |
| 表单转化上报 | `apps/website/src/lib/analytics.ts` |
| UTM/GCLID 归因保存 | `apps/website/src/lib/campaign-attribution.ts` |
| 首页询盘表单 | `apps/website/src/components/forms/home-lead-form.tsx` |
| 联系页询盘表单 | `apps/website/src/components/forms/contact-form.tsx` |

## 3. 上线前账号准备

### 3.1 Google Ads 账号

1. 登录 `ads.google.com`。
2. 选择 Expert Mode。
3. 创建或选择广告账号。
4. 设置账号时区：建议选择主要运营复盘时区。中国团队运营可选 `Asia/Shanghai`；如果客户主要在美国且由美国团队看报表，可选美国时区。账号时区创建后通常不可轻易改动。
5. 设置币种：建议 `USD`，与网站当前转化币种一致。
6. 完成 Billing：`Tools > Billing > Settings`。
7. 完成 Advertiser Verification：使用企业主体 `Dongguan Yaoshun Technology Co., Ltd.`，准备营业执照、网站域名、企业地址、付款资料一致性证明。

### 3.2 Google Analytics 4

1. 登录 `analytics.google.com`。
2. 确认 Property 使用 Measurement ID：`G-G0GJ1LYXW1`。
3. 确认 Web stream 域名为 `www.yaoshuntoys.com`。
4. 在 GA4 中检查事件：`Reports > Realtime` 或 `Admin > Data display > Events`。
5. 将 `generate_lead` 标记为 Key event。
6. 连接 Google Ads：`Admin > Product links > Google Ads links`。
7. 开启 Ads personalization 与数据共享时，确保与网站 Cookie 同意逻辑一致。

### 3.3 Google Search Console

1. 添加 Domain Property 或 URL-prefix Property：`https://www.yaoshuntoys.com`。
2. 如果使用 meta 验证，把 token 配到 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`。
3. 提交 Sitemap：`https://www.yaoshuntoys.com/sitemap.xml`。
4. 确认首页、产品页、联系页没有索引或抓取异常。

## 4. 网站环境变量配置

生产环境必须配置：

```bash
NEXT_PUBLIC_SITE_URL=https://www.yaoshuntoys.com
NEXT_PUBLIC_ENABLE_THIRD_PARTY_TRACKING=true
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-G0GJ1LYXW1
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-14360820542
NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO=AW-14360820542/L8PoCOjfhJocENni3q1D
NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_CURRENCY=USD
NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_VALUE=1
```

可选配置：

```bash
NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION_SEND_TO=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
GOOGLE_SITE_VERIFICATION=
```

配置要求：

1. 不要把 SMTP 密码、Resend API Key、邮箱授权码写入广告文档、广告后台备注或公开仓库。
2. Vercel Production 环境变量更新后必须重新部署。
3. 部署后用 Tag Assistant 检查 Google tag 是否触发。
4. 用户未接受 Cookie 时，第三方追踪不加载，这是当前站点的隐私策略；测试转化时必须先点击 Cookie Accept。

## 5. Google Ads 转化配置

### 5.1 主转化：Website Lead

后台路径：`Goals > Summary > + Create conversion action > Website`

| 配置项 | 推荐值 |
| --- | --- |
| Domain | `www.yaoshuntoys.com` |
| Conversion source | Website / Google tag |
| Category | Submit lead form |
| Name | `Website Lead - Quote Form` |
| Optimization action | Primary |
| Value | Use same value for each conversion |
| Value amount | `1` |
| Currency | `USD` |
| Count | One |
| Click-through conversion window | 90 days |
| Engaged-view conversion window | 3 days，若后台可用 |
| View-through conversion window | 1 day 或关闭，Search 主投放可保持保守 |
| Attribution | Data-driven |
| Enhanced conversions | 先关闭或先不启用；见 5.4 |
| Tag setup | Manually using code / Google tag |
| Conversion ID | `AW-14360820542` |
| Conversion label | `L8PoCOjfhJocENni3q1D` |

网站已经在表单成功提交后执行：

```ts
gtag("event", "conversion", {
  send_to: "AW-14360820542/L8PoCOjfhJocENni3q1D",
  value: 1,
  currency: "USD"
});
```

因此 Google Ads 后台创建转化后，不需要额外粘贴事件代码到页面，只要保持环境变量正确。

### 5.2 次转化：Contact Click

如果要单独统计 WhatsApp / Email / 电话点击：

| 配置项 | 推荐值 |
| --- | --- |
| Category | Contact |
| Name | `Contact Click - WhatsApp Email` |
| Optimization action | Secondary |
| Value | `0.2` 或 `1`，但不纳入主转化优化 |
| Count | One |
| Conversion window | 30 days |
| `NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION_SEND_TO` | 填后台生成的 `AW-xxx/label` |

建议先不作为 Primary，避免算法把低质量点击当成真正询盘优化。

### 5.3 GA4 导入转化

推荐采用“双记录、单出价”：

1. Google Ads 直接 website conversion：作为 Primary，用于出价。
2. GA4 `generate_lead`：导入 Google Ads 后设为 Secondary，用于核对。

导入路径：

1. `Goals > Summary > + Create conversion action`
2. 选择 `Import`
3. 选择 `Google Analytics 4 properties`
4. 选择 `generate_lead`
5. Category 选择 `Submit lead form`
6. Optimization action 选择 `Secondary`

这样可以避免同一次表单提交被重复计入 `Conversions` 主列。

### 5.4 Enhanced Conversions

Google 官方建议用加密哈希的一方数据提升转化衡量精度，但当前网站没有把用户邮箱/姓名传给 Google tag，只通过表单接口发送邮件。因此：

1. 第一阶段：不开 Enhanced Conversions，先确认基础转化稳定。
2. 第二阶段：如果月询盘超过 30 条，再考虑增加 Enhanced Conversions for web。
3. 实施前必须确认隐私政策覆盖广告衡量、一方数据哈希上报与用户同意逻辑。

## 6. 追踪参数与 URL 规范

### 6.1 Auto-tagging

必须开启：`Admin > Account settings > Auto-tagging > Tag the URL that people click through from my ad`

原因：

1. Google Ads 转化归因依赖 `gclid` / `gbraid` / `wbraid`。
2. 网站已保存这些参数到本地归因数据。
3. GA4 与 Google Ads 成本、Campaign 数据联动需要 auto-tagging。

### 6.2 Final URL suffix

账户级建议配置：

```text
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}&utm_matchtype={matchtype}&utm_network={network}&utm_device={device}
```

说明：

| 参数 | 用途 |
| --- | --- |
| `utm_source=google` | 标识流量来源 |
| `utm_medium=cpc` | 标识付费点击 |
| `utm_campaign={campaignid}` | 用 campaign id 保持唯一 |
| `utm_content={creative}` | 识别广告创意 |
| `utm_term={keyword}` | 识别触发关键词 |
| `utm_matchtype={matchtype}` | 识别匹配类型 |
| `utm_network={network}` | Search / Display / Partner 等网络 |
| `utm_device={device}` | mobile / desktop / tablet |

不要在 Final URL 手动写死 `gclid`，由 auto-tagging 自动添加。

## 7. Campaign 架构

建议先创建 4 个 Search Campaign，数据稳定后再创建 1 个 Performance Max。

| Campaign | 目标 | 预算占比 | 落地页 |
| --- | --- | --- | --- |
| `YS_Search_EN_OEM-ODM_Exact-Phrase` | 高意向 OEM/ODM 询盘 | 40% | `/solutions`、`/contact` |
| `YS_Search_EN_Fort-Kits_Exact-Phrase` | 堡垒拼搭玩具采购询盘 | 30% | `/products`、产品详情页 |
| `YS_Search_EN_Compliance-Factory_Exact-Phrase` | 合规、工厂、供应商搜索 | 15% | `/about`、`/faq`、`/contact` |
| `YS_Search_Brand_EN-ZH` | 品牌保护 | 5% | `/`、`/contact` |
| `YS_PMax_EN_B2B-Leads` | 增量流量与再营销 | 10%，第二阶段再上 | `/products`、`/solutions`、`/contact` |

第一阶段不建议投 Display 独立 Campaign。B2B 询盘场景中，Search 的意图更清晰，预算更容易控。

## 8. Search Campaign 通用配置项

| 配置项 | 推荐值 |
| --- | --- |
| Objective | Leads |
| Campaign type | Search |
| Results goal | Website visits + Lead form submissions |
| Bidding, 第 1-2 周 | Maximize clicks，设置 Max CPC 上限 |
| Bidding, 有 15-30 个有效转化后 | Maximize conversions |
| Bidding, 有稳定 CPA 后 | Target CPA |
| Networks | Google Search Network 开；Search Partners 先关；Display Network 关 |
| Locations | 美国、英国、加拿大、澳大利亚、德国、法国、荷兰、阿联酋、沙特、日本、韩国、新加坡等目标市场；按预算分批开启 |
| Location options | Presence: People in or regularly in your targeted locations |
| Excluded locations | 中国大陆、印度、巴基斯坦、孟加拉、俄罗斯等低相关或高垃圾询盘地区；按实际搜索词调整 |
| Languages | English；如单独跑中文采购词，可建中文 Campaign |
| Audience segments | Observation，不要 Targeting |
| Ad schedule | 周一至周五全天；如销售只在北京时间工作，可用报表后再调 |
| Start date | 验收通过后的下一个工作日 |
| End date | 不设置 |
| URL options | 使用账户级 Final URL suffix |
| Brand safety | 排除 parked domains、sensitive content，PMax 再做内容排除 |

建议初始日预算：

| 阶段 | 总日预算 | 说明 |
| --- | --- | --- |
| 测试期 1-2 周 | USD 30-80/day | 先获取搜索词与询盘质量 |
| 优化期 3-6 周 | USD 80-200/day | 保留有效 Campaign，扩大高意向词 |
| 放量期 | 根据 CPA 与产能决定 | CPA 稳定后逐步增加 20%-30% |

## 9. Ad Group 与关键词

### 9.1 OEM/ODM Ad Groups

Ad group：`Toy OEM ODM Manufacturer`

```text
"toy oem manufacturer"
"toy odm manufacturer"
"oem toy factory"
"odm toy factory"
"custom toy manufacturer"
"private label toy manufacturer"
[toy oem manufacturer]
[toy odm manufacturer]
[custom toy manufacturer]
[private label toy manufacturer]
```

Ad group：`Custom Toy Development`

```text
"custom toy development"
"custom building toy development"
"custom educational toy manufacturer"
"custom plastic toy manufacturer"
"toy mold development"
"toy injection molding factory"
[custom toy development]
[toy mold development]
[toy injection molding factory]
```

Ad group：`Toy Packaging Private Label`

```text
"custom toy packaging"
"private label toy packaging"
"custom logo toy packaging"
"color box toy packaging"
"toy packaging manufacturer"
[custom toy packaging]
[private label toy packaging]
```

### 9.2 Fort Building Kit Ad Groups

Ad group：`Fort Building Kit Manufacturer`

```text
"fort building kit manufacturer"
"fort building toy manufacturer"
"kids fort building kit supplier"
"stem fort building kit manufacturer"
"tent fort building kit supplier"
[fort building kit manufacturer]
[fort building toy manufacturer]
[stem fort building kit manufacturer]
```

Ad group：`Glow Fort Building Kit`

```text
"glow fort building kit manufacturer"
"glow in the dark fort building kit"
"luminous fort building kit supplier"
"glow building toys manufacturer"
[glow fort building kit manufacturer]
[glow in the dark fort building kit]
```

Ad group：`Connector Balls Rods`

```text
"connector balls and rods toy"
"fort kit connector balls"
"building toy rods supplier"
"abs connector balls toy"
"pp rods building toy"
[connector balls and rods toy]
[fort kit connector balls]
```

### 9.3 Compliance / Factory Ad Groups

Ad group：`Certified Toy Supplier`

```text
"en71 toy manufacturer"
"astm f963 toy manufacturer"
"rohs toy supplier"
"reach toy supplier"
"compliance toy manufacturer"
[en71 toy manufacturer]
[astm f963 toy manufacturer]
```

Ad group：`China Toy Factory Export`

```text
"china toy factory"
"toy manufacturer china"
"toy export factory china"
"educational toy manufacturer china"
"b2b toy manufacturer"
[toy manufacturer china]
[b2b toy manufacturer]
```

### 9.4 Brand Campaign

```text
[yaoshun toys]
[yaoshun technology]
"yaoshun toys"
"yaoshun toy factory"
"dongguan yaoshun technology"
"尧顺玩具"
"尧顺科技"
```

### 9.5 关键词使用规则

1. 第一阶段只用 Phrase 与 Exact。
2. Broad match 只在有稳定转化数据后测试，且必须配合否词和 Target CPA。
3. 不要使用过泛词：`toy`、`kids toy`、`building toys`、`stem toys` 单独投放会浪费预算。
4. 每个 Ad group 保持 5-15 个关键词。
5. 每周至少两次看 Search terms，把无效词加入否词。

## 10. 否定关键词

账户级否词建议：

```text
free
cheap
coupon
discount code
amazon
walmart
target
ebay
temu
aliexpress
shein
retail
near me
jobs
career
salary
internship
pdf
manual
instructions
diy plans
how to make
used
second hand
replacement parts
lego
minecraft
roblox
game
app
download
school project
lesson plan
```

B2C/低意图否词：

```text
single
one piece
birthday gift
christmas gift
for toddlers
toy store
local store
best toys for kids
review
unboxing
```

需要谨慎的否词：

1. `wholesale`：可能有 B2B 意图，不建议一开始否掉。
2. `supplier`：高意图，不要否。
3. `china`：高意图，不要否。
4. `custom`：核心意图，不要否。

## 11. Responsive Search Ads 文案

每个 Ad group 至少创建 2 条 RSA。每条 RSA 建议 12-15 个 headlines、4 个 descriptions。除品牌或合规要求外，不要过度 pinning。

### 11.1 OEM/ODM RSA

Headlines：

```text
Toy OEM ODM Factory
Custom Toy Manufacturer
Private Label Toy Supplier
Toy Development Partner
Mold To Mass Production
Factory Since 2016
Custom Packaging Support
Educational Toy Supplier
Injection Molding Support
Export-Ready Toy Delivery
Start A Quote Review
Dongguan Source Factory
OEM ODM Toy Projects
Sampling And Production
Quality Check Workflow
```

Descriptions：

```text
Develop custom toy projects from concept review to tooling, sampling, production, packaging and export handoff.
Work with a Dongguan source factory for OEM/ODM toys, building kits, plastic parts and private label packaging.
Share quantity, target market and packaging needs. Yaoshun replies with a practical quotation plan.
Support for EN71, ASTM-related planning, quality checkpoints and export-ready delivery documentation.
```

Final URLs：

```text
https://www.yaoshuntoys.com/solutions
https://www.yaoshuntoys.com/contact
```

### 11.2 Fort Building Kit RSA

Headlines：

```text
Fort Building Kit Factory
STEM Building Kit Supplier
Glow Fort Kit Manufacturer
Kids Construction Toy OEM
Custom Fort Building Kits
Bulk Toy Quote Available
Private Label Fort Kits
Color Box Packaging
Connector Balls And Rods
OEM ODM Building Toys
Factory Direct Toy Supply
Export Toy Manufacturer
Request Bulk Pricing
Custom Kit Configurations
Quality Checked Production
```

Descriptions：

```text
Source fort building kits, glow kits, connector balls, rods and custom color box packaging for B2B orders.
Yaoshun supports building toy OEM/ODM, sampling, packaging review, production and export delivery.
Review product catalog and request bulk pricing for custom quantities, target markets and packaging plans.
Suitable for toy brands, importers, retailers and sourcing teams looking for factory-direct cooperation.
```

Final URLs：

```text
https://www.yaoshuntoys.com/products
https://www.yaoshuntoys.com/contact
```

### 11.3 Compliance / Factory RSA

Headlines：

```text
China Toy Manufacturer
EN71 ASTM Support
Toy Factory For B2B Buyers
Quality Check Workflow
Export-Ready Toy Delivery
OEM ODM Factory Partner
Educational Toy Manufacturer
Factory Profile Available
Custom Toy Quote Review
Mold Sampling Production
Packaging And Shipment
Supplier Since 2016
```

Descriptions：

```text
Review Yaoshun factory capability for toy OEM/ODM, molding, assembly, packaging and shipment support.
Plan toy projects around target market, quantity, compliance files, packaging and production milestones.
Work with a source factory for educational toys, interlocking toys and custom plastic toy components.
Submit your requirement and receive feasibility notes, quotation assumptions and next-step suggestions.
```

Final URLs：

```text
https://www.yaoshuntoys.com/about
https://www.yaoshuntoys.com/faq
https://www.yaoshuntoys.com/contact
```

## 12. Assets 配置

### 12.1 Sitelinks

建议先建账户级 Sitelinks，再按 Campaign 覆盖。

| Sitelink text | Final URL | Description line 1 | Description line 2 |
| --- | --- | --- | --- |
| Product Catalog | `/products` | Browse fort building kits | Compare kit structures |
| OEM/ODM Solutions | `/solutions` | Review workflow | From sampling to shipment |
| Get A Quote | `/contact` | Send quantity and market | Get practical feedback |
| Factory Profile | `/about` | See company capability | Founded in 2016 |
| FAQ | `/faq` | MOQ and lead time | Packaging and delivery |
| News | `/news` | Project updates | Compliance notes |

### 12.2 Callouts

```text
OEM/ODM Support
Factory Since 2016
Custom Packaging
Mold Development
Injection Molding
Sampling Support
Export Delivery
Quality Checkpoints
EN71 ASTM Planning
Bulk Quote Available
```

### 12.3 Structured snippets

| Header | Values |
| --- | --- |
| Services | OEM, ODM, Sampling, Tooling, Injection Molding, Assembly, Packaging |
| Products | Fort Building Kits, STEM Kits, Glow Kits, Connector Balls, Rods, Color Boxes |
| Markets | US, UK, EU, Canada, Australia, Middle East, Southeast Asia |

### 12.4 Lead Form Asset

第一阶段可以先不用 Google-hosted lead form，优先把用户带到官网表单，因为官网表单会保留项目上下文与归因数据。第二阶段如需降低移动端询盘阻力，可创建 Campaign-level Lead Form Asset。

推荐配置：

| 配置项 | 推荐值 |
| --- | --- |
| CTA | Get quote |
| Headline | Request Toy OEM/ODM Quote |
| Business name | Yaoshun Toys |
| Description | Share product type, quantity, target market and packaging needs. |
| Fields | Name, Email, Company name, Country |
| Questions | Product type, Estimated quantity, Target market, Packaging requirement |
| Privacy policy URL | `https://www.yaoshuntoys.com/privacy` |
| Completion headline | Request received |
| Completion description | Our trade team will review your project details and reply soon. |
| Optimization | More qualified |

注意：Google-hosted lead form 只能每个 Campaign 添加一个，且需要符合 Google lead form 政策。

## 13. Performance Max 第二阶段配置

启用条件：

1. Search 已跑出至少 15-30 个有效询盘。
2. 主转化 `Website Lead - Quote Form` 状态正常。
3. 有足够图片、产品图、工厂图和短视频素材。

Campaign 配置：

| 配置项 | 推荐值 |
| --- | --- |
| Objective | Leads |
| Campaign type | Performance Max |
| Conversion goals | 仅保留 `Website Lead - Quote Form` 为主目标 |
| Budget | Search 总预算的 10%-20% 起步 |
| Bidding | Maximize conversions；有稳定 CPA 后加 Target CPA |
| Final URL expansion | 前 2 周关闭或仅允许核心 URL，避免流量去低意图页面 |
| Locations | 与 Search 高质量国家一致 |
| Language | English |
| Brand exclusions | 排除无关品牌；必要时保护 Yaoshun 品牌词 |

Asset group：`Toy OEM ODM Leads`

| 素材 | 数量要求 |
| --- | --- |
| Final URL | `/solutions` 或 `/contact` |
| Headlines | 11-15 个 |
| Long headline | 1-5 个 |
| Descriptions | 4-5 个 |
| Images | 产品图、工厂图、包装图，横图与方图都要 |
| Logo | 正方形与横版 |
| Video | 10-30 秒产品/工厂短视频；没有视频时 Google 可能自动生成，质量不可控 |
| Audience signals | Toy importers, sourcing managers, private label brands, educational toy buyers, custom manufacturing |
| Search themes | toy oem manufacturer, custom toy manufacturer, fort building kit supplier, stem building kit manufacturer |

## 14. 地域与语言策略

第一阶段优先市场：

| 区域 | 国家/地区 | 备注 |
| --- | --- | --- |
| 北美 | United States, Canada | 高 B2B 采购意图，CPC 可能较高 |
| 欧洲 | United Kingdom, Germany, France, Netherlands | 注意合规关键词 EN71 / REACH |
| 大洋洲 | Australia, New Zealand | 采购词较明确 |
| 中东 | UAE, Saudi Arabia, Qatar, Kuwait | 可测试 wholesale / importer 意图 |
| 亚洲 | Singapore, South Korea, Japan | 英文 Campaign 可先小预算测试 |

不建议第一阶段投放：

1. 全球所有国家。
2. 低预算下同时投太多国家。
3. 使用 `Presence or interest` 去覆盖对某国家感兴趣的人。

## 15. 儿童与玩具广告合规

Yaoshun 的网站定位是 B2B 工厂询盘，不应将广告定位为“面向儿童本人”的购买诱导。

配置要求：

1. 广告文案面向 `brands`、`importers`、`sourcing teams`、`buyers`、`retailers`，不要写成诱导儿童点击。
2. 不使用儿童兴趣、儿童内容、made for kids 内容作为定向。
3. 再营销名单只用于成人 B2B 买家语境，不针对未成年人。
4. 不夸大安全认证；只写 `EN71 / ASTM support` 或 `planning`，除非有明确证书页面支撑。
5. 产品涉及目标市场法规时，落地页与报价沟通中保留测试和合规确认步骤。

## 16. 出价与预算执行

### 16.1 第 1-14 天：探索期

| 项目 | 操作 |
| --- | --- |
| 出价 | Maximize clicks + Max CPC cap |
| CPC 上限 | 美国/英国可先 USD 2-5；其他市场 USD 1-3 |
| 每日检查 | Spend、Search terms、CTR、无效地域、表单是否收到 |
| 转化检查 | 至少手动测试一次表单，不点击真实广告即可用 Tag Assistant 验证标签 |
| 否词 | 每 2-3 天添加一次 |

### 16.2 第 15-45 天：转化优化期

切换条件：

1. 已有 15 个以上可信表单询盘，或至少搜索词质量稳定。
2. 转化状态正常，没有重复计数。
3. 垃圾询盘率可控。

操作：

| 项目 | 操作 |
| --- | --- |
| 出价 | Maximize conversions |
| 预算 | 表现好的 Campaign 增加 20%-30%，不要每天大幅改 |
| 关键词 | 增加高质量搜索词为 Exact |
| 广告 | 暂停低 CTR / 低转化组合，新建第二套 RSA |
| 地域 | 按国家 CPA 分配预算 |

### 16.3 稳定期：Target CPA

当过去 30 天每个 Campaign 有足够有效转化后：

1. 设置 Target CPA，不要低于历史 CPA 太多。
2. 每 7 天最多调整 10%-20%。
3. 如果转化量骤降，先放宽 CPA 或回到 Maximize conversions。

## 17. 每日 / 每周 / 每月优化流程

每日：

1. 检查是否超预算、是否被拒登。
2. 检查是否有异常点击国家或设备。
3. 检查表单邮箱/Tawk 是否收到询盘。
4. 检查 Google Ads 转化状态是否正常。

每周：

1. 下载 Search terms。
2. 添加否词。
3. 把高意图词加入 Exact。
4. 查看国家、设备、时段表现。
5. 检查 RSA asset performance。
6. 比对 Google Ads conversions 与实际邮件询盘数量。

每月：

1. 汇总 Spend、Leads、Valid leads、CPA、Valid lead CPA。
2. 复盘询盘质量：采购商、品牌方、批发商、个人消费者、垃圾询盘。
3. 调整预算到有效国家与有效 ad groups。
4. 新增落地页或优化现有页面 CTA。
5. 判断是否启动 PMax 或扩大预算。

## 18. 上线检查表

上线前必须全部完成：

| 检查项 | 状态 |
| --- | --- |
| Google Ads Billing 已配置 | ☐ |
| Advertiser Verification 无阻塞 | ☐ |
| Auto-tagging 已开启 | ☐ |
| GA4 与 Google Ads 已连接 | ☐ |
| `Website Lead - Quote Form` 是 Primary conversion | ☐ |
| GA4 `generate_lead` 如导入，设置为 Secondary | ☐ |
| 生产环境 Google Ads ID 与 Conversion label 正确 | ☐ |
| Cookie Accept 后 Google tag 正常加载 | ☐ |
| 首页表单测试成功并收到邮件 | ☐ |
| Contact 表单测试成功并收到邮件 | ☐ |
| Tag Assistant 可看到 Google Ads conversion 事件 | ☐ |
| Search Campaign 关闭 Display Network | ☐ |
| Location options 已改为 Presence | ☐ |
| 否词列表已添加 | ☐ |
| 每个 Ad group 至少 1-2 条 RSA | ☐ |
| Sitelinks、Callouts、Structured snippets 已添加 | ☐ |
| Final URL suffix 已配置 | ☐ |
| 隐私政策页面可访问 | ☐ |

## 19. 投放后判断标准

不要只看 leads 数量，要看有效询盘。

| 指标 | 参考标准 |
| --- | --- |
| CTR | Search 非品牌词低于 2% 需要检查关键词/文案 |
| CVR | 表单转化率低于 1% 需要检查搜索词和落地页 |
| Invalid lead rate | 超过 40% 需要加否词、收紧地域、提高表单门槛 |
| Brand CPA | 应显著低于非品牌 CPA |
| Search terms relevance | 低于 70% 相关需要暂停 broad/过泛 phrase |
| Form delivery | Ads 显示转化但邮箱无邮件，要检查表单接口和重复触发 |

## 20. 官方参考

1. Google Ads 网站转化配置：`https://support.google.com/google-ads/answer/16560108`
2. Google Ads Auto-tagging：`https://support.google.com/google-ads/answer/3095550`
3. Google Ads 关键词匹配类型：`https://support.google.com/google-ads/answer/7478529`
4. Google Ads Enhanced Conversions：`https://support.google.com/google-ads/answer/9888656`
5. Google Ads Performance Max：`https://support.google.com/google-ads/answer/10724817`
6. Google Ads Lead Form Assets：`https://support.google.com/google-ads/answer/9423234?hl=en`
7. Google Ads Responsive Search Ads：`https://support.google.com/google-ads/answer/7684791`
8. Google Ads Sitelink Assets：`https://support.google.com/google-ads/answer/2375416`
9. Google Ads Final URL Suffix：`https://support.google.com/google-ads/answer/9054021?hl=en`
10. Google Ads ValueTrack Parameters：`https://support.google.com/google-ads/answer/6305348?hl=en`
11. Google Ads Location Options：`https://support.google.com/google-ads/answer/1722038`
12. Google Ads Ad Schedule：`https://support.google.com/google-ads/answer/6372656`
13. Google Ads Advertiser Verification：`https://support.google.com/adspolicy/answer/9703665`
14. Google Ads Children and Teens Protections：`https://support.google.com/adspolicy/answer/15416897?hl=en`

# whaylu.github.io

个人网站，暖色主题，带一只会说话的桌宠 DeepSeek。

## 功能

- **桌宠 DeepSeek**：固定在右下角，点击说话，按住变扁，悬停换表情
- **元素联动**：鼠标划过带 `data-ds-say` 的元素，桌宠会替它说话
- **暗色模式**：右上角一键切换，偏好存本地，刷新不丢
- **滚动交互**：顶部阅读进度条、导航高亮当前区块、左下角回顶按钮
- **入场动画**：内容滚进视口时淡入上浮，卡片依次错开
- **打字机副标题**：首屏副标题循环打字 / 退格，切换多句话
- **响应式**：适配桌面、平板、手机

## 目录结构

```
.
├── index.html          # 页面结构
├── style.css           # 样式（含亮/暗主题变量、响应式）
├── script.js           # 交互逻辑
└── images/
```

## 本地预览

直接双击 `index.html` 用浏览器打开即可。

如果要用本地服务器（推荐，避免某些浏览器的文件协议限制）：

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

然后访问 `http://localhost:8000`。

## 如何给元素加桌宠台词

在任意 HTML 元素上加 `data-ds-say` 属性：

```html
<div data-ds-say="这句话会被桌宠说出来">悬停我试试</div>
```

还可以用 `data-ds-img` 指定悬停时桌宠换成哪张图：

```html
<span data-ds-say="换表情啦" data-ds-img="images/ds-a.png">标签</span>
```

没有 `data-ds-img` 时，悬停该元素桌宠会立刻回到默认表情。

## 如何改主题色

所有颜色集中在 `style.css` 顶部的 `:root` 里：

```css
:root {
  --bg: #f7f1e8;        /* 背景 */
  --text: #2a2018;      /* 主文字 */
  --accent: #c66a3a;    /* 主题强调色 */
  --gold: #b8894a;      /* 点缀色 */
  /* ... */
}
```

暗色模式对应 `[data-theme="dark"]` 那一段，改完两套一起生效。

## 如何改打字机文案

`script.js` 末尾的 `phrases` 数组，加一句就多一句循环：

```js
const phrases = [
  '撇捺人生皆作游戏，横竖框外天生鬼才',
  '在代码与哲学之间游弋的造物主',
  // 在这里加
];
```

## 如何改桌宠点击台词

`script.js` 开头的 `petQuotes` 数组，随便加。

## 技术栈

纯 HTML + CSS + JavaScript，无框架、无构建、无依赖。
# 間 ma — Research Notes

個人ブログ「間」のための調査メモ。見た目（おしゃん）とエンジニアリング（スッと馴染むがあっと驚く）の両面。

## 参照サイトの特徴

### hiroppy.me
- **書体**: Zen Kaku Gothic New（日本語の読みやすさ重視）
- **色**: theme-color `#3498db`、明るめの背景、テキスト階層が明確
- **構造**: max幅 ~1000px、本文 ~600px、サイドバー + メイン
- **情報設計**: Recent Updates / Works·OSS / Thanks の素直な並置
- **ブログ**: 日付 + タイトル + 短い説明 + タグ。MDX で columns / tree / details など記事内コンポーネントが豊富
- **印象**: エンジニアの拠点。信頼感と明快さ

### sizu.me（しずかなインターネット）
- **思想**: 賑やかな広場ではなく「パーソナルな部屋」。有益さより書き散らし
- **色**: 白とグレー基調。公開記事に薄い青 `#eff7ff`
- **動き**: fadeIn / spring 系の短いアニメ、浮かぶ影は極めて薄い
- **機能哲学**: いいねなし → 感想レター。ひかえめな週1ニュースレター。成長KPIを追わない
- **技術**: Next.js + Cloudflare（CDN/Workers プロキシ）+ R2 など。速さへの執念
- **印象**: 静けさそのものが高級感

### catnose.me
- **構造**: Bio + **Timeline** が主役。活動履歴が人格を伝える
- **色**: `--c-base-text:#0f1420`、ボーダー `#e6edf0`、グレー背景 `rgb(236,243,246)`、アクセント橙 `#ffa353`
- **書体**: Inter + 日本語フォールバック（※本サイトでは Inter を避け、Zen Kaku + Shippori Mincho に）
- **体験**: 猫画像の表情変化など、小さな生命感。サイトを実験場にする姿勢
- **印象**: 読後に「この人が好き」が残る

## おしゃんの共通項（抽出）

1. **余白は装飾ではなく構造**
2. **色数を極限まで減らす**（白・グレー・一つのアクセント）
3. **人柄が情報アーキテクチャになる**（タイムライン / 部屋）
4. **速さは礼儀**
5. **カードやバッジを増やさない**
6. **ブランド（名前）がヒーロー級**

## 研究 → 機能の種

| 知見 | 出典の方向 | 機能への翻訳 |
|------|------------|--------------|
| Cognitive Load / 4 chunks | Sweller, Nielsen | 要旨・集中モード・クロムの開示制御 |
| Signaling effect (g≈0.53 retention) | 学習科学メタ分析 | 見出し階層、gist、読了プログレス |
| Progressive disclosure | UX 古典 | スクロールでナビ退避、`f` でフォーカス |
| Expertise reversal | Kalyuga et al. | j/k キーボード、常連向け加速 |
| Peak–End rule | Kahneman / NN/g | 終盤の余韻、プログレスの終盤感、end-note |
| Spacing / Interleaving | 教育心理学 | 「隣の思考」でムードの違う1本を混ぜる |
| Open loops | 認知負荷の負債 | スクロール位置の再開トースト |
| Quiet subscription | sizu.me 思想 | 押し売りしない導線（RSS/散策） |

## 本サイトのデザイン決定

- ブランド: **間 / ma**
- Display: Shippori Mincho
- Body: Zen Kaku Gothic New
- Accent: sea mist `#2f6f7e`
- 背景: 固定の淡いミストグラデーション + 微細グリッド
- ホーム: フルブリードの大気（hero plane）+ ブランド一文字 + 一文 + CTA
- スタック: Astro (content) + TanStack Query (explore) + Cloudflare Workers adapter

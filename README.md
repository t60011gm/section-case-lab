# Section Case Lab

50 個建築與室內剖面教學案例、總導覽，以及原 B14 示範網站的私人原始碼備份。

## 原網站（未變更網址或發布內容）
- https://section-case-lab.jackylin.chatgpt.site
- https://section-lab-b14.jackylin.chatgpt.site

## 還原與本機預覽
1. 下載本 repository ZIP，或 git clone。
2. 在 `sites/section-case-lab/dist` 執行 `python3 -m http.server 8000`。
3. 瀏覽 `http://localhost:8000`。原 B14 可在 `sites/section-lab-b14/dist` 以相同方式預覽。
4. 在 repository 根目錄執行 `sha256sum -c SHA256SUMS` 驗證檔案。

`.openai/hosting.json` 保存原站識別資訊，僅適用於還原原站；建立新站時勿重用原 project_id，應重新註冊。此 repository 未設定 GitHub Pages、CI 或自動發布，不影響公開網站。

## 範圍與限制
包含 HTML、JavaScript、模型 JSON、圖片、來源連結與地形/建築材質區分版本。50 個案例中 49 個使用模型 JSON，A046 使用內嵌模型程式。模型是教學示意，不是經測繪驗證之 BIM 或施工資料。圖片與外部資料權利仍歸原權利人，私人備份不代表獲得公開再散布授權。未包含密碼、token 或 Git 工作區設定。

## 來源版本
- 主站 v4：`b5c10d970c2a38b78d68e041b03813bd29378bbe`
- 原 B14 v8：`074be159b8127e839926567dd165ab8d24b0cf31`
- 備份日期：2026-11-13

備份以獨立分支及 Draft PR 提交，尚未合併 main。

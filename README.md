# 剖面案例實驗室 · Section Case Lab

這是《剖面案例實驗室》的公開 GitHub 備份。主站收錄 **78 個互動剖面案例**：41 個建築案例與 37 個室內案例。保留原有 50 案，並新增 28 案；案例可操作 X、Y、Z 三軸剖切，網站也可篩選原有或新增案例。

- [剖面案例實驗室（78 案主站）](https://section-case-lab.jackylin.chatgpt.site/)
- [原 B14 示範網站](https://section-lab-b14.jackylin.chatgpt.site/)（獨立保留）
- [剖面占卜所](https://section-arcana.jackylin.chatgpt.site/)（獨立網站，78 張牌連回對應案例；不包含在此備份）

## 本機預覽與檔案驗證

1. 下載本儲存庫的 ZIP 並解壓縮，或以 Git 複製。
2. 在儲存庫根目錄執行 `python3 -m http.server 8000 --directory sites/section-case-lab/dist`。
3. 開啟 [http://localhost:8000/](http://localhost:8000/)。若要預覽原 B14，將指令中的目錄改成 `sites/section-lab-b14/dist`。
4. 在儲存庫根目錄執行 `sha256sum -c SHA256SUMS` 驗證；macOS 可改用 `shasum -a 256 -c SHA256SUMS`。

此儲存庫不會部署或更新公開網站。各站的 `.openai/hosting.json` 保留原站識別資訊，供原站還原使用；另建站時請勿重用原站識別碼。

## 資料與權利

- 包含靜態網站、互動模型、剖面預覽及來源連結。模型為剖面閱讀與教學示意，不是經測繪驗證的 BIM、結構分析或施工圖。
- 新增 28 案附原始剖面來源連結，並區分圖面可見資訊與教學推估；不將這 28 案的原始圖紙重製進本次更新。
- 本儲存庫設為公開，不代表其中的第三方照片、圖面或外部資料均可再散布。相關權利仍歸原權利人；使用前請查核個別來源條件。

## 備份來源

- 主站 v7（2026-11-19）：`458e225ae53b59dd29a92bc224e3fb6a9ac8cdc5`
- 原 B14 v8（沿用既有備份）：`074be159b8127e839926567dd165ab8d24b0cf31`
- 版本資訊與檔案數詳見 [backup-manifest.json](backup-manifest.json)。

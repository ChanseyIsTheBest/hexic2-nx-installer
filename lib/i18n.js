// Interface texts in English and Japanese. Works in the page and in the worker (no DOM here).
// Static texts in index.html name their key with data-i18n (plain text) or data-i18n-html (text with markup).

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: 'uk' },
  { code: 'ja', name: '日本語', flag: 'japan' },
];

const SPHAIRA = '<a href="https://github.com/NaGaa95/sphaira/releases" target="_blank" rel="noopener">Sphaira</a>';
const GAME_PATH = '<code>Content/&lt;profile&gt;/58410826/000D0000</code>';
const UPDATE_PATH = '<code>Content/0000000000000000/58410826/000B0000</code>';

const TEXTS = {
  en: {
    legal:
      'Hexic 2 was developed by Carbonated Games and published by Microsoft. The icon artwork belongs to its owners. hexic2-nx is an unofficial fan project and is not affiliated with or endorsed by Microsoft or Nintendo.',
    sourceCode: 'Source code',
    signature: 'a ChanseyIsTheBest project',
    lead:
      'Builds the <strong>Nintendo Switch</strong> package of <strong>Hexic 2</strong> from your own ' +
      '<strong>Xbox 360</strong> copy and its <strong>Title Update 1</strong>. Everything runs in <strong>this browser</strong>.',
    languageBar: 'Language',
    step1: '1. Choose your game',
    formatPackage: 'Add files',
    formatFolder: 'Add a folder',
    clear: 'Clear',
    ownCopy:
      '<strong>Important:</strong> you need your own copy of the game and its title update, from your own Xbox 360. The installer reads them to make the package; without them there is nothing to play. Nothing is uploaded: your files never leave this computer.',
    formatHint:
      `<strong>The game:</strong> its file in ${GAME_PATH} on your console's storage, or a folder you extracted it into (with <code>default.xex</code>).<br>` +
      `<strong>Title Update 1 (needed):</strong> its file in ${UPDATE_PATH}, or a folder you extracted it into (with <code>default.xexp</code>).<br>` +
      'You can add them together or one at a time.',
    nothingChosen: 'Nothing chosen yet.',
    chosenGame: 'Game: {name} ({size})',
    chosenUpdate: 'Title Update 1: {name} ({size})',
    chosenNoUpdate: 'Title Update 1: not found yet (needed)',
    step2: '2. Create the package',
    step2First: 'If you are installing the game for the first time, use:',
    create: 'Create hexic2-nx.zip',
    step2Update:
      'If the game is already installed and you only want to update it (<code>hexic2-nx.nro</code>, the shaders and the title update), use:',
    createUpdate: 'Create hexic2-nx-update.zip',
    step3: '3. Copy it to the Switch',
    step3Extract: 'Extract the downloaded zip into <code>sdmc:/switch/</code>.',
    step3Start:
      'Start <code>hexic2-nx.nro</code> from the Homebrew Menu in title takeover mode (<strong>launch</strong> a game installed on the Switch ' +
      `<strong>while holding R</strong>) or create a <strong>39-bit forwarder</strong> with ${SPHAIRA}. The album applet does not give the game enough memory.`,
    step3First:
      'The first time you play, new screens can <strong>stutter</strong> for a moment while the graphics are prepared; they are kept on the SD card for the next time.',
    checking: 'Checking your game…',
    supported: 'Xbox 360 version + Title Update 1 · supported',
    unsupported: 'This version of the game is not supported yet.',
    notGame: 'Not the game',
    noGame: 'The game was not found: choose its package, or a folder with default.xex.',
    noUpdate: 'Title Update 1 was not found: add its file, or a folder with its default.xexp.',
    updateDifferent: 'The title update is not Title Update 1 (another version, modified or damaged?).',
    otherTitle: '{name} is not Hexic 2.',
    noStreaming: 'this browser window cannot stream downloads. Use a normal (not private) window.',
    downloadStarted: 'Download started ({size}). Keep this page open until it finishes.',
    finished: 'Finished in {seconds} s.',
    error: 'Error: {message}',
    cancelled: 'the download was cancelled',
    readingFiles: 'Reading your game',
    downloadingBuild: 'Downloading the Switch build',
    logBuild: 'Supported: Hexic 2 for Xbox 360 with Title Update 1 (build {version})',
    logUpdate: 'Update package: hexic2-nx.nro, the shaders and the title update',
    deko3dShaders: "Making the {count} shaders of the deko3d renderer from the game's files",
    deko3dReady: 'deko3d shaders ready: they match the tested ones',
    gameIdentical: 'The game files are identical in number and size to the tested copy',
    gameDifferent: 'Warning: the game files differ from the tested copy (modified or damaged files?). The package is made anyway.',
    packing: 'Writing the package',
    done: 'Done: extract the zip into sdmc:/switch/',
    notSupportedYet: 'this version of the game is not supported yet. Executable fingerprint: {hash}',
    buildMismatch: 'the downloaded Switch build is not the published one ({hash}); try again later',
    deko3dContainers: "the deko3d renderer's shaders were not all found in the game's files ({found} of {wanted}); nothing was written",
    deko3dMismatch: "the deko3d renderer's shaders do not match the tested ones ({hash}); nothing was written",
    incompleteGame: 'Incomplete game: {count} of {expected} files. Only the update package can be made.',
    incompleteError: 'the game is incomplete ({count} of {expected} files): choose the whole game',
    downloadFailed: 'could not download {url} ({status})',
  },
  ja: {
    legal:
      'Hexic 2 は Carbonated Games が開発し Microsoft が発売したゲームです。アイコンのアートワークの権利は各権利者に帰属します。hexic2-nx は非公式のファンプロジェクトであり、Microsoft および Nintendo とは関係がなく、承認も受けていません。',
    sourceCode: 'ソースコード',
    signature: 'ChanseyIsTheBest のプロジェクト',
    lead:
      'ご自身の <strong>Xbox 360</strong> 版と<strong>タイトルアップデート 1</strong> から、<strong>Hexic 2</strong> の <strong>Nintendo Switch</strong> 用パッケージを作成します。すべて<strong>このブラウザ内</strong>で処理されます。',
    languageBar: '言語',
    step1: '1. ゲームを選ぶ',
    formatPackage: 'ファイルを追加',
    formatFolder: 'フォルダーを追加',
    clear: 'クリア',
    ownCopy:
      '<strong>重要：</strong>ご自身の Xbox 360 にあるゲームとタイトルアップデートが必要です。インストーラーはそれらを読み込んでパッケージを作成します。何もアップロードされません。ファイルがこのコンピューターの外に出ることはありません。',
    formatHint:
      `<strong>ゲーム：</strong>本体ストレージの ${GAME_PATH} にあるファイル、または展開したフォルダー（<code>default.xex</code> を含むもの）。<br>` +
      `<strong>タイトルアップデート 1（必須）：</strong>${UPDATE_PATH} にあるファイル、または展開したフォルダー（<code>default.xexp</code> を含むもの）。<br>` +
      '一緒に追加することも、1 つずつ追加することもできます。',
    nothingChosen: 'まだ何も選ばれていません。',
    chosenGame: 'ゲーム：{name}（{size}）',
    chosenUpdate: 'タイトルアップデート 1：{name}（{size}）',
    chosenNoUpdate: 'タイトルアップデート 1：まだ見つかりません（必要です）',
    step2: '2. パッケージを作成する',
    step2First: '初めてゲームをインストールする場合：',
    create: 'hexic2-nx.zip を作成',
    step2Update: 'インストール済みで、更新（<code>hexic2-nx.nro</code>、シェーダー、タイトルアップデート）だけを行う場合：',
    createUpdate: 'hexic2-nx-update.zip を作成',
    step3: '3. Switch にコピーする',
    step3Extract: 'ダウンロードした zip を <code>sdmc:/switch/</code> に展開します。',
    step3Start:
      '<strong>タイトル乗っ取りモード</strong>の Homebrew Menu から <code>hexic2-nx.nro</code> を起動するか（Switch にインストールされたゲームを <strong>R を押しながら起動</strong>）、' +
      `${SPHAIRA} で <strong>39 ビットのフォワーダー</strong>を作成します。アルバムアプレットではゲームに必要なメモリが足りません。`,
    step3First:
      '初めてプレイするときは、グラフィックの準備のため、新しい画面で一瞬<strong>カクつく</strong>ことがあります。準備したものは SD カードに保存され、次回からは使い回されます。',
    checking: 'ゲームを確認しています…',
    supported: 'Xbox 360 版 + タイトルアップデート 1 · 対応',
    unsupported: 'このバージョンのゲームにはまだ対応していません。',
    notGame: 'ゲームではありません',
    noGame: 'ゲームが見つかりません。ゲームパッケージ、または default.xex を含むフォルダーを選んでください。',
    noUpdate: 'タイトルアップデート 1 が見つかりません。そのファイル、または default.xexp を含むフォルダーを追加してください。',
    updateDifferent: 'タイトルアップデートが 3 ではありません（別のバージョン、改変または破損？）。',
    otherTitle: '{name} は Hexic 2 ではありません。',
    noStreaming: 'このブラウザウィンドウではダウンロードをストリーミングできません。通常の（プライベートではない）ウィンドウを使ってください。',
    downloadStarted: 'ダウンロードを開始しました（{size}）。完了するまでこのページを開いたままにしてください。',
    finished: '{seconds} 秒で完了しました。',
    error: 'エラー：{message}',
    cancelled: 'ダウンロードがキャンセルされました',
    readingFiles: 'ゲームを読み込んでいます',
    downloadingBuild: 'Switch 版をダウンロードしています',
    logBuild: '対応：Xbox 360 版 Hexic 2 + タイトルアップデート 1（ビルド {version}）',
    logUpdate: '更新パッケージ：hexic2-nx.nro、シェーダー、タイトルアップデート',
    deko3dShaders: 'ゲームのファイルから deko3d レンダラーの {count} 個のシェーダーを作成しています',
    deko3dReady: 'deko3d シェーダーの準備ができました（テスト済みのものと一致）',
    gameIdentical: 'ゲームファイルの数とサイズはテスト済みのコピーと同一です',
    gameDifferent: '警告：ゲームファイルがテスト済みのコピーと異なります（改変または破損したファイル？）。パッケージはそのまま作成します。',
    packing: 'パッケージを書き込んでいます',
    done: '完了：zip を sdmc:/switch/ に展開してください',
    notSupportedYet: 'このバージョンのゲームにはまだ対応していません。実行ファイルのフィンガープリント：{hash}',
    buildMismatch: 'ダウンロードした Switch 版が公開版と一致しません（{hash}）。しばらくしてからもう一度お試しください',
    deko3dContainers: 'deko3d レンダラーのシェーダーがゲームのファイルにすべて見つかりません（{wanted} 個中 {found} 個）。何も書き込まれていません',
    deko3dMismatch: 'deko3d レンダラーのシェーダーがテスト済みのものと一致しません（{hash}）。何も書き込まれていません',
    incompleteGame: 'ゲームが不完全です：{expected} ファイル中 {count} ファイル。更新パッケージのみ作成できます。',
    incompleteError: 'ゲームが不完全です（{expected} ファイル中 {count} ファイル）。ゲーム全体を選んでください',
    downloadFailed: '{url} をダウンロードできませんでした（{status}）',
  },
};

let current = 'en';

export function getLanguage() {
  return current;
}

export function setLanguage(code) {
  current = TEXTS[code] ? code : 'en';
  return current;
}

// The visitor's choice (saved in their browser), else the browser's language when it is one of ours, else English.
export function preferredLanguage(saved, browser = []) {
  if (saved && TEXTS[saved]) {
    return saved;
  }
  for (const tag of browser) {
    const code = String(tag).toLowerCase().split('-')[0];
    if (TEXTS[code]) {
      return code;
    }
  }
  return 'en';
}

export function t(key, params = {}) {
  const text = TEXTS[current][key] ?? TEXTS.en[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => (params[name] ?? `{${name}}`));
}

// Sizes as Windows Explorer shows them, so the page and the file's properties agree: units of 1024 bytes (which
// Windows calls KB, MB and GB) and three significant digits, truncated. 7,834,892,288 bytes is 7.29 GB, not 7.83.
const SIZE_UNITS = {};

export function formatSize(bytes) {
  const units = SIZE_UNITS[current] ?? ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  const scale = 10 ** decimals;
  // The small epsilon keeps values such as 7.3 from becoming 7.29 through floating point.
  const shown = Math.floor(value * scale + 1e-9) / scale;
  const number = new Intl.NumberFormat(current, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${number.format(shown)} ${units[unit]}`;
}

/* ════════════════════════════════
   RESULTS DATA  （第三版 — 反轉童話異世界移居指南）
   代號：BRO / SHA / PIP / KING / BEAST / THORN / RACE / CROW / CANDY / CIND / ESC
════════════════════════════════ */

// 三個定居評估指標的標籤，集中管理（實際數值由 engine.js 的 calcMetricPercent() 動態計算）
const metricLabels = {
  survival: "童話世界生存率",
  happiness: "幸福指數",
  fate: "命運干預值",
};

const resultsData = {
  /* ── BRO｜兩兄弟 ── */
  BRO: {
    label: "兩兄弟",
    storyName: "石中劍",
    concept:
      "哥哥拔出了石中劍成王，弟弟卻發現，真正被選中的從來不是王，而是替王去死的人。",
    resultText:
      "你適合穿越進去《兩兄弟》（石中劍 IF線）\n重情重義的你，總會在關鍵時刻為重要的人挺身而出；只是別忘了，你也值得被拯救一次。",

    image: "https://tealize-write.github.io/TwistedTales/img/BRO.png",
    residentType: "被命運選中的替身者",
    residentDesc:
      "你不是王，也不只是旁觀者。你更像那種一旦被命運點名，就很難再全身而退的人。故事會把你放在最關鍵的位置，然後等著看你怎麼選。",
    worldQuote: "「這裡不缺王，缺的是願意替王流血的人。」",
    settlementAdvice:
      "若你在這個世界聽見有人說你『很適合扛下來』，請立刻提高警覺。這裡的命運喜歡把最重的事交給最不會說不的人。",
    alliedWorlds: ["THORN", "BEAST"],
    conflictingWorlds: ["ESC", "KING"],

    metrics: { survival: 45, happiness: 60, fate: 88 },
    mbti: [
      { type: "ISFJ", pct: 60 },
      { type: "INFJ", pct: 28 },
      { type: "ESFJ", pct: 12 },
    ],
    bookName: "《兩兄弟》",
    bookAuthor: "吳墨",
    bookFairy: "兩兄弟",
    bookTags: ["劍", "抹布", "精神崩潰"],
    link: "https://early-marketplaces-521584.framer.app/preview/story9",
  },

  /* ── SHA｜影子 ── */
  SHA: {
    label: "影子",
    storyName: "美人魚",
    concept:
      "禁慾學者翻開那本會低語的魔法書，才發現只要交換一點代價，影子也能長出雙腿，學著走進主人的世界。",
    resultText:
      "你適合穿越進去《影子吻了我》（美人魚 IF線）\n理性克制的你，總把真正的渴望藏得很深；可一旦動心，有些代價可不是把心事吞回去就能解決的喔。",

    image: "https://tealize-write.github.io/TwistedTales/img/SHA.png",
    residentType: "與影共生的禁書住民",
    residentDesc:
      "你在這個世界裡最容易被誤認為普通人——直到你的影子開始比你更早出現在門口。這裡的人會慢慢意識到，你比你看起來更懂這個世界的規則。",
    worldQuote: "「若你開始聽見影子的腳步聲，表示它已經決定跟你回家。」",
    settlementAdvice:
      "入住前，建議先決定好哪些東西是你願意交換的。這個世界的代價從不明碼標價，而你最不缺的，就是把事情看清楚的能力。",
    alliedWorlds: ["CROW", "CIND"],
    conflictingWorlds: ["ESC", "BRO"],

    metrics: { survival: 58, happiness: 52, fate: 75 },
    mbti: [
      { type: "INTJ", pct: 55 },
      { type: "INTP", pct: 30 },
      { type: "INFJ", pct: 15 },
    ],
    bookName: "《影子吻了我》",
    bookAuthor: "相對之下",
    bookFairy: "影子",
    bookTags: ["甜寵", "詛咒", "窒息"],
    link: "https://early-marketplaces-521584.framer.app/preview/story5",
  },

  /* ── PIP｜吹笛手 ── */
  PIP: {
    label: "哈梅爾的吹笛手",
    storyName: "胡桃鉗",
    concept: "病態吹笛人一曲下去，小老鼠沒逃走，反而全變成了替他打仗的玩具兵。",
    resultText:
      "你適合穿越進去《哈梅爾的吹笛手》（胡桃鉗 IF線）\n你對危險與誘惑總有一種微妙的好奇心，越奇怪的東西越想靠近；但要小心，玩具和怪物有時只差一首曲子的距離。",

    image: "https://tealize-write.github.io/TwistedTales/img/PIP.png",
    residentType: "旋律召來的異鄉信徒",
    residentDesc:
      "你走進這個世界的瞬間，原有的節奏就變了。不是你刻意打亂，只是你存在的頻率，跟這個世界的底層旋律有某種危險的共鳴。",
    worldQuote: "「本世界音頻異常，建議入境前自行評估對笛聲的抵抗力。」",
    settlementAdvice:
      "入住後，建議避免在公共場所哼歌。這個世界的旋律有時候不由你控制，一旦召喚開始，就很難在中途停下。",
    alliedWorlds: ["BEAST", "THORN"],
    conflictingWorlds: ["ESC", "RACE"],

    metrics: { survival: 32, happiness: 48, fate: 70 },
    mbti: [
      { type: "ENTP", pct: 50 },
      { type: "ISTP", pct: 32 },
      { type: "INFP", pct: 18 },
    ],
    bookName: "《哈梅爾的吹笛手》",
    bookAuthor: "九楠",
    bookFairy: "哈梅爾的吹笛手",
    bookTags: ["戰損", "養成", "瘋"],
    link: "https://early-marketplaces-521584.framer.app/preview/story4",
  },

  /* ── KING｜國王的新衣 ── */
  KING: {
    label: "國王的新衣",
    storyName: "小王子",
    concept: "他頭上的皇冠看起來像王權，其實只是把他永遠困在孤獨星球上的重力。",
    resultText:
      "你適合穿越進去《國王的新衣》（小王子 IF線）\n安靜細膩的你，很擅長把情緒藏進沉默裡；只是有時候，太懂事的人，也最容易被留在自己的小星球上。",

    image: "https://tealize-write.github.io/TwistedTales/img/KING.png",
    residentType: "被王權包裝的孤星居民",
    residentDesc:
      "你在這裡以皇冠示人，卻沒人知道皇冠底下是什麼。這個世界欣賞有型的人，而你最擅長把所有重量，折疊進那頂看不出重量的冠裡。",
    worldQuote: "「皇冠的重量因人而異。有些人戴上之後，就再也摘不下來了。」",
    settlementAdvice:
      "定居前，建議先評估你的星球能承受多少孤獨。這裡的情感向來以靜默計價，你的耐受度，決定你能在這裡活得多自在。",
    alliedWorlds: ["SHA", "CIND"],
    conflictingWorlds: ["PIP", "ESC"],

    metrics: { survival: 50, happiness: 42, fate: 82 },
    mbti: [
      { type: "INFP", pct: 58 },
      { type: "INFJ", pct: 28 },
      { type: "ISFP", pct: 14 },
    ],
    bookName: "《溫先生他一絲不掛》",
    bookAuthor: "火登",
    bookFairy: "國王的新衣",
    bookTags: ["口交", "年下", "下剋上"],
    link: "https://early-marketplaces-521584.framer.app/preview/story6",
  },

  /* ── BEAST｜美女與野獸 ── */
  BEAST: {
    label: "美女與野獸",
    storyName: "獅子與老鼠",
    concept:
      "能徒手撕碎整座王宮的黑獅，偏偏一輩子都兇不過當年救過他的那隻小東西。",
    resultText:
      "你適合穿越進去《美女與野獸》（獅子與老鼠 IF線）\n你外柔內韌，看起來溫和，實際上很有馴服猛獸的本事；不過別忘了，靠近野獸之前，也要先確認自己跑不跑得掉。",

    image: "https://tealize-write.github.io/TwistedTales/img/BEAST.png",
    residentType: "野性邊界的誤闖定居者",
    residentDesc:
      "你是那種走進花園、黑獅會抬頭的人。不是因為你危險，而是你身上有某種東西讓巨大的存在想靠近，卻不確定該怎麼靠近。",
    worldQuote:
      "「花園的門從不上鎖，但進來的人，往往不知道自己何時選擇了留下。」",
    settlementAdvice:
      "在這裡生活，建議學會分辨哪些咆哮是威脅，哪些只是還不知道怎麼說『請留下來』。你和野獸之間的距離，往往比你以為的更近。",
    alliedWorlds: ["BRO", "THORN"],
    conflictingWorlds: ["ESC", "RACE"],

    metrics: { survival: 38, happiness: 72, fate: 65 },
    mbti: [
      { type: "ISFJ", pct: 45 },
      { type: "INFP", pct: 35 },
      { type: "ESFP", pct: 20 },
    ],
    bookName: "《咬了神一口》",
    bookAuthor: "兌現藍",
    bookFairy: "美女與野獸",
    bookTags: ["綑綁", "獸人", "互攻"],
    link: "https://early-marketplaces-521584.framer.app/preview/story10",
  },

  /* ── THORN｜沉睡荊棘 ── */
  THORN: {
    label: "白雪公主佐睡美人",
    storyName: "龍與地下城",
    concept:
      "他原本只是被獻給惡龍的祭品，最後卻在高塔裡被養成了比寶藏更珍貴的那個人。",
    resultText:
      "你適合穿越進去《白雪公主佐睡美人》（龍與地下城 IF線）\n你身上有一種越危險越迷人的特質，總會讓人忍不住想把你藏進最深的高塔；只是寶藏被珍藏久了，也可能忘記怎麼離開。",

    image: "https://tealize-write.github.io/TwistedTales/img/THORN.png",
    residentType: "高塔深處的珍稀典藏者",
    residentDesc:
      "你在這個世界很容易被視為值得珍藏的存在——不是因為你脆弱，而是你身上有某種光，讓人忍不住想把你放進最安全的地方。",
    worldQuote: "「高塔居住品質五星，但請注意：本世界荊棘具有情感附著性。」",
    settlementAdvice:
      "高塔內部居住品質良好，但長期居留者普遍會對離開產生抗拒。建議定期確認出口位置，不是因為你要走，而是讓自己知道門在哪裡。",
    alliedWorlds: ["BEAST", "BRO"],
    conflictingWorlds: ["ESC", "RACE"],

    metrics: { survival: 28, happiness: 68, fate: 92 },
    mbti: [
      { type: "INFJ", pct: 52 },
      { type: "ISFP", pct: 30 },
      { type: "ENFP", pct: 18 },
    ],
    bookName: "《沉睡荊棘》",
    bookAuthor: "喵芭渴死姬",
    bookFairy: "白雪公主|睡美人",
    bookTags: ["蘋果", "禁慾", "龍"],
    link: "https://early-marketplaces-521584.framer.app/preview/story1",
  },

  /* ── RACE｜龜兔賽跑 ── */
  RACE: {
    label: "龜兔賽跑",
    storyName: "愛麗絲夢遊仙境",
    concept:
      "兔子不是跑輸了，只是每一次故意遲到，都是為了晚一點掉進那個不能回頭的兔子洞。",
    resultText:
      "你適合穿越進去《龜兔賽跑》（愛麗絲夢遊仙境 IF線）\n腦袋轉得飛快的你，總比別人更早看見另一條路；但捷徑走多了，也要小心自己是不是已經掉進太深的兔子洞。",

    image: "https://tealize-write.github.io/TwistedTales/img/RACE.png",
    residentType: "賽道外側的戰略快跑者",
    residentDesc:
      "你永遠比別人多算一步，但這個世界的賽道有個秘密：終點線會移動。你需要的不是跑得更快，而是決定什麼時候可以假裝停下來。",
    worldQuote:
      "「本世界終點線位置不固定，建議隨時調整目標，並預備備用路線。」",
    settlementAdvice:
      "入住愛麗絲世界前，記好兔子洞的出口。這裡的規則每天都在變，而真正的高手，是那個知道什麼時候可以假裝輸掉的人。",
    alliedWorlds: ["SHA", "CIND"],
    conflictingWorlds: ["BRO", "PIP"],

    metrics: { survival: 75, happiness: 55, fate: 38 },
    mbti: [
      { type: "ENTP", pct: 55 },
      { type: "INTJ", pct: 30 },
      { type: "INTP", pct: 15 },
    ],
    bookName: "《消失的終點線》",
    bookAuthor: "葦",
    bookFairy: "龜兔賽跑",
    bookTags: ["強制愛", "NTR", "高潮地獄"],
    link: "https://early-marketplaces-521584.framer.app/preview/story8",
  },

  /* ── CROW｜烏鴉 ── */
  CROW: {
    label: "烏鴉與水瓶",
    storyName: "醜小鴨",
    concept:
      "人人都笑他是黑漆漆的烏鴉，只有他知道自己曾經也是一隻被詛咒折斷翅膀的天鵝。",
    resultText:
      "你適合穿越進去《烏鴉與水瓶》（醜小鴨 IF線）\n你也許常覺得自己和別人格格不入，卻總有一天會長成最特別的模樣；在那之前，請先學會喜歡現在的自己。",

    image: "https://tealize-write.github.io/TwistedTales/img/CROW.png",
    residentType: "高處棲息的局外見證者",
    residentDesc:
      "你在這個世界的存在方式，像一隻停在高處的烏鴉——看得清楚，卻不急著飛下去。有些人以為你冷漠，只有你知道，你只是在等一個值得的理由。",
    worldQuote: "「石頭很重，水瓶很深。但如果你願意等，水位終究會升上來。」",
    settlementAdvice:
      "在醜小鴨的世界定居時，記得你帶進來的寶石屬於你。這裡的人習慣用外表判斷價值，但故事最後誰最耀眼，往往出人意料。",
    alliedWorlds: ["CIND", "SHA"],
    conflictingWorlds: ["PIP", "CANDY"],

    metrics: { survival: 65, happiness: 45, fate: 58 },
    mbti: [
      { type: "INTP", pct: 50 },
      { type: "INFP", pct: 32 },
      { type: "ISTP", pct: 18 },
    ],
    bookName: "《寶石、烏鴉和水瓶》",
    bookAuthor: "君羊",
    bookFairy: "烏鴉與水瓶",
    bookTags: ["囚禁", "烏鴉", "殘疾"],
    link: "https://early-marketplaces-521584.framer.app/preview/story2",
  },

  /* ── CANDY｜糖裹屋 ── */
  CANDY: {
    label: "糖果屋",
    storyName: "小紅帽",
    concept:
      "他披著救人的紅披風走進森林，卻比狼更早一步，把人哄進自己親手搭好的糖果牢籠。",
    resultText:
      "你適合穿越進去《糖果屋》（小紅帽 IF線）\n從不害怕捷徑的你，勇敢果決，也很願意追著香甜的誘惑往前走；但也要小心，別一不小心就被關進一方小天地喔。",

    image: "https://tealize-write.github.io/TwistedTales/img/CANDY.png",
    residentType: "甜蜜牢籠的自願定居者",
    residentDesc:
      "你走進這個世界的方式，是先被香味吸引，然後才發現門關上了。不過說實話——糖果屋的門，從裡面也鎖得住。",
    worldQuote: "「本世界糖分偏高，出入口辨識度偏低，請自行保管理智。」",
    settlementAdvice:
      "定居前，建議確認自己對甜的耐受度。這裡的幸福是真的，只是濃度偏高——適應期過後，大多數居民都不再想離開，這本身值得你思考一下。",
    alliedWorlds: ["CIND", "THORN"],
    conflictingWorlds: ["ESC", "RACE"],

    metrics: { survival: 22, happiness: 85, fate: 48 },
    mbti: [
      { type: "ESFP", pct: 50 },
      { type: "ENFP", pct: 30 },
      { type: "ESTP", pct: 20 },
    ],
    bookName: "《糖裹屋》",
    bookAuthor: "蘇朵拉",
    bookFairy: "糖果屋",
    bookTags: ["失禁", "骨科", "重生"],
    link: "https://early-marketplaces-521584.framer.app/preview/story3",
  },

  /* ── CIND｜灰姑娘 ── */
  CIND: {
    label: "灰姑娘",
    storyName: "歌劇魅影",
    concept:
      "舞會上驚艷眾生的不是灰姑娘的臉，而是那張一旦摘下就會讓所有人失控的面具。",
    resultText:
      "你適合穿越進去《灰姑娘》（歌劇魅影 IF線）\n你天生就有一種神祕又疏離的魅力，越是藏著，越容易讓人移不開眼；只是面具戴久了，也別忘了真正想被誰看見。",

    image: "https://tealize-write.github.io/TwistedTales/img/CIND.png",
    residentType: "面具之下的神秘入境者",
    residentDesc:
      "你在這個世界不需要做什麼，只需要出現。然後所有人開始想知道：面具底下是什麼。你的存在本身，就是這個世界最大的謎題。",
    worldQuote:
      "「舞會每晚舉行，面具隨處可得。唯一的問題是：你確定自己知道是誰嗎？」",
    settlementAdvice:
      "在歌劇魅影的世界定居時，記住舞會的規則：午夜一到，什麼都可以消失。你需要的不是更好的面具，而是決定什麼時候值得摘下它。",
    alliedWorlds: ["SHA", "CROW"],
    conflictingWorlds: ["BRO", "PIP"],

    metrics: { survival: 62, happiness: 70, fate: 55 },
    mbti: [
      { type: "INTJ", pct: 55 },
      { type: "INFJ", pct: 28 },
      { type: "ISTP", pct: 17 },
    ],
    bookName: "《灰燼》",
    bookAuthor: "悠然",
    bookFairy: "灰姑娘",
    bookTags: ["面具", "競爭意識", "醉酒"],
    link: "https://early-marketplaces-521584.framer.app/preview/story7",
  },

  /* ── ESC｜清醒旁觀者 / 特殊結局 ── */
  ESC: {
    label: "萬年回家社社員",
    storyName: "逃脫成功結局",
    concept:
      "有些人走進故事，有些人站在故事之外——你屬於後者，而這本身就是一種罕見的能力。",
    resultText:
      "你選擇了清醒（特殊結局）\n在故事最危險的時刻，你選擇保持清醒。這不是懦弱，而是一種罕見的自知——知道什麼時候該停下，知道什麼值得冒險，知道自己是誰。",

    image: "https://tealize-write.github.io/TwistedTales/img/ESC.png",
    residentType: "留在現實世界的清醒者",
    residentDesc:
      "你在所有世界裡都是最難被故事捲走的人——因為你從來不打算真的留下來。這讓你成為最難被反將一軍的定居者，也是最危險的旁觀者。",
    worldQuote: "「本世界不強制留人，但有時候會讓人想回來。」",
    settlementAdvice:
      "本世界適合短期觀光，不建議情感投入過深。若你已經開始猶豫是否要回頭——恭喜你，那才是你的故事真正開始的地方。",
    alliedWorlds: [],
    conflictingWorlds: ["PIP", "BRO"],

    metrics: { survival: 90, happiness: 78, fate: 15 },
    mbti: [
      { type: "INTP", pct: 50 },
      { type: "INTJ", pct: 32 },
      { type: "INFJ", pct: 18 },
    ],
    bookName: "《故事另有結局》",
    bookAuthor: "大癲群",
    bookFairy: "萬年回家社社員",
    bookTags: ["旁觀", "清醒", "逃脫成功"],
    link: "https://early-marketplaces-521584.framer.app/",
  },
};

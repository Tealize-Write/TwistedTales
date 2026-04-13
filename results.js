/* ════════════════════════════════
   RESULTS DATA  （第二版 — 故事分類結構）
   代號：BRO / SHA / PIP / KING / BEAST / THORN / RACE / CROW / CANDY / CIND / ESC
════════════════════════════════ */

const resultsData = {

  /* ── BRO｜兩兄弟 ── */
  BRO: {
    label:      "兩兄弟",
    storyName:  "石中劍",
    concept:    "哥哥拔出了石中劍成王，弟弟卻發現，真正被選中的從來不是王，而是替王去死的人。",
    resultText: "你適合穿越進去《石中劍》（兩兄弟 IF線）\n重情重義的你，總會在關鍵時刻為重要的人挺身而出；只是別忘了，你也值得被拯救一次。",
    sourceKeys: ["A_CHAOS_1", "R_CHAOS_2"],

    image:      "https://tealize-write.github.io/DarkBLstory/img/heart.png",
    soulName:   "無情獸群攻",
    soulDesc:   "你不懂什麼叫做「適可而止」，你只知道你想要的，就必須全部拿到，哪怕是糟蹋全世界。",
    danger: "極高", dangerFill: "100%",
    attr: "破壞指數", attrVal: "Max", attrFill: "100%",
    escape: "5%",
    quote:  "「如果你愛我，你得證明才行。」",
    guide:  "你知道自己也能裝得很溫柔。可以關心，可以哄騙，可以用眼淚和體溫一步一步把人留住。可你比誰都清楚——你的愛，從來都不是無條件給予。",
    bookName: "《兩兄弟》", bookAuthor: "吳墨", bookFairy: "石中劍",
    bookTags: ["劍", "抹布", "精神崩潰"],
    link: "https://early-marketplaces-521584.framer.app/preview/story9",
    mbti: "INFJ", cp1: "殉道自我奉獻受", cp2: ["斯德哥爾摩受", "恣情魅惑受"],
  },

  /* ── SHA｜影子 ── */
  SHA: {
    label:      "影子",
    storyName:  "美人魚",
    concept:    "禁慾學者翻開那本會低語的魔法書，才發現只要交換一點代價，影子也能長出雙腿，學著走進主人的世界。",
    resultText: "你適合穿越進去《美人魚》（影子 IF線）\n理性克制的你，總把真正的渴望藏得很深；可一旦動心，有些代價可不是把心事吞回去就能解決的喔。",
    sourceKeys: ["A_SCHEME_2", "R_CONTROL_3"],

    image:      "https://framerusercontent.com/images/uQPprKfZezv518Mf1QK2enDGzTI.png",
    soulName:   "不羈影子攻",
    soulDesc:   "每一場對話都是獵場，你永遠比對方快三步。",
    danger: "高", dangerFill: "80%",
    attr: "腹黑指數", attrVal: "Max", attrFill: "100%",
    escape: "15%",
    quote:  "「您不認得您的老影子了嗎？『主人』。」",
    guide:  "用話語設陷，用行動主導，強勢解開所有束縛。",
    bookName: "《影子吻了我》", bookAuthor: "相對之下", bookFairy: "美人魚",
    bookTags: ["甜寵", "詛咒", "窒息"],
    link: "https://early-marketplaces-521584.framer.app/preview/story5",
    mbti: "ENTJ", cp1: "禁慾學者受", cp2: ["殉道自我奉獻受", "斯德哥爾摩受"],
  },

  /* ── PIP｜吹笛手 ── */
  PIP: {
    label:      "哈梅爾的吹笛手",
    storyName:  "胡桃鉗",
    concept:    "病態吹笛人一曲下去，小老鼠沒逃走，反而全變成了替他打仗的玩具兵。",
    resultText: "你適合穿越進去《胡桃鉗》（哈梅爾的吹笛手 IF線）\n你對危險與誘惑總有一種微妙的好奇心，越奇怪的東西越想靠近；但要小心，玩具和怪物有時只差一首曲子的距離。",
    sourceKeys: ["A_DEVOTION_3", "R_CHAOS_1"],

    image:      "https://framerusercontent.com/images/nRtAWmBjy7p9qD7Whz9VxlL0myQ.png",
    soulName:   "病態攻",
    soulDesc:   "愛會讓一個人卑微成為一條狗，而你是專業優雅的訓犬師。",
    danger: "極高", dangerFill: "100%",
    attr: "控制指數", attrVal: "Max", attrFill: "100%",
    escape: "0%",
    quote:  "「不能懷疑我對你的愛，不許質疑你的神。」",
    guide:  "愛是信仰，愛是臣服，愛是奉獻——這將決定他有沒有資格成為你的信徒。",
    bookName: "《哈梅爾的吹笛手》", bookAuthor: "九楠", bookFairy: "胡桃鉗",
    bookTags: ["戰損", "養成", "瘋"],
    link: "https://early-marketplaces-521584.framer.app/preview/story4",
    mbti: "ISTJ", cp1: "斯德哥爾摩受", cp2: ["自願沉淪受", "殉道自我奉獻受"],
  },

  /* ── KING｜國王的新衣 ── */
  KING: {
    label:      "國王的新衣",
    storyName:  "小王子",
    concept:    "他頭上的皇冠看起來像王權，其實只是把他永遠困在孤獨星球上的重力。",
    resultText: "你適合穿越進去《小王子》（國王的新衣 IF線）\n安靜細膩的你，很擅長把情緒藏進沉默裡；只是有時候，太懂事的人，也最容易被留在自己的小星球上。",
    sourceKeys: ["A_SCHEME_3", "R_SCHEME_2"],

    image:      "https://tealize-write.github.io/DarkBLstory/img/king_A.png",
    soulName:   "偏執瘋子攻",
    soulDesc:   "你深知他不應該跟你在一起，所以你脫光他、折辱他；可你又不願意他離開，所以抱他、吻他、愛他。",
    danger: "極高", dangerFill: "85%",
    attr: "黑化指數", attrVal: "Max", attrFill: "100%",
    escape: "5%",
    quote:  "「能不能想著我，只想著我，永遠想著我，不要再有別人，把你的喜歡全給我⋯⋯」",
    guide:  "脫下國王的衣服，聞他後頸的味道，在他身體裡融入你的費洛蒙，國王哭了，你是那樣愉悅又幸福。",
    bookName: "《溫先生他一絲不掛》", bookAuthor: "火登", bookFairy: "小王子",
    bookTags: ["口交", "年下", "下剋上"],
    link: "https://early-marketplaces-521584.framer.app/preview/story6",
    mbti: "ISTJ", cp1: "隱忍美人受", cp2: ["殉道自我奉獻受", "自願沉淪受"],
  },

  /* ── BEAST｜美女與野獸 ── */
  BEAST: {
    label:      "美女與野獸",
    storyName:  "獅子與老鼠",
    concept:    "能徒手撕碎整座王宮的黑獅，偏偏一輩子都兇不過當年救過他的那隻小東西。",
    resultText: "你適合穿越進去《獅子與老鼠》（美女與野獸 IF線）\n你外柔內韌，看起來溫和，實際上很有馴服猛獸的本事；不過別忘了，靠近野獸之前，也要先確認自己跑不跑得掉。",
    sourceKeys: ["A_CONTROL_3", "A_CHAOS_2"],

    image:      "https://tealize-write.github.io/DarkBLstory/img/bite_god.png",
    soulName:   "冰山白神攻",
    soulDesc:   "你是規則，你就是對方的世界觀。沒有人會想反抗一座冰山，除了鐵達尼號。",
    danger: "極高", dangerFill: "90%",
    attr: "控制指數", attrVal: "Max", attrFill: "100%",
    escape: "1%",
    quote:  "「摘下梔子的生殖器，就要抵上爪子。否則不得離開。」",
    guide:  "你珍愛信徒，用禁忌圍困異教徒；若異教徒反抗，你也欣賞著他的行為表演，再按在地上。",
    bookName: "《咬了神一口》", bookAuthor: "兌現藍", bookFairy: "獅子與老鼠",
    bookTags: ["綑綁", "獸人", "互攻"],
    link: "https://early-marketplaces-521584.framer.app/preview/story10",
    mbti: "ISFJ", cp1: "暴力黑獅攻", cp2: ["斯德哥爾摩受", "自願沉淪受"],
  },

  /* ── THORN｜沉睡荊棘 ── */
  THORN: {
    label:      "沉睡荊棘",
    storyName:  "龍與地下城",
    concept:    "他原本只是被獻給惡龍的祭品，最後卻在高塔裡被養成了比寶藏更珍貴的那個人。",
    resultText: "你適合穿越進去《龍與地下城》（沉睡荊棘 IF線）\n你身上有一種越危險越迷人的特質，總會讓人忍不住想把你藏進最深的高塔；只是寶藏被珍藏久了，也可能忘記怎麼離開。",
    sourceKeys: ["A_DEVOTION_1", "R_DEVOTION_2"],

    image:      "https://tealize-write.github.io/DarkBLstory/img/apple.png",
    soulName:   "二哈黑龍攻",
    soulDesc:   "看著是條猛龍，實則是狗！真的狗！",
    danger: "高", dangerFill: "90%",
    attr: "護食指數", attrVal: "極高", attrFill: "100%",
    escape: "20%",
    quote:  "「這世上沒人比我好看，如果有，那就搶過來！0w0」",
    guide:  "強大的自信如陽光熱烈，沒有什麼事是死纏爛打不能解決的。",
    bookName: "《沉睡荊棘》", bookAuthor: "喵芭渴死姬", bookFairy: "龍與地下城",
    bookTags: ["蘋果", "禁慾", "龍"],
    link: "https://early-marketplaces-521584.framer.app/preview/story1",
    mbti: "ENFP", cp1: "人妻王子受", cp2: ["恣情魅惑受", "殉道自我奉獻受"],
  },

  /* ── RACE｜龜兔賽跑 ── */
  RACE: {
    label:      "龜兔賽跑",
    storyName:  "愛麗絲夢遊仙境",
    concept:    "兔子不是跑輸了，只是每一次故意遲到，都是為了晚一點掉進那個不能回頭的兔子洞。",
    resultText: "你適合穿越進去《愛麗絲夢遊仙境》（龜兔賽跑 IF線）\n腦袋轉得飛快的你，總比別人更早看見另一條路；但捷徑走多了，也要小心自己是不是已經掉進太深的兔子洞。",
    sourceKeys: ["A_SCHEME_1", "R_SCHEME_1"],

    image:      "https://framerusercontent.com/images/ZgfhchUbaHJuXY9V0Xipa3jxU.png",
    soulName:   "腹黑謀略攻",
    soulDesc:   "你不甘於平庸，在人生跑道上傾盡所有，只求將唯一勁敵踩於腳下。",
    danger: "中", dangerFill: "60%",
    attr: "心機指數", attrVal: "高", attrFill: "75%",
    escape: "35%",
    quote:  "「你是唯一能與我並肩的勁敵。我不會告訴你⋯⋯你也是我最想要的勝利獎品。」",
    guide:  "用溫柔與心軟編織一座牢籠，讓他人溺死在安逸中，甚至誤以為墮落是救贖。",
    bookName: "《消失的終點線》", bookAuthor: "葦", bookFairy: "愛麗絲夢遊仙境",
    bookTags: ["強制愛", "NTR", "高潮地獄"],
    link: "https://early-marketplaces-521584.framer.app/preview/story8",
    mbti: "INTJ", cp1: "恣情魅惑受", cp2: ["清冷自持受", "隱忍美人受"],
  },

  /* ── CROW｜烏鴉 ── */
  CROW: {
    label:      "烏鴉與水瓶",
    storyName:  "醜小鴨",
    concept:    "人人都笑他是黑漆漆的烏鴉，只有他知道自己曾經也是一隻被詛咒折斷翅膀的天鵝。",
    resultText: "你適合穿越進去《醜小鴨》（烏鴉與水瓶 IF線）\n你也許常覺得自己和別人格格不入，卻總有一天會長成最特別的模樣；在那之前，請先學會喜歡現在的自己。",
    sourceKeys: ["A_CONTROL_1", "R_CONTROL_1"],

    image:      "https://tealize-write.github.io/DarkBLstory/img/crow_A.png",
    soulName:   "陰鬱偏執攻",
    soulDesc:   "坦白與曖昧的遊戲間，你更傾向默默成為他的水和氧氣。",
    danger: "中", dangerFill: "60%",
    attr: "支配指數", attrVal: "高", attrFill: "80%",
    escape: "30%",
    quote:  "「連死也無法將我們分離。」",
    guide:  "烏鴉銜石頭丟入水瓶中——你愛的是他，還是追逐他的刺激感？",
    bookName: "《寶石、烏鴉和水瓶》", bookAuthor: "君羊", bookFairy: "醜小鴨",
    bookTags: ["囚禁", "烏鴉", "殘疾"],
    link: "https://early-marketplaces-521584.framer.app/preview/story2",
    mbti: "INFJ", cp1: "陽光直男受", cp2: ["自願沉淪受", "恣情魅惑受"],
  },

  /* ── CANDY｜糖裹屋 ── */
  CANDY: {
    label:      "糖果屋",
    storyName:  "小紅帽",
    concept:    "他披著救人的紅披風走進森林，卻比狼更早一步，把人哄進自己親手搭好的糖果牢籠。",
    resultText: "你適合穿越進去《小紅帽》（糖果屋 IF線）\n從不害怕捷徑的你，勇敢果決，也很願意追著香甜的誘惑往前走；但也要小心，別一不小心就被關進一方小天地喔。",
    sourceKeys: ["A_DEVOTION_2", "R_DEVOTION_1"],

    image:      "https://tealize-write.github.io/DarkBLstory/img/candy_A.png",
    soulName:   "佔有囚禁攻",
    soulDesc:   "你說愛他，於是他替你成為永世的劫，糖果很甜，你再也沒有離開的理由。",
    danger: "極高", dangerFill: "90%",
    attr: "佔有指數", attrVal: "Max", attrFill: "100%",
    escape: "10%",
    quote:  "「哥哥，外面的雪好看嗎？但不要想著離開，因為你答應過，我們永遠要在一起。」",
    guide:  "在糖果屋裡，他用佔有表達愛，用監禁確保世界縮小成彼此，他會收藏你一輩子。",
    bookName: "《糖裹屋》", bookAuthor: "蘇朵拉", bookFairy: "小紅帽",
    bookTags: ["失禁", "骨科", "重生"],
    link: "https://early-marketplaces-521584.framer.app/preview/story3",
    mbti: "ENFJ", cp1: "自願沉淪受", cp2: ["人妻王子受", "隱忍美人受"],
  },

  /* ── CIND｜灰姑娘 ── */
  CIND: {
    label:      "灰姑娘",
    storyName:  "歌劇魅影",
    concept:    "舞會上驚艷眾生的不是灰姑娘的臉，而是那張一旦摘下就會讓所有人失控的面具。",
    resultText: "你適合穿越進去《歌劇魅影》（灰姑娘 IF線）\n你天生就有一種神祕又疏離的魅力，越是藏著，越容易讓人移不開眼；只是面具戴久了，也別忘了真正想被誰看見。",
    sourceKeys: ["A_CONTROL_2", "R_CONTROL_2"],

    image:      "https://framerusercontent.com/images/m56Q5hEDF1BiFypFDftnukMnhWM.png",
    soulName:   "黑化掠奪攻",
    soulDesc:   "你是跨越了生死，身披寒霧與烈焰的索命執念。",
    danger: "高", dangerFill: "80%",
    attr: "規訓指數", attrVal: "高", attrFill: "80%",
    escape: "5%",
    quote:  "「再試一次。這次，你會乖乖走過來。」",
    guide:  "你的愛是扭曲成焚世的火，只為拖著最愛的人一起墜入萬劫不復的深淵。",
    bookName: "《灰燼》", bookAuthor: "悠然", bookFairy: "歌劇魅影",
    bookTags: ["面具", "競爭意識", "醉酒"],
    link: "https://early-marketplaces-521584.framer.app/preview/story7",
    mbti: "INTJ", cp1: "清冷自持受", cp2: ["恣情魅惑受", "殉道自我奉獻受"],
  },

  /* ── ESC｜清醒旁觀者 / 特殊結局 ── */
  ESC: {
    label:      "清醒旁觀者",
    storyName:  "特殊結局",
    concept:    "有些人走進故事，有些人站在故事之外——你屬於後者，而這本身就是一種罕見的能力。",
    resultText: "你選擇了清醒（特殊結局）\n在故事最危險的時刻，你選擇保持清醒。這不是懦弱，而是一種罕見的自知——知道什麼時候該停下，知道什麼值得冒險，知道自己是誰。",
    sourceKeys: [],

    image:      "https://tealize-write.github.io/DarkBLstory/img/heart.png", // TODO: 待補專屬圖片
    soulName:   "清醒旁觀者",
    soulDesc:   "在故事最危險的時刻，你選擇保持清醒。這不是懦弱，這是一種罕見的自知。",
    danger: "低", dangerFill: "20%",
    attr: "清醒指數", attrVal: "Max", attrFill: "100%",
    escape: "99%",
    quote:  "「有些童話，適合付錢觀看就好。」",
    guide:  "你是最清醒的那個人，看著別人墜入深淵，你選擇站在岸邊——但你的故事，或許才剛開始。",
    bookName: "《故事另有結局》", bookAuthor: "—", bookFairy: "特殊結局", // TODO: 待補書目
    bookTags: ["旁觀", "清醒", "特殊路線"],
    link: "https://early-marketplaces-521584.framer.app/preview/story1", // TODO: 待補連結
    mbti: "INTJ", cp1: "—", cp2: [],
  },

};

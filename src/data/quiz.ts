import type { Quiz } from '../domain/types.ts';

// IDs stay stable when copy changes. Increment the version when questions or rules change.
export const quiz: Quiz = {
  id: 'gay-test',
  version: 2,
  types: [
    {
      id: 'queen', name: '闪耀主角型', icon: '👑', tagline: '今天的高光，当然有你一份。',
      description: '你喜欢把普通的一天过出一点仪式感。不是每次都要站在聚光灯下，但重要的时刻，你希望自己的心意和努力被认真看见。你的魅力，是敢于表达“这就是我喜欢的样子”。',
      relationship: '你享受明确的欣赏，也愿意把相处经营成值得纪念的小事。试着把“你怎么还没发现”换成“这件事对我很重要”，对方就更容易接住你的期待。',
      strengths: ['表达鲜明', '重视仪式感', '愿意经营关系'], pitfalls: ['期待容易藏在暗示里', '偶尔太在意场面'],
      matches: [{ typeId: 'puppy', reason: '一个敢闪耀，一个会热烈回应，夸夸现场随时开场。' }, { typeId: 'homey', reason: '你的仪式感遇见他的细心，普通日子也有小彩蛋。' }],
    },
    {
      id: 'puppy', name: '阳光直球型', icon: '☀️', tagline: '喜欢就靠近，想念就说出口。',
      description: '你习惯用及时的回应拉近距离。分享一件小事、认真接住一句抱怨，都是你的日常表达。你带来的温度不是永远开心，而是让身边的人知道：你愿意和他们一起面对今天。',
      relationship: '你喜欢有来有回的交流，开心和在意都不想让对方猜太久。热情之外，也给彼此一点不同步的余地：暂时没回复，未必代表不在乎。',
      strengths: ['回应积极', '表达真诚', '容易拉近距离'], pitfalls: ['有时回应得太着急', '容易忽略自己的节奏'],
      matches: [{ typeId: 'queen', reason: '你的直接欣赏，让他的每一次认真都被看见。' }, { typeId: 'prince', reason: '你负责发出邀请，他用慢慢打开的世界回应你。' }],
    },
    {
      id: 'prince', name: '慢热观察型', icon: '🌙', tagline: '不是没故事，只是还没聊到那一页。',
      description: '你更愿意先观察，再决定投入多少。安静不代表没有想法，熟悉之后，你的小幽默和认真反而更容易被记住。你在意舒适的距离，也珍惜那些不用一直说话的陪伴。',
      relationship: '你常用记住细节、尊重空间来表达在意。偶尔把心里的肯定说出来，会让对方更安心；边界也可以温柔而明确，不必等到累了才解释。',
      strengths: ['善于观察', '尊重边界', '投入有分寸'], pitfalls: ['心意容易被低估', '有时想得比说得多'],
      matches: [{ typeId: 'puppy', reason: '他主动靠近，你决定节奏，慢热也能有很暖的开场。' }, { typeId: 'artsy', reason: '留白和共鸣刚好相遇，安静也能聊出很多。' }],
    },
    {
      id: 'artsy', name: '浪漫共鸣型', icon: '🎨', tagline: '给日常加一点想象，再加一点晚风。',
      description: '你容易被一个细节、一首歌或一句话打动。比起把日程填满，你更在意某个瞬间有没有一起感受到什么。你的想象力常常让一件普通小事，多出一个只有彼此懂的版本。',
      relationship: '你希望感受被理解，也乐于制造属于两个人的记忆。把“希望你懂”再往前走一步，具体说说你需要什么，浪漫也会更容易落在日常里。',
      strengths: ['感受细腻', '想象丰富', '擅长制造回忆'], pitfalls: ['偶尔过度解读细节', '容易把期待留在想象里'],
      matches: [{ typeId: 'prince', reason: '他给你留白，你给留白添上故事。' }, { typeId: 'chaotic', reason: '你的浪漫碰上他的即兴，散步也可能变成小冒险。' }],
    },
    {
      id: 'sassy', name: '机智吐槽型', icon: '💬', tagline: '接梗很快，关心也没落下。',
      description: '你喜欢用语言找到连接：一个恰好的梗，一句轻巧的观察，都能让场面松下来。你也有自己的判断，不太习惯把真实想法全部藏好。熟悉你的人，会慢慢听懂玩笑里的认真。',
      relationship: '你享受能接住话题和玩笑的相处。也记得确认对方此刻需要的是段子、倾听还是一句直接的安慰；愿意收起玩笑认真表达，同样很有魅力。',
      strengths: ['反应灵活', '表达有趣', '敢说真话'], pitfalls: ['玩笑有时跑得太快', '认真容易被幽默盖住'],
      matches: [{ typeId: 'chaotic', reason: '一个接梗，一个造梗，日常聊天自带番外。' }, { typeId: 'boss', reason: '你的新角度遇上他的执行力，互相拆台也能互相补位。' }],
    },
    {
      id: 'homey', name: '安心陪伴型', icon: '🍵', tagline: '把“我在”放进每一件小事里。',
      description: '你倾向于从细节里照顾一段关系。记住一个偏好、提前留个位置，或者把眼前的事收拾妥当，都是你的表达方式。你不一定擅长盛大的场面，却很会让身边的人慢慢放松下来。',
      relationship: '你喜欢稳定、可依靠的连接，常常先想到对方缺什么。别忘了也给自己的需要留一个位置；照顾可以是双向的，你不必一直做那个最懂事的人。',
      strengths: ['细心踏实', '重视日常', '愿意付诸行动'], pitfalls: ['容易先顾别人', '自己的需要说得太少'],
      matches: [{ typeId: 'queen', reason: '你接住他的小期待，他给日常点亮仪式感。' }, { typeId: 'boss', reason: '一个照顾细节，一个推进安排，分工合拍也要记得换班。' }],
    },
    {
      id: 'boss', name: '果断领航型', icon: '🧭', tagline: '别急，我们一件一件搞定。',
      description: '面对一团想法，你通常想先找到能行动的那一步。明确方向、协调安排、承担决定，对你来说是表达在意的方式。你的可靠来自愿意站出来，而不必来自每次都做出最完美的判断。',
      relationship: '你习惯把问题变成可以一起处理的事情。行动之前问一句“你想让我帮忙，还是先听你说”，会让担当多一份体贴，也让对方有机会和你共同决定。',
      strengths: ['决策清晰', '愿意担当', '推动事情落地'], pitfalls: ['有时太快进入解决模式', '偶尔忘记先问对方'],
      matches: [{ typeId: 'homey', reason: '他照顾过程，你推进方向，合作时也记得彼此的感受。' }, { typeId: 'sassy', reason: '他提供意外视角，你把好点子变成下一步。' }],
    },
    {
      id: 'chaotic', name: '随性搞怪型', icon: '🪩', tagline: '计划可以有，彩蛋必须留。',
      description: '你喜欢给当下留一点意外的空间。临时绕个路、把小插曲变成游戏，都是你和世界打招呼的方式。你带来的乐趣，是提醒大家：安排之外，也可能有值得记住的好时刻。',
      relationship: '你喜欢一起发现新鲜事，也会用轻松的方式表达认真。惊喜之外，提前说清楚重要的约定，会让对方更放心地陪你即兴；可靠和好玩完全可以同时存在。',
      strengths: ['即兴灵活', '玩心充足', '擅长调节气氛'], pitfalls: ['有时忽略约定细节', '容易用轻松带过认真'],
      matches: [{ typeId: 'sassy', reason: '你制造意外，他接住笑点，一起把日常聊成连续剧。' }, { typeId: 'artsy', reason: '他发现氛围，你发现新路线，小事也能成为共同回忆。' }],
    },
  ],
  questions: [
    { id: 'gathering', text: '周五的小聚，你最自然地进入哪种状态？', options: [
      { id: 'entrance', text: '认真搭配一下，带着好状态闪亮登场', primary: 'queen', secondary: 'chaotic' },
      { id: 'greeting', text: '先和大家打招呼，把刚认识的人也拉进话题', primary: 'puppy', secondary: 'homey' },
      { id: 'observe', text: '找个舒服的位置，先观察再加入感兴趣的聊天', primary: 'prince', secondary: 'boss' },
      { id: 'conversation', text: '遇到聊得来的人，交换最近喜欢的歌和电影', primary: 'artsy', secondary: 'sassy' },
    ] },
    { id: 'comfort', text: '喜欢的人发来一句“今天有点累”，你更想怎么回应？', options: [
      { id: 'practical', text: '问问吃饭没有，看看能帮他省下哪件小事', primary: 'homey', secondary: 'boss' },
      { id: 'listen', text: '问他愿不愿意聊聊，再分享一首适合此刻的歌', primary: 'artsy', secondary: 'prince' },
      { id: 'joke', text: '发个只有你们懂的梗，陪他轻松地吐槽两句', primary: 'sassy', secondary: 'chaotic' },
      { id: 'direct', text: '直接说“想陪陪你”，问他要不要打个电话', primary: 'puppy', secondary: 'queen' },
    ] },
    { id: 'weekend', text: '终于有一天可以一起过周末，你偏向哪种安排？', options: [
      { id: 'wander', text: '先出门再说，沿路遇到有趣的小店就进去', primary: 'chaotic', secondary: 'artsy' },
      { id: 'plan', text: '提前选好路线和时间，让当天不用忙着做决定', primary: 'boss', secondary: 'queen' },
      { id: 'stay', text: '备点喜欢的吃喝，一起在家慢悠悠地待着', primary: 'homey', secondary: 'puppy' },
      { id: 'walk', text: '找个不吵的地方散步，边走边互相抛梗', primary: 'sassy', secondary: 'prince' },
    ] },
    { id: 'friend', text: '朋友结束了一段感情，来找你待一会儿。你会？', options: [
      { id: 'space', text: '不急着问细节，先陪着，等他想说的时候再聊', primary: 'prince', secondary: 'artsy' },
      { id: 'distraction', text: '约他做件轻松的小事，让今晚先有个开心片段', primary: 'chaotic', secondary: 'puppy' },
      { id: 'hype', text: '开个限定吐槽专场，再认真夸夸他值得被喜欢的地方', primary: 'queen', secondary: 'sassy' },
      { id: 'help', text: '问问眼下最需要什么，陪他把接下来几天安排妥当', primary: 'boss', secondary: 'homey' },
    ] },
    { id: 'surprise', text: '约会当天，原定去的店临时关门了。你第一反应是？', options: [
      { id: 'sunset', text: '看看附近有没有好风景，把空出来的时间留给散步', primary: 'artsy', secondary: 'puppy' },
      { id: 'occasion', text: '换个好看的地方，临时约会也要有点小仪式', primary: 'queen', secondary: 'chaotic' },
      { id: 'alternative', text: '快速查好替代方案，和对方商量后重新出发', primary: 'boss', secondary: 'sassy' },
      { id: 'cafe', text: '先找家舒服的小店坐下，休息一下再慢慢决定', primary: 'homey', secondary: 'prince' },
    ] },
    { id: 'affection', text: '你想让对方知道“我对你有点特别”，会怎么做？', options: [
      { id: 'tell', text: '大方说“和你在一起很开心”，再主动约下一次', primary: 'puppy', secondary: 'queen' },
      { id: 'tease', text: '半开玩笑地发出专属邀请，顺手定个见面时间', primary: 'sassy', secondary: 'boss' },
      { id: 'meme', text: '做个有梗的小彩蛋，等他发现藏在里面的心意', primary: 'chaotic', secondary: 'artsy' },
      { id: 'remember', text: '记住他提过的小喜好，下次见面时悄悄兑现', primary: 'prince', secondary: 'homey' },
    ] },
    { id: 'disagreement', text: '对同一件事想法不同，你更习惯怎样开始沟通？', options: [
      { id: 'lighten', text: '用一句轻松的话打开话题，再把真实想法说出来', primary: 'sassy', secondary: 'chaotic' },
      { id: 'pause', text: '先给自己一点整理时间，再解释为什么会这样想', primary: 'prince', secondary: 'artsy' },
      { id: 'reassure', text: '先确认彼此都在认真听，再讲各自介意的地方', primary: 'puppy', secondary: 'homey' },
      { id: 'clarify', text: '把分歧和各自的需要摆出来，一起找个可行办法', primary: 'boss', secondary: 'queen' },
    ] },
    { id: 'space', text: '在亲近的关系里，哪种相处节奏最让你舒服？', options: [
      { id: 'occasion', text: '各自都很充实，重要时刻认真为彼此留出位置', primary: 'queen', secondary: 'boss' },
      { id: 'routine', text: '有一些固定的小约定，平常也能自然分享日常', primary: 'homey', secondary: 'puppy' },
      { id: 'parallel', text: '各自保留兴趣，遇到触动的事情再好好交流', primary: 'artsy', secondary: 'prince' },
      { id: 'flexible', text: '安排不用太满，临时起意也能一起接住新点子', primary: 'chaotic', secondary: 'sassy' },
    ] },
    { id: 'teamwork', text: '一起筹备一个小活动，你最想认领哪部分？', options: [
      { id: 'details', text: '确认用品和大家的小需要，让现场待着舒服', primary: 'homey', secondary: 'prince' },
      { id: 'improvise', text: '设计好玩的环节，也愿意临场处理意外的小插曲', primary: 'chaotic', secondary: 'boss' },
      { id: 'present', text: '琢磨主题和开场，让大家一进来就感受到气氛', primary: 'queen', secondary: 'sassy' },
      { id: 'connect', text: '收集大家的点子，再把愿意参与的人联系起来', primary: 'puppy', secondary: 'artsy' },
    ] },
    { id: 'gift', text: '想送出一个“不用很贵，但很有你味道”的小惊喜，你会选？', options: [
      { id: 'wish', text: '把他提过的小愿望安排好，邀他一起去体验', primary: 'boss', secondary: 'puppy' },
      { id: 'story', text: '做一张小卡片，把你们共同的回忆放进设计里', primary: 'artsy', secondary: 'queen' },
      { id: 'useful', text: '挑一件他刚好用得上、又符合平时偏好的小物', primary: 'prince', secondary: 'homey' },
      { id: 'inside', text: '把你们之间的梗做成实物，打开就能会心一笑', primary: 'sassy', secondary: 'chaotic' },
    ] },
  ],
};

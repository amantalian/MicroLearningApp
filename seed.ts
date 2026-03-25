import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./src/db/schema";
import { books as booksTable, cards as cardsTable, collections as collectionsTable, cardCollections as cardCollectionsTable } from "./src/db/schema";

// Re-create data inline (same as src/data/index.ts)
const GRADIENTS = [
  "from-violet-600 to-indigo-600","from-rose-500 to-pink-600","from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600","from-blue-500 to-cyan-600","from-fuchsia-500 to-purple-600",
  "from-red-500 to-rose-600","from-sky-500 to-blue-600","from-lime-500 to-green-600","from-yellow-500 to-amber-600",
];

const booksRaw = [
  { title:"Atomic Habits",author:"James Clear",category:"Self-Improvement",cards:[
    {emoji:"🔄",title:"The 1% Rule",content:"Getting 1% better every day counts for a lot in the long-run. If you get 1% better each day for one year, you'll end up 37 times better by the time you're done. Habits are the compound interest of self-improvement."},
    {emoji:"🎯",title:"Systems Over Goals",content:"You do not rise to the level of your goals. You fall to the level of your systems. Goals are about the results you want to achieve. Systems are about the processes that lead to those results."},
    {emoji:"🪞",title:"Identity-Based Habits",content:"The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become. Every action you take is a vote for the type of person you wish to become."},
    {emoji:"👀",title:"Make It Obvious",content:"The 1st Law of Behavior Change: Make it obvious. You don't need to be aware of the cue for a habit to begin. The most common cues are time and location. Use implementation intentions: 'I will [BEHAVIOR] at [TIME] in [LOCATION].'"},
    {emoji:"✨",title:"Make It Attractive",content:"The 2nd Law of Behavior Change: Make it attractive. The more attractive an opportunity is, the more likely it is to become habit-forming. Temptation bundling works by linking an action you want to do with an action you need to do."},
    {emoji:"🏃",title:"Make It Easy",content:"The 3rd Law of Behavior Change: Make it easy. The most effective form of learning is practice, not planning. Focus on taking action, not being in motion. Reduce friction for good habits."},
    {emoji:"🎁",title:"Make It Satisfying",content:"The 4th Law of Behavior Change: Make it satisfying. We are more likely to repeat a behavior when the experience is satisfying. The human brain evolved to prioritize immediate rewards over delayed rewards."},
    {emoji:"📍",title:"Environment Design",content:"Environment is the invisible hand that shapes human behavior. Small changes in context can lead to large changes in behavior over time. Make the cues of good habits obvious in your environment."},
    {emoji:"⏰",title:"The Two-Minute Rule",content:"When you start a new habit, it should take less than two minutes to do. The idea is to make your habits as easy as possible to start. Anyone can meditate for one minute, read one page, or put on their running shoes."},
    {emoji:"📊",title:"Habit Tracking",content:"One of the most satisfying feelings is the feeling of making progress. A habit tracker is a simple way to measure whether you did a habit. Don't break the chain. Try to keep your habit streak alive."},
  ]},
  { title:"Deep Work",author:"Cal Newport",category:"Productivity",cards:[
    {emoji:"🧠",title:"Deep Work Definition",content:"Deep work is professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate."},
    {emoji:"📱",title:"Shallow Work Trap",content:"Shallow work is non-cognitively demanding, logistical-style tasks, often performed while distracted. These efforts tend not to create much new value in the world and are easy to replicate. Most knowledge workers spend most of their time here."},
    {emoji:"💎",title:"Deep Work Is Rare & Valuable",content:"The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill will thrive."},
    {emoji:"🏰",title:"The Monastic Philosophy",content:"This philosophy attempts to maximize deep efforts by eliminating or radically minimizing shallow obligations. Practitioners tend to have a well-defined and highly valued professional goal that they pursue with maximum dedication."},
    {emoji:"📅",title:"The Rhythmic Philosophy",content:"This philosophy argues that the easiest way to consistently start deep work sessions is to transform them into a simple regular habit. Set a fixed time every day for deep work and stick to it. The chain method works well here."},
    {emoji:"🎭",title:"Attention Residue",content:"When you switch from Task A to Task B, your attention doesn't immediately follow. A residue of your attention remains stuck thinking about the original task. This residue gets especially thick if your work on Task A was unbounded."},
    {emoji:"🔌",title:"Embrace Boredom",content:"Don't take breaks from distraction. Instead take breaks from focus. If you constantly seek novel stimuli, your brain will struggle to maintain concentration. Schedule your internet use and resist the urge outside those times."},
    {emoji:"📧",title:"Drain The Shallows",content:"Schedule every minute of your day. Quantify the depth of every activity. Ask your boss for a shallow work budget. Finish your work by 5:30. Become hard to reach. Put more thought into your emails."},
    {emoji:"🏋️",title:"Train Like an Athlete",content:"The key to developing a deep work habit is to move beyond good intentions and add routines and rituals designed to minimize the amount of your limited willpower necessary to transition into and maintain a state of unbroken concentration."},
    {emoji:"🌅",title:"The Shutdown Ritual",content:"At the end of the workday, shut down your consideration of work issues until the next morning. Have a specific ritual you use to mark the end. This helps your unconscious mind process and recharge for the next day."},
  ]},
  { title:"Thinking, Fast and Slow",author:"Daniel Kahneman",category:"Psychology",cards:[
    {emoji:"⚡",title:"System 1: Fast Thinking",content:"System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control. It's the intuitive, emotional brain that makes snap judgments and handles routine decisions effortlessly."},
    {emoji:"🐢",title:"System 2: Slow Thinking",content:"System 2 allocates attention to the effortful mental activities that demand it, including complex computations. It's the deliberate, logical brain. The operations of System 2 are often associated with the subjective experience of agency and choice."},
    {emoji:"⚓",title:"The Anchoring Effect",content:"People's estimates are heavily influenced by initial values (anchors), even when those values are arbitrary. If you're asked whether Gandhi was more or less than 114 years old when he died, your estimate of his age will be higher than if the anchor was 35."},
    {emoji:"🎰",title:"Loss Aversion",content:"Losses loom larger than gains. The pain of losing $100 is more intense than the pleasure of gaining $100. This asymmetry between the power of positive and negative expectations was probably shaped by evolution."},
    {emoji:"🎪",title:"The Availability Heuristic",content:"We estimate the frequency of events by the ease with which examples come to mind. Dramatic events (plane crashes, shark attacks) seem more common than they are because they're memorable. This distorts our perception of risk."},
    {emoji:"🖼️",title:"Framing Effects",content:"The way a problem is presented (framed) can dramatically change decisions. 'A 90% survival rate' sounds better than 'a 10% mortality rate' — even though they're identical. Frames shape our perception of reality."},
    {emoji:"😊",title:"Peak-End Rule",content:"We judge experiences largely based on how they felt at their peak (most intense point) and at their end, rather than by the average of every moment. Duration matters very little. This applies to pain, vacations, and life in general."},
    {emoji:"🎯",title:"WYSIATI",content:"What You See Is All There Is. System 1 excels at constructing the best possible story from available information, but it does not account for information it doesn't have. We jump to conclusions based on limited evidence with high confidence."},
    {emoji:"📈",title:"Regression to the Mean",content:"Extreme outcomes tend to be followed by more moderate ones. A brilliant performance is likely followed by a lesser one — not because of a 'curse' but because of statistics. We often invent causal explanations for what is simply regression."},
    {emoji:"🤔",title:"The Planning Fallacy",content:"We systematically underestimate the time, costs, and risks of future actions, and overestimate their benefits. This happens because we focus on the specific case rather than looking at base rates from similar past projects."},
  ]},
  { title:"The Psychology of Money",author:"Morgan Housel",category:"Finance",cards:[
    {emoji:"🎲",title:"Luck & Risk",content:"Nothing is as good or as bad as it seems. Every outcome in life is guided by forces other than individual effort. Luck and risk are both real and hard to identify. They are so similar that you can't believe in one without equally respecting the other."},
    {emoji:"🏃",title:"Never Enough",content:"The hardest financial skill is getting the goalpost to stop moving. Modern capitalism makes us want more. There is no reason to risk what you have and need for what you don't have and don't need. Know when you have enough."},
    {emoji:"❄️",title:"Compounding Magic",content:"Warren Buffett's fortune isn't due to just being a good investor, but being a good investor since he was literally a child. His skill is investing, but his secret is time. The biggest returns come from compounding over decades."},
    {emoji:"💰",title:"Wealth Is What You Don't See",content:"Spending money to show people how much money you have is the fastest way to have less money. Wealth is the nice cars not purchased, the diamonds not bought. Wealth is financial assets that haven't yet been converted to stuff you see."},
    {emoji:"🛡️",title:"Save for No Reason",content:"You don't need a specific reason to save. Saving is a hedge against life's inevitable ability to surprise the hell out of you at the worst possible moment. The flexibility saving gives you is the most valuable financial asset."},
    {emoji:"🎯",title:"Reasonable > Rational",content:"Aim to be reasonable rather than rational. A rational decision might look perfect on a spreadsheet, but if you can't sleep at night, it's not the right decision for you. Finance is guided by people's unique histories and worldviews."},
    {emoji:"📊",title:"Tails Drive Everything",content:"A small number of events account for the majority of outcomes. In investing, a few big winners compensate for many losers. You can be wrong half the time and still make a fortune. What matters are the outlier events."},
    {emoji:"🔮",title:"Room for Error",content:"The most important part of every plan is planning on your plan not going according to plan. A margin of safety is the only effective way to safely navigate a world that is governed by odds, not certainties."},
    {emoji:"🧩",title:"No One's Crazy",content:"Your personal experiences with money make up maybe 0.00000001% of what's happened in the world, but maybe 80% of how you think the world works. Everyone has a unique view of money shaped by their own history. Respect that."},
    {emoji:"🏠",title:"Freedom Is the Goal",content:"The highest form of wealth is the ability to wake up every morning and say, 'I can do whatever I want today.' Having control over your time is the highest dividend money pays. Use money to gain control over your time."},
  ]},
  { title:"Sapiens",author:"Yuval Noah Harari",category:"History",cards:[
    {emoji:"🌍",title:"The Cognitive Revolution",content:"About 70,000 years ago, Homo sapiens developed new ways of thinking and communicating. What was so special about our language? It could transmit information about things that don't exist at all — myths, legends, gods, religions."},
    {emoji:"🤝",title:"The Power of Fiction",content:"Large numbers of strangers can cooperate successfully by believing in common myths. Any large-scale human cooperation is rooted in common myths — nations, money, human rights, laws, justice — none of these things exist outside our collective imagination."},
    {emoji:"🌾",title:"The Agricultural Trap",content:"The Agricultural Revolution was history's biggest fraud. Wheat domesticated us, not the other way around. Humans went from a varied, nutritious diet to backbreaking labor for a worse diet. But there was no going back."},
    {emoji:"📜",title:"Imagined Orders",content:"The imagined order shapes our desires. Most people don't want to accept that the order governing their lives is imaginary. But in fact, every person is born into a pre-existing imagined order. Our desires are shaped by these fictional stories."},
    {emoji:"💵",title:"Money: Universal Trust",content:"Money is the most universal and most efficient system of mutual trust ever devised. It's the only trust system created by humans that can bridge almost any cultural gap. Money is not coins and banknotes — it's trust."},
    {emoji:"⚔️",title:"Imperial Cycles",content:"History shows a trend toward unity. Empires have been the world's most common form of political organization. Most cultures today are rooted in imperial legacies. The direction of history is toward global unification."},
    {emoji:"🧬",title:"Science & Empire",content:"The Scientific Revolution began in Europe largely because Europeans were willing to admit ignorance. The marriage of science and empire was the key to European dominance. The willingness to say 'I don't know' was revolutionary."},
    {emoji:"😊",title:"The Happiness Question",content:"Did the Agricultural Revolution and subsequent developments make humans happier? Evidence suggests not necessarily. A peasant in medieval Egypt may have been no less happy than a modern office worker. Happiness is largely biological."},
    {emoji:"🦁",title:"Animal Suffering",content:"The agricultural and industrial revolutions turned animals from independent agents into mere cogs. The fate of farm animals is one of the most pressing ethical questions of our time. Their suffering is real and immense."},
    {emoji:"🚀",title:"Homo Deus",content:"For the first time in history, more people die from eating too much than from eating too little, and more die from old age than from infectious diseases. We are acquiring godlike abilities: the power to design life itself."},
  ]},
];

async function seed() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  const db = drizzle(client, { schema });

  // Clear existing
  await db.delete(cardCollectionsTable);
  await db.delete(cardsTable);
  await db.delete(collectionsTable);
  await db.delete(booksTable);

  const booksData: any[] = [];
  const cardsData: any[] = [];
  let gradientIndex = 0;

  for (let bi = 0; bi < booksRaw.length; bi++) {
    const b = booksRaw[bi];
    const bookId = `book-${bi + 1}`;
    booksData.push({ id: bookId, title: b.title, author: b.author, category: b.category });
    for (let ci = 0; ci < b.cards.length; ci++) {
      const c = b.cards[ci];
      cardsData.push({
        id: `card-${bookId}-${ci + 1}`,
        bookId,
        emoji: c.emoji,
        title: c.title,
        content: c.content,
        order: ci,
        gradient: GRADIENTS[gradientIndex % GRADIENTS.length],
      });
      gradientIndex++;
    }
  }

  await db.insert(booksTable).values(booksData);
  await db.insert(cardsTable).values(cardsData);

  const collectionsRaw = [
    { name:"Mindset & Growth",emoji:"🌱",description:"Ideas about personal growth and mindset shifts",bookTitles:["Atomic Habits","Deep Work"]},
    { name:"Money & Wealth",emoji:"💰",description:"Financial wisdom and wealth-building insights",bookTitles:["The Psychology of Money"]},
    { name:"Human Nature",emoji:"🧠",description:"Understanding how humans think and behave",bookTitles:["Thinking, Fast and Slow","Sapiens"]},
    { name:"Productivity",emoji:"⚡",description:"Work smarter, achieve more",bookTitles:["Deep Work","Atomic Habits"]},
    { name:"Big History",emoji:"🌍",description:"The grand narrative of human civilization",bookTitles:["Sapiens"]},
  ];

  const colsData: any[] = [];
  const ccData: any[] = [];

  for (let i = 0; i < collectionsRaw.length; i++) {
    const col = collectionsRaw[i];
    const colId = `col-${i + 1}`;
    colsData.push({ id: colId, name: col.name, emoji: col.emoji, description: col.description });
    for (const bookTitle of col.bookTitles) {
      const book = booksData.find((b: any) => b.title === bookTitle);
      if (!book) continue;
      const bookCards = cardsData.filter((c: any) => c.bookId === book.id).slice(0, 3);
      for (const card of bookCards) {
        ccData.push({ cardId: card.id, collectionId: colId });
      }
    }
  }

  await db.insert(collectionsTable).values(colsData);
  await db.insert(cardCollectionsTable).values(ccData);

  console.log("Seeded successfully!");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });

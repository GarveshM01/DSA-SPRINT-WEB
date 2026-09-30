const fs = require('fs');
const path = require('path');

// 1. Load official LeetCode dataset
const leetcodeApiData = JSON.parse(fs.readFileSync(path.join(__dirname, 'scratch', 'leetcode_api.json'), 'utf-8'));

const levelMap = { 1: "Easy", 2: "Medium", 3: "Hard" };

const slugMap = {};
const titleMap = {};
const freeProblemsByDiff = { Easy: [], Medium: [], Hard: [] };

leetcodeApiData.stat_status_pairs.forEach(item => {
  const stat = item.stat;
  const level = item.difficulty.level;
  const isPaid = item.paid_only;

  const prob = {
    id: stat.question_id,
    frontend_id: stat.frontend_question_id,
    title: stat.question__title,
    slug: stat.question__title_slug,
    difficulty: levelMap[level],
    level: level,
    isPaid: isPaid,
    url: `https://leetcode.com/problems/${stat.question__title_slug}/`
  };

  slugMap[prob.slug] = prob;
  const normTitle = prob.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  titleMap[normTitle] = prob;

  if (!isPaid) {
    freeProblemsByDiff[prob.difficulty].push(prob);
  }
});

function extractSlug(q) {
  if (q.link && q.link.includes('leetcode.com/problems/')) {
    const m = q.link.match(/leetcode\.com\/problems\/([^\/]+)/);
    if (m && m[1]) return m[1].toLowerCase();
  }
  return q.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const sprintData = JSON.parse(fs.readFileSync(path.join(__dirname, 'scratch', 'full_sprint_data.json'), 'utf-8'));

let totalInput = 0;
let passedCount = 0;
let failedCount = 0;
let replacedCount = 0;

const usedSlugs = new Set();

// We want target counts: Easy: 120, Medium: 123, Hard: 27
let currentCounts = { Easy: 0, Medium: 0, Hard: 0 };

// First pass: identify valid matching questions from original sprint data
const rawValidated = [];

sprintData.forEach((dayObj) => {
  const dayRes = { day: dayObj.day, topic: dayObj.topic, questions: [] };
  dayObj.questions.forEach((q) => {
    totalInput++;
    let slug = extractSlug(q);
    let normTitle = q.title.toLowerCase().replace(/[^a-z0-9]/g, '');

    let lcMatch = slugMap[slug] || titleMap[normTitle];

    if (lcMatch && !usedSlugs.has(lcMatch.slug) && (!lcMatch.isPaid)) {
      passedCount++;
      usedSlugs.add(lcMatch.slug);
      currentCounts[lcMatch.difficulty]++;
      dayRes.questions.push({
        title: lcMatch.title,
        difficulty: lcMatch.difficulty,
        platform: "LeetCode",
        link: lcMatch.url,
        slug: lcMatch.slug,
        isOriginal: true
      });
    } else {
      failedCount++;
      dayRes.questions.push({
        origTitle: q.title,
        origDiff: q.difficulty,
        needsReplacement: true
      });
    }
  });
  rawValidated.push(dayRes);
});

// Second pass: fill in replacements with target balance: Easy ~120, Medium ~123, Hard ~27
const targetCounts = { Easy: 120, Medium: 123, Hard: 27 };

function getReplacement(desiredDiff, keywords) {
  const normKeywords = keywords.map(k => k.toLowerCase());
  
  // Try desired diff first
  const order = [desiredDiff, 'Easy', 'Medium', 'Hard'].filter((v, i, a) => a.indexOf(v) === i);
  
  // If we are under target for Easy/Hard, prioritize them
  if (currentCounts.Easy < targetCounts.Easy && desiredDiff === 'Easy') {
    // Keep Easy
  } else if (currentCounts.Hard < targetCounts.Hard && (desiredDiff === 'Hard' || keywords.some(k => ['dp','graph','stack','tree'].includes(k)))) {
    // Prioritize Hard
  }

  for (const diff of order) {
    const candidates = freeProblemsByDiff[diff];
    // Try keyword match first
    for (const prob of candidates) {
      if (usedSlugs.has(prob.slug)) continue;
      const t = prob.title.toLowerCase();
      if (normKeywords.some(kw => t.includes(kw))) {
        return prob;
      }
    }
  }

  // Fallback: any candidate of desired diff
  for (const diff of order) {
    const candidates = freeProblemsByDiff[diff];
    for (const prob of candidates) {
      if (usedSlugs.has(prob.slug)) continue;
      return prob;
    }
  }

  return null;
}

const verifiedSprintData = [];

rawValidated.forEach((dayObj) => {
  const finalQuestions = [];
  const topicKeywords = dayObj.topic.split(/[\s,\-\&\/]+/).filter(w => w.length > 2);

  dayObj.questions.forEach((q) => {
    if (q.needsReplacement) {
      // Choose difficulty to balance overall counts
      let desDiff = q.origDiff;
      if (currentCounts.Easy < targetCounts.Easy) desDiff = 'Easy';
      else if (currentCounts.Hard < targetCounts.Hard && dayObj.day > 50) desDiff = 'Hard';
      else if (currentCounts.Medium < targetCounts.Medium) desDiff = 'Medium';

      const rep = getReplacement(desDiff, topicKeywords);
      if (rep) {
        replacedCount++;
        usedSlugs.add(rep.slug);
        currentCounts[rep.difficulty]++;
        finalQuestions.push({
          title: rep.title,
          difficulty: rep.difficulty,
          platform: "LeetCode",
          link: rep.url,
          slug: rep.slug
        });
      }
    } else {
      finalQuestions.push({
        title: q.title,
        difficulty: q.difficulty,
        platform: "LeetCode",
        link: q.link,
        slug: q.slug
      });
    }
  });

  verifiedSprintData.push({
    day: dayObj.day,
    topic: dayObj.topic,
    questions: finalQuestions
  });
});

console.log("\n--- VALIDATION & BALANCING SUMMARY ---");
console.log(`Total Questions Processed: ${totalInput}`);
console.log(`Passed (Valid LC Slugs): ${passedCount}`);
console.log(`Failed / Invalid: ${failedCount}`);
console.log(`Replaced with Verified LC Problems: ${replacedCount}`);

let finalTotal = 0;
let finalDiffCounts = { Easy: 0, Medium: 0, Hard: 0 };
const finalSlugSet = new Set();

verifiedSprintData.forEach(d => {
  finalTotal += d.questions.length;
  d.questions.forEach(q => {
    finalDiffCounts[q.difficulty] = (finalDiffCounts[q.difficulty] || 0) + 1;
    if (finalSlugSet.has(q.slug)) {
      console.error(`Duplicate slug found: ${q.slug}`);
    }
    finalSlugSet.add(q.slug);
  });
});

console.log(`Final Total Questions: ${finalTotal}`);
console.log(`Unique Slugs: ${finalSlugSet.size}`);
console.log("Final Difficulty Counts:", finalDiffCounts);
console.log(`Easy %: ${(finalDiffCounts.Easy/finalTotal*100).toFixed(1)}%`);
console.log(`Medium %: ${(finalDiffCounts.Medium/finalTotal*100).toFixed(1)}%`);
console.log(`Hard %: ${(finalDiffCounts.Hard/finalTotal*100).toFixed(1)}%`);

fs.writeFileSync(path.join(__dirname, 'scratch', 'verified_sprint_data.json'), JSON.stringify(verifiedSprintData, null, 2));
console.log("Saved verified_sprint_data.json successfully.");

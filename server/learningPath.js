const { JSDOM } = require('jsdom');

function splitIntoModules(html) {
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const modules = [];
  let current = null;

  Array.from(document.body.children).forEach(node => {
    if (/^H[1-6]$/.test(node.tagName)) {
      if (current) modules.push(current);
      current = { title: node.textContent, content: '' };
    } else if (current) {
      current.content += node.outerHTML;
    }
  });
  if (current) modules.push(current);
  return modules;
}

function generateQuiz(module) {
  const dom = new JSDOM(module.content);
  const text = dom.window.document.body.textContent.trim();
  const firstSentence = text.split('.').shift();
  return [{
    question: `What is a key point of "${module.title}"?`,
    answer: firstSentence || ''
  }];
}

function scheduleReviews(modules) {
  const intervals = [1, 3, 7];
  const now = Date.now();
  return modules.map(m => ({
    module: m.title,
    reviews: intervals.map(d => new Date(now + d * 86400000).toISOString())
  }));
}

function createLearningJourney(html, profile = {}) {
  const modules = splitIntoModules(html).map(m => ({
    ...m,
    quiz: generateQuiz(m, profile)
  }));
  const reviews = scheduleReviews(modules, profile);
  return { modules, reviews };
}

module.exports = { createLearningJourney };

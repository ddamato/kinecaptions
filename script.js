// https://developers.google.com/youtube/iframe_api_reference#Events

function getCaptions(videoId) {
  const url = `https://video.google.com/timedtext?lang=en&v=${videoId}`;
  return fetch(url).then((res) => res.text()).then((xml) => {
    const dom = new DOMParser().parseFromString(xml, 'application/xml');
    const textNodes = dom.querySelectorAll('text');
    return parseTextNodes(textNodes);
  });
}

function parseTextNodes(textNodes) {
  return [...textNodes].map((node) => {
    return {
      start: Number(node.getAttribute('start')),
      duration: Number(node.getAttribute('dur')),
      text: formatText(node),
    }
  }).filter(({ text }) => text);
}

function formatText(node) {
  const dom = new DOMParser().parseFromString(`<node>${node.textContent}</node>`, 'application/xml');
  const text = dom.documentElement.textContent;
  return text.replace(/[^ -~]/g, ' ').trim().split(/(?![^\[]*\])\s+/);
}

getCaptions('1Jwo5qc78QU').then((captions) => {
  console.log(captions);
});


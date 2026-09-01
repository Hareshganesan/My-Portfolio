const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Known corrupted strings replacement
html = html.replace(/LinkedIn[^<]*/g, 'LinkedIn &#8599;');
html = html.replace(/GitHub[^<]*/g, 'GitHub &#8599;');
html = html.replace(/Instagram[^<]*/g, 'Instagram &#8599;');
html = html.replace(/Contact <span aria-hidden="true">[^<]*<\/span>/g, 'Contact <span aria-hidden="true">&#8599;</span>');
html = html.replace(/Feb 2026[^a-zA-Z0-9]+May 2026/g, 'Feb 2026 &mdash; May 2026');
html = html.replace(/<div class="work-arrow">[^<]*<\/div>/g, '<div class="work-arrow">&#8599;</div>');
html = html.replace(/Drag to spin[^a-zA-Z0-9]+every disc is a win\./g, 'Drag to spin &mdash; every disc is a win.');
html = html.replace(/swipe to explore[^<]*/g, 'swipe to explore &rarr;');
html = html.replace(/LET'S TALK\s*[^<]*/g, "LET'S TALK &#8599;");
html = html.replace(/<p>[^a-zA-Z0-9]+2025 GANESAN P V<\/p>/g, '<p>&copy; 2025 GANESAN P V</p>');
html = html.replace(/GPV[^a-zA-Z0-9]*2026[^a-zA-Z0-9]*ENG/g, 'GPV-2026-ENG');
html = html.replace(/Full Stack[^a-zA-Z0-9]*Applied AI/g, 'Full Stack &bull; Applied AI');
html = html.replace(/BUILD[^a-zA-Z0-9]*BREAK[^a-zA-Z0-9]*LEARN[^a-zA-Z0-9]*REPEAT[^a-zA-Z0-9]*</g, 'BUILD &bull; BREAK &bull; LEARN &bull; REPEAT &bull; <');

fs.writeFileSync('index.html', html, 'utf8');

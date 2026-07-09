import { useEffect, useRef } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Content from '@theme-original/DocItem/Content';

// Notes are markdown: `# Title` -> `## Notes` (Claim/Explanation/... as H3s)
// -> `## Visual`. CSS alone can't group a dynamic run of siblings between one
// H2 and the next into a bordered card, so we do a small DOM walk after mount.
export default function DocItemContentWrapper(props) {
  const { frontMatter } = useDoc();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const container = wrapperRef.current?.querySelector('.markdown');
    if (!container) return;

    const headings = Array.from(container.querySelectorAll(':scope > h2'));
    headings.forEach((h2) => {
      const card = document.createElement('div');
      card.className = 'note-section-card';
      container.insertBefore(card, h2);
      let node = h2;
      while (node) {
        const next = node.nextSibling;
        if (node !== h2 && node.nodeType === 1 && node.tagName === 'H2') break;
        card.appendChild(node);
        node = next;
      }
    });

    if (frontMatter.Description && !container.querySelector('.pull-quote')) {
      const h1 = container.querySelector('h1');
      if (h1) {
        const quote = document.createElement('div');
        quote.className = 'pull-quote';
        quote.textContent = frontMatter.Description;
        h1.insertAdjacentElement('afterend', quote);
      }
    }
  }, [frontMatter]);

  return (
    <div ref={wrapperRef}>
      <Content {...props} />
    </div>
  );
}

import { findAfter } from 'unist-util-find-after';
import { visitParents } from 'unist-util-visit-parents';

const MAX_HEADING_DEPTH = 4;

function sectionize(node: any, ancestors: any) {
  const start = node;
  const depth = start.depth;
  const parent = ancestors[ancestors.length - 1];
  const id = node.data.id;

  const isEnd = (node: any) =>
    (node.type === 'heading' && node.depth <= depth) || node.type === 'export';
  const end = findAfter(parent, start, isEnd);

  const startIndex = parent.children.indexOf(start);
  const endIndex = parent.children.indexOf(end);

  const between = parent.children.slice(
    startIndex,
    endIndex > 0 ? endIndex : undefined,
  );

  const section = {
    type: 'section',
    depth: depth,
    children: between,
    data: {
      hName: 'section',
      hProperties: {
        id: `${id}`,
        title: node.children[0].value,
      },
    },
  };

  parent.children.splice(startIndex, section.children.length, section);
}

function transform(tree: any) {
  for (let depth = MAX_HEADING_DEPTH; depth > 0; depth--) {
    visitParents(
      tree,
      (node: any) => node.type === 'heading' && node.depth === depth,
      sectionize,
    );
  }
}

export const remarkSectionize: any = () => {
  return transform;
};

export interface Project {
  name: string;
  /** Two-or-three-word label used by the home-page tiles. */
  kind: string;
  description: string;
  url?: string;
  appUrl?: string;
  githubUrl?: string;
  npmUrl?: string;
  tags: string[];
  blogSlug?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    name: 'opencode-bedrock-openai-token',
    kind: 'OpenCode plugin',
    description:
      'An OpenCode plugin that authenticates requests to AWS Bedrock\'s OpenAI-compatible endpoint using short-lived tokens from the Bedrock Token Generator. Supports SSO, IAM roles, and AWS credential profiles with automatic token refresh.',
    githubUrl: 'https://github.com/garethrhughes/opencode-bedrock-openai-token',
    npmUrl: 'https://www.npmjs.com/package/opencode-bedrock-openai-token',
    tags: ['AWS Bedrock', 'OpenCode', 'Plugin', 'TypeScript'],
    blogSlug: 'opencode-and-gpt-5-5-on-bedrock',
  },
  {
    name: 'OpenCode Skills',
    kind: 'Developer tooling',
    description:
      'A collection of reusable OpenCode skills for structured AI-assisted software development. Includes skills for architecture design, TDD-based development, security reviews, decision logging, and full feature dev-workflow orchestration.',
    githubUrl: 'https://github.com/garethrhughes/skills',
    tags: ['OpenCode', 'AI', 'Developer Tooling', 'Skills'],
    blogSlug: 'opencode-skills',
  },
  {
    name: 'Squirrel Notes',
    kind: 'Zero-knowledge notes',
    description:
      'A zero-knowledge, end-to-end encrypted notes app built for people who struggle to focus. Your passphrase never leaves your browser — the server stores only ciphertext. Features markdown editing, collections, tags, file attachments, and an MCP integration for Claude.',
    url: 'https://squirrelnotes.app',
    appUrl: 'https://my.squirrelnotes.app',
    tags: ['Zero-Knowledge', 'E2EE', 'Notes', 'MCP'],
    blogSlug: 'introducing-squirrel-notes',
    image: '/images/screenshot2.png',
  },
  {
    name: 'Fragile',
    kind: 'Engineering metrics',
    description:
      'A lightweight engineering metrics tool that syncs with Jira to surface DORA metrics, planning accuracy, cycle time, and roadmap accuracy — without the maintenance overhead of expensive SaaS alternatives. Built to give teams an honest snapshot of their sprints and planning.',
    githubUrl: 'https://github.com/garethrhughes/fragile',
    tags: ['DORA', 'Jira', 'Engineering Metrics'],
    blogSlug: 'introducing-fragile',
    image: '/images/screencapture-localhost-3000-dora-2026-04-15-12_10_43.png',
  },
  {
    name: 'gareth.photography',
    kind: 'Portfolio',
    description:
      'A photography portfolio showcasing landscapes, wildlife, and nature across Australia. Built as a statically-exported Next.js site with album-based organisation and a clean, minimal gallery experience.',
    url: 'https://gareth.photography',
    githubUrl: 'https://github.com/garethrhughes/gareth.photography',
    tags: ['Photography', 'Portfolio', 'Next.js'],
    image: '/images/gareth-photography-preview.jpg',
  },
];

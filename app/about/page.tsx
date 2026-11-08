import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { PAGE_COLUMNS, PageHeader, SectionLabel } from '@/components/PageHeader';
import { PostRow, PostRowList } from '@/components/PostRow';
import { GUTTER, Rail, RailRow } from '@/components/Rail';
import { TagPills } from '@/components/TagPill';
import { getAllPostMeta } from '@/lib/posts';
import type { Metadata } from 'next';

const title = 'About - Gareth Hughes';
const description =
  'Senior Engineering Manager in Sydney. Twenty years building software and over a decade leading engineering teams across England and Australia.';

export const metadata: Metadata = {
  title: 'About',
  description,
  alternates: {
    canonical: '/about/',
  },
  openGraph: {
    type: 'profile',
    url: '/about/',
    title,
    description,
    siteName: 'Gareth Hughes',
    images: [{ url: '/avatar.jpeg', alt: 'Gareth Hughes' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/avatar.jpeg'],
  },
};

const skills: { category: string; items: string[] }[] = [
  {
    category: 'Leadership',
    items: [
      'Managing managers',
      'Hiring',
      'Performance management',
      'Succession planning',
      'Resourcing & capacity',
      'Delivery governance',
      'DORA metrics',
    ],
  },
  {
    category: 'Architecture & Design',
    items: ['Event-Driven Architecture', 'Microservices', 'DDD', 'CQRS', 'System Design', 'Micro-FE'],
  },
  {
    category: 'Cloud & Infrastructure',
    items: ['AWS (ECS, Fargate, Lambda, DynamoDB)', 'Terraform', 'CDK', 'Elastic', 'Splunk'],
  },
  {
    category: 'Languages & Frameworks',
    items: ['C#', '.NET Framework', '.NET 5+', 'TypeScript', 'Node.js', 'React', 'Vue.js', 'GraphQL'],
  },
  {
    category: 'Data & Messaging',
    items: ['PostgreSQL', 'SQL Server', 'DynamoDB', 'SNS/SQS', 'Kafka', 'Snowflake', 'Entity Framework'],
  },
  {
    category: 'DevOps & Tooling',
    items: ['CI/CD', 'Docker', 'Azure DevOps', 'GitHub Actions', 'IaC', 'Serverless Framework'],
  },
  {
    category: 'AI & Automation',
    items: ['Agentic AI', 'Claude Code', 'OpenCode', 'MCP servers', 'GitHub Copilot', 'AI workflow design'],
  },
  {
    category: 'Security & Compliance',
    items: ['IAM Policy Design', 'Secrets Management', 'API Security', 'Client-side encryption', 'ISO 27001', 'PCI DSS'],
  },
];

interface SideProject {
  name: string;
  url: string;
  period: string;
  description: string;
  stack: string;
}

const sideProjects: SideProject[] = [
  {
    name: 'Squirrel Notes',
    url: 'https://squirrelnotes.app',
    period: 'Mar 2026 – Present',
    description:
      "A zero-knowledge, end-to-end encrypted notes app, built for ADHD brains. The passphrase never leaves the browser and the server stores only ciphertext. It includes an MCP server of about 44 tools, so Claude and other agents read and write notes with the user's own key, and a shared AI memory with on-device embeddings and hybrid retrieval. I design, direct and review it; AI does most of the typing, and I merge every change myself. Live and free to use.",
    stack: 'TypeScript · Node.js · AWS (CDK) · MCP · OpenCode · Claude Code',
  },
  {
    name: 'Fragile',
    url: 'https://github.com/garethrhughes/fragile',
    period: 'Apr 2026 – Present',
    description:
      'A self-hosted engineering metrics dashboard that connects to a Jira Cloud instance and surfaces DORA metrics, sprint and Kanban planning analytics, cycle time analysis, and roadmap accuracy tracking.',
    stack: 'TypeScript · Node.js · AWS · Terraform · OpenCode · Claude Code',
  },
];

interface Role {
  title: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string;
}

const roles: Role[] = [
  {
    title: 'Senior Engineering Manager',
    company: 'MyPass Global',
    companyUrl: 'https://en-us.mypassglobal.com/',
    location: 'Sydney',
    period: '2024–Present',
    summary:
      'Led software engineering and data across six teams (around 30 people) through a large-scale re-platforming.',
    highlights: [
      'Designed the future-state event-driven architecture replacing the legacy monolith, and the migration strategy across data, API and infrastructure',
      'Authored the multi-year technical roadmap, including the database migration strategy; leading the first upgrade of the legacy database in several years',
      'Helped win major enterprise mining engagements by running client discovery with a group product manager, designing the solution and its integrations, estimating the work, and writing the API specifications',
      'Manage six engineering managers; hired three lead, two principal and several senior engineers, and promoted two seniors into lead roles',
      'Own engineering resource allocation across the department, planned against the incoming client and commercial pipeline',
      'Introduced RFCs, go-live checklists and fortnightly governance and incident reviews, now run by the lead engineers; rolled out self-serve DevOps so teams release their own services; established Platform Engineering',
    ],
    stack: 'TypeScript · Node.js · AWS (ECS, Fargate, Lambda, DynamoDB, SNS/SQS) · PostgreSQL · Snowflake · Splunk · Terraform · CDK · Claude Code',
  },
  {
    title: 'Lead Engineer',
    company: 'A-Leagues',
    companyUrl: 'https://aleagues.com.au/',
    location: 'Sydney',
    period: '2023–2024',
    summary:
      'Established a new engineering team, building agile processes and optimising ways of working from the ground up.',
    highlights: [
      'Delivered aleagues.com.au for the 2023/24 season including full data migration from the legacy platform',
      'Built and launched 13 club websites including complete data migration',
      'Re-architected the data ingestion pipelines onto an event-driven architecture to cut cloud cost and improve reliability',
      'Established an engineering function that did not previously exist: two teams and 8 engineers at peak, hired half of them, set standards and CI/CD',
    ],
    stack: 'PHP · TypeScript · React · AWS (Lambda, SNS/SQS, DynamoDB) · Azure DevOps · CDK',
  },
  {
    title: 'Senior Software Developer',
    company: 'Pluralsight',
    companyUrl: 'https://www.pluralsight.com/',
    location: 'Remote',
    period: '2022–2023',
    summary:
      'Technical integration between A Cloud Guru and Pluralsight platforms following acquisition, working across distributed systems and event-driven architecture.',
    highlights: [
      'Led large-scale Node.js version upgrade across multiple services, improving security posture and enabling modern tooling',
      'Developed custom Serverless Framework plugin to standardise secrets management across 50+ Lambda functions',
      "Architected integration with Pluralsight's Kafka-based event platform using Inbox/Outbox pattern for reliable message delivery",
    ],
    stack: 'TypeScript · Node.js · GraphQL · Serverless Framework · Kafka · AWS (Lambda, DynamoDB, Secrets Manager)',
  },
  {
    title: 'Software Engineering Team Lead',
    company: 'Wilbur',
    location: 'Remote',
    period: '2020–2022',
    summary:
      'Led engineering on an insurance claims platform, establishing agile methodologies and modernising legacy systems.',
    highlights: [
      'Took over an insurance claims platform from an outgoing team while keeping the business running; built the replacement team (5 engineers at peak)',
      'Migrated the legacy .NET application from Azure VMs to AWS Fargate, reducing infrastructure cost and improving deployment velocity',
      'Architected a new cloud-native repair portal using CQRS and MediatR. Moved the stack from .NET Framework to .NET 6',
      'Built pipelines in Azure DevOps with Terraform',
    ],
    stack: 'C# · .NET 6 · AWS (ECS, Fargate, SQS/SNS, Lambda) · SQL Server · PostgreSQL · Terraform · Vue.js',
  },
  {
    title: 'Software Engineering Team Lead',
    company: 'Domain',
    companyUrl: 'https://domain.com.au/',
    location: 'Sydney',
    period: '2019–2020',
    summary:
      'Responsible for the billing platform, managing complex stakeholder relationships across Strategy, Salesforce, and Operations teams.',
    highlights: [
      'Delivered a complex price change project introducing a price-banding system, coordinating across multiple business units',
      'Designed and delivered architecture for migration from bulk billing to real-time billing with Zuora and Salesforce integrations',
      'Improved platform stability and reduced latency through service modernisation and caching strategies',
    ],
    stack: 'C# · .NET Framework · AWS (EC2, SQS/SNS, Lambda) · SQL Server · Elasticsearch · Salesforce',
  },
  {
    title: 'Technical Director',
    company: 'Helium',
    location: 'Sydney',
    period: '2016–2019',
    summary:
      'Responsible for all technical aspects of the consultancy including strategy, team resourcing, and engineering processes. Combined hands-on technical leadership with client-facing responsibilities.',
    highlights: [
      'Established technical strategy and engineering processes for a growing consultancy',
      'Led technical engagement for major clients including Transport for NSW and ALDI',
      "Designed for and deployed into closed government environments, and liaised directly with ALDI's IT division",
      'Delivered end-to-end solutions from pre-sales through to production handover',
    ],
    stack: 'C# · .NET Framework · Node.js · React · Vue.js · PHP · AWS',
  },
];

const RECENT_POST_COUNT = 7;

const earlierRoles: { company: string; role: string; detail: string; tags?: string[] }[] = [
  {
    company: 'Corporate Travel Management',
    role: 'Senior Developer',
    detail:
      'Rebuilt the hotel availability search and booking engine; the platform supported booking volume growth of over 500% in six months.',
  },
  {
    company: 'HotelsCombined',
    role: 'Senior Developer',
    detail:
      'Built a secure credit card vault relaying card data to third parties, and localised marketing email reaching 300,000 people weekly.',
  },
  {
    company: 'Nine',
    role: 'Senior Contract Engineer',
    detail: "Full-stack .NET and Node.js on one of Australia's highest-traffic websites.",
  },
  {
    company: 'TechnoPhobia',
    role: 'Junior → Developer → Senior Developer',
    detail: 'Technical lead on a large UK government e-commerce platform, including its Java/Lucene search engine over 500,000 products and services.',
    tags: ['PHP'],
  },
];


/** A section break: small-caps label over a top rule, matching the home page. */
function Section({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mt-10 border-t border-border pt-7 md:mt-14 md:pt-9 ${className}`}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </section>
  );
}

/** `C# · .NET 6 · AWS` → quiet pills, the site's one passive tag treatment. */
function StackChips({ stack }: { stack: string }) {
  return <TagPills tags={stack.split('·').map((s) => s.trim()).filter(Boolean)} />;
}

/**
 * A role's period in the rail gutter. Stacked rather than inline: "2024–Present" does not
 * fit the 52px mobile gutter on one line, and there is no break opportunity in it.
 */
function Period({ period }: { period: string }) {
  const [from, to] = period.split('–');
  return (
    <>
      <span className="block">{from}</span>
      {to && <span className="block opacity-70">{to.toUpperCase()}</span>}
    </>
  );
}

export default function AboutPage() {
  const posts = getAllPostMeta();
  /** Enough rows to run the rail down alongside the intro rather than stopping short. */
  const recent = posts.slice(0, RECENT_POST_COUNT);
  const total = posts.length;

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/about/" />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-14">
        {/* Both columns start at the top. Previously the header spanned the page and the
            actions sat in a right-hand cell that was otherwise empty, so the row read as a
            heavy left block against a thin strip pinned to its bottom edge. */}
        <div className={`grid gap-8 ${PAGE_COLUMNS}`}>
          <div>
        <PageHeader
          layout="stacked"
          label="Gareth Hughes"
          lead="Senior Engineering Manager in Sydney. Twenty years building software, and over a decade leading the people who build it."
          leading={
            <Image
              src="/avatar.jpeg"
              alt="Gareth Hughes"
              width={96}
              height={96}
              className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-squirrel-200 md:h-24 md:w-24"
              priority
            />
          }
        >
          <div className="flex flex-wrap gap-2">
            <Link
              href="/calendar/"
              className="inline-flex items-center gap-1.5 rounded-md bg-squirrel-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-squirrel-600"
            >
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Book a call
            </Link>
            <Link
              href="https://www.linkedin.com/in/garethhughes/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <svg role="img" viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              LinkedIn
            </Link>
            <Link
              href="https://github.com/garethrhughes/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <svg role="img" viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
              GitHub
            </Link>
          </div>
        </PageHeader>

        <section className="space-y-4 leading-relaxed text-text-secondary">
          <p>
            I lead software engineering and data at MyPass Global: six teams, around 30 people, six engineering managers who own their outcomes. We are part-way through a large re-platforming from a legacy monolith to an event-driven architecture. I designed the future-state architecture and wrote the multi-year roadmap behind it, and I set the governance the teams now run themselves: RFCs, go-live checklists, fortnightly incident reviews and the SOPs that support ISO 27001.
          </p>
          <p>
            I stay technical by building outside work.{' '}
            <Link href="https://squirrelnotes.app" className="text-squirrel-700 underline-offset-2 hover:underline">Squirrel Notes</Link>
            {' '}is a zero-knowledge encrypted notes app with an MCP server and a shared AI memory;{' '}
            <Link href="https://github.com/garethrhughes/fragile" className="text-squirrel-700 underline-offset-2 hover:underline">Fragile</Link>
            {' '}is a self-hosted DORA and delivery metrics platform. Building them end to end is how I keep my judgement calibrated, and how I have formed a view on where AI-assisted development helps and where it does not.
          </p>
          <p>
            Twenty years across England and Australia, in real estate, resources, compliance, insurance, travel and digital media. The through-line is modernisation under constraint: legacy platforms made survivable, leads who do not need me in the room, and plain translation between engineers and the people funding them.
          </p>
        </section>
          </div>

          {/* Recent writing, not a boxed callout — /about/ sits on a blog, so the natural
              thing to put beside a CV is the writing itself. No thumbnails: they compete
              with the prose in the neighbouring column.

              Desktop only. Stacked under the intro on mobile it stops being a companion
              column and just delays the CV, which is what the page is for. The nav and the
              home timeline already reach the writing from here. */}
          <aside className="hidden self-start md:block">
            <SectionLabel>Recent writing</SectionLabel>
            <PostRowList>
              {recent.map((post) => (
                <PostRow key={post.slug} post={post} thumbnail={false} />
              ))}
            </PostRowList>
            <Link
              href="/archive/"
              className="mt-3.5 inline-block text-sm font-medium text-squirrel-700 transition-colors hover:text-squirrel-800"
            >
              All {total} posts →
            </Link>
          </aside>
        </div>

        {/* Skills — a label/value list, not seven card boxes. The category names are too
            long for the 96px rail gutter, so this borrows the rail's idea (quiet label on
            the left, content threaded on the right) at a width that fits them. */}
        <Section label="Skills">
          <dl className="divide-y divide-border border-t border-border">
            {skills.map((group) => (
              <div
                key={group.category}
                className="flex flex-col gap-2 py-4 md:flex-row md:gap-6"
              >
                <dt className="shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted md:w-52">
                  {group.category}
                </dt>
                <dd className="flex-1">
                  <TagPills tags={group.items} />
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section label="Side projects">
          <div className="grid gap-4 md:grid-cols-2">
            {sideProjects.map((project) => (
              <article
                key={project.name}
                className="rounded-xl border border-border bg-surface-alt p-5 transition-colors hover:border-squirrel-300"
              >
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    <Link href={project.url} className="transition-colors hover:text-squirrel-700">
                      {project.name}
                    </Link>
                  </h3>
                  <span className={`${GUTTER} shrink-0`}>{project.period}</span>
                </div>
                <p className="mb-3 leading-relaxed text-text-secondary">{project.description}</p>
                <StackChips stack={project.stack} />
              </article>
            ))}
          </div>
        </Section>

        {/* Experience — the rail. This is the one section on the site whose content is most
            obviously a timeline; STYLE_GUIDE.md already called it one when it was divide-y. */}
        <Section label="Experience">
          <Rail>
            {roles.map((role, i) => (
              <RailRow
                key={`${role.company}-${role.period}`}
                gutter={<Period period={role.period} />}
                emphasis={i === 0}
              >
                <div className="mb-1 text-[17px] font-semibold leading-[1.35] text-text-primary md:text-[19px]">
                  {role.title}
                </div>
                <div className="mb-3 text-sm text-text-muted">
                  {role.companyUrl ? (
                    <Link
                      href={role.companyUrl}
                      className="font-medium text-squirrel-700 underline-offset-2 hover:underline"
                    >
                      {role.company}
                    </Link>
                  ) : (
                    <span className="font-medium text-text-secondary">{role.company}</span>
                  )}
                  {' · '}
                  {role.location}
                </div>
                <p className="mb-3 max-w-[720px] leading-relaxed text-text-secondary">
                  {role.summary}
                </p>
                <ul className="mb-4 max-w-[720px] list-disc space-y-1.5 pl-5 leading-relaxed text-text-secondary marker:text-text-faint">
                  {role.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <StackChips stack={role.stack} />
              </RailRow>
            ))}
          </Rail>
        </Section>

        {/* Tabular data keeps the table-in-card pattern — the style guide's own worked
            example — minus the shadow. */}
        <Section label="Earlier roles">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead className="bg-surface-alt text-text-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Company</th>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {earlierRoles.map(({ company, role, detail, tags }) => (
                  <tr key={company} className="transition-colors hover:bg-surface-hover">
                    <td className="px-4 py-3 align-top font-medium text-text-primary">{company}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {role}
                      <p className="mt-1 text-text-muted">{detail}</p>
                      {tags && <TagPills tags={tags} className="mt-2" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section label="Education">
          <p className="text-text-secondary">
            <span className="font-semibold text-text-primary">Sheffield Hallam University</span>
            {' — '}BSc (Hons) Computing, Software Engineering — <em>First Class</em>, 2004–2008
          </p>
        </Section>
      </main>
    </div>
  );
}

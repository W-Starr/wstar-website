#!/usr/bin/env node

/**
 * WSTAR OS Agent CLI — Standalone Task & Operating System Sync Tool
 * Allows local LLMs and autonomous agents to query, claim, update, and resolve
 * work items, architectural decisions, and activity logs directly against Sanity Cloud.
 *
 * Zero external dependencies: Uses native Node.js https and fs modules.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Load environment variables from .env.local if not already in process.env
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(__dirname, '..', '.env.local'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let val = match[2].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
      break;
    }
  }
}

loadEnv();

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qx20j59l';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const API_VERSION = '2024-03-01';
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!WRITE_TOKEN) {
  console.error('[Error] SANITY_API_WRITE_TOKEN is missing in environment or .env.local.');
  process.exit(1);
}

// 2. HTTP Helper Functions
function sanityRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: `${PROJECT_ID}.api.sanity.io`,
      port: 443,
      path: `/v${API_VERSION}/${endpoint}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${WRITE_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed.result !== undefined ? parsed.result : parsed);
          } else {
            reject(new Error(parsed.error?.description || parsed.message || `HTTP ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function querySanity(groqQuery) {
  const encoded = encodeURIComponent(groqQuery);
  return sanityRequest('GET', `data/query/${DATASET}?query=${encoded}`);
}

function mutateSanity(mutations) {
  return sanityRequest('POST', `data/mutate/${DATASET}`, { mutations });
}

// 3. CLI Command Parsers & Helpers
function parseArgs(args) {
  const flags = {};
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  return { positional, flags };
}

// 4. Command Handlers
async function handleTasks(positional, flags) {
  const sub = positional[1] || 'list';

  if (sub === 'list' || sub === 'ls') {
    let filters = ['_type == "workItem"'];
    if (flags.product) filters.push(`(productId == "${flags.product}" || product._ref == "product-${flags.product}")`);
    if (flags.status) filters.push(`status == "${flags.status}"`);
    if (flags.priority) filters.push(`priority == "${flags.priority}"`);
    if (flags.assignee) filters.push(`assignee == "${flags.assignee}"`);
    if (flags.type) filters.push(`type == "${flags.type}"`);

    const query = `*[${filters.join(' && ')}] | order(priority asc, _createdAt desc) {
      _id,
      itemNumber,
      title,
      type,
      status,
      priority,
      assignee,
      productId,
      codeReference,
      _updatedAt
    }`;

    const items = await querySanity(query);
    if (flags.json) {
      console.log(JSON.stringify(items, null, 2));
      return;
    }

    console.log(`\n📋 WSTAR OS Work Items (${items.length} found):\n`);
    if (items.length === 0) {
      console.log('  No work items found matching the given filters.\n');
      return;
    }

    items.forEach((item) => {
      const priorityColor = item.priority === 'critical' ? '🔴 CRITICAL' : item.priority === 'high' ? '🟠 HIGH' : item.priority === 'medium' ? '🟡 MED' : '⚪ LOW';
      const statusIcon = item.status === 'done' ? '✅' : item.status === 'in_progress' ? '🔄' : item.status === 'blocked' ? '🚫' : '⏳';
      console.log(`  ${statusIcon} [${item._id}] ${item.itemNumber || ''} (${priorityColor}) [${item.type || 'task'}]`);
      console.log(`     Title: ${item.title}`);
      console.log(`     Status: ${item.status} | Assignee: ${item.assignee || 'unassigned'} | Product: ${item.productId || 'ace-acad'}`);
      if (item.codeReference) console.log(`     Ref: ${item.codeReference}`);
      console.log('');
    });
    return;
  }

  if (sub === 'get') {
    const id = positional[2];
    if (!id) {
      console.error('Usage: node scripts/wstar-agent.js task get <id>');
      process.exit(1);
    }

    const item = await querySanity(`*[_type == "workItem" && (_id == "${id}" || itemNumber == "${id}")][0]`);
    if (!item) {
      console.error(`[Error] Work item not found: ${id}`);
      process.exit(1);
    }

    if (flags.json) {
      console.log(JSON.stringify(item, null, 2));
    } else {
      console.log('\n📋 Work Item Details:');
      console.log(`  ID: ${item._id}`);
      console.log(`  Number: ${item.itemNumber || 'N/A'}`);
      console.log(`  Title: ${item.title}`);
      console.log(`  Description: ${item.description || 'N/A'}`);
      console.log(`  Type: ${item.type} | Priority: ${item.priority} | Status: ${item.status}`);
      console.log(`  Assignee: ${item.assignee || 'unassigned'} | Product: ${item.productId || 'ace-acad'}`);
      if (item.codeReference) console.log(`  Code Reference: ${item.codeReference}`);
      if (item.subtasks && item.subtasks.length > 0) {
        console.log('  Subtasks:');
        item.subtasks.forEach((st, i) => {
          console.log(`    ${st.completed ? '☑' : '☐'} ${st.title}`);
        });
      }
      console.log('');
    }
    return;
  }

  if (sub === 'claim' || sub === 'start') {
    const id = positional[2];
    const assignee = flags.assignee || 'abdulaziz';
    if (!id) {
      console.error('Usage: node scripts/wstar-agent.js task claim <id> [--assignee abdulaziz]');
      process.exit(1);
    }

    // Resolve doc ID if itemNumber was passed
    const existing = await querySanity(`*[_type == "workItem" && (_id == "${id}" || itemNumber == "${id}")][0] {_id, title}`);
    if (!existing) {
      console.error(`[Error] Work item not found: ${id}`);
      process.exit(1);
    }

    await mutateSanity([
      {
        patch: {
          id: existing._id,
          set: {
            status: 'in_progress',
            assignee: assignee,
            updatedAt: new Date().toISOString(),
          },
        },
      },
      {
        create: {
          _type: 'activityItem',
          actor: assignee === 'abdulaziz' ? 'Abdulaziz' : assignee === 'ibrahim' ? 'Ibrahim' : 'AI Agent',
          action: 'started work on',
          targetTitle: existing.title,
          targetType: 'task',
          timestamp: new Date().toISOString(),
          badgeColor: 'blue',
        },
      },
    ]);

    console.log(`✅ Claimed task ${existing._id} (${existing.title}) — status set to in_progress [Assignee: ${assignee}]`);
    return;
  }

  if (sub === 'done' || sub === 'resolve' || sub === 'complete') {
    const id = positional[2];
    const note = flags.note || flags.summary || 'Task completed and verified';
    const assignee = flags.assignee || 'abdulaziz';

    if (!id) {
      console.error('Usage: node scripts/wstar-agent.js task done <id> [--note "Verification details"]');
      process.exit(1);
    }

    const existing = await querySanity(`*[_type == "workItem" && (_id == "${id}" || itemNumber == "${id}")][0] {_id, title}`);
    if (!existing) {
      console.error(`[Error] Work item not found: ${id}`);
      process.exit(1);
    }

    await mutateSanity([
      {
        patch: {
          id: existing._id,
          set: {
            status: 'done',
            updatedAt: new Date().toISOString(),
          },
        },
      },
      {
        create: {
          _type: 'activityItem',
          actor: assignee === 'abdulaziz' ? 'Abdulaziz' : assignee === 'ibrahim' ? 'Ibrahim' : 'AI Agent',
          action: 'completed',
          targetTitle: `${existing.title}${note ? ` (${note})` : ''}`,
          targetType: 'task',
          timestamp: new Date().toISOString(),
          badgeColor: 'emerald',
        },
      },
    ]);

    console.log(`🎉 Task marked as DONE: ${existing._id} — "${existing.title}"`);
    console.log(`   Verification note: ${note}`);
    return;
  }

  if (sub === 'create' || sub === 'add') {
    const title = flags.title || positional.slice(2).join(' ');
    if (!title) {
      console.error('Usage: node scripts/wstar-agent.js task create --title "..." [--type bug|task] [--priority critical|high|medium|low] [--product ace-acad] [--assignee abdulaziz]');
      process.exit(1);
    }

    const docId = `work-${Date.now()}`;
    const type = flags.type || 'task';
    const priority = flags.priority || 'medium';
    const productId = flags.product || 'ace-acad';
    const assignee = flags.assignee || 'abdulaziz';
    const description = flags.description || flags.desc || '';
    const codeRef = flags.ref || flags.codeReference || '';

    const newDoc = {
      _id: docId,
      _type: 'workItem',
      itemNumber: `TASK-${Date.now().toString().slice(-4)}`,
      title: title,
      description: description,
      type: type,
      status: flags.status || 'todo',
      priority: priority,
      productId: productId,
      assignee: assignee,
      codeReference: codeRef,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await mutateSanity([
      { create: newDoc },
      {
        create: {
          _type: 'activityItem',
          actor: assignee === 'abdulaziz' ? 'Abdulaziz' : assignee === 'ibrahim' ? 'Ibrahim' : 'AI Agent',
          action: 'created',
          targetTitle: title,
          targetType: 'task',
          timestamp: new Date().toISOString(),
          badgeColor: 'purple',
        },
      },
    ]);

    console.log(`✅ Created Work Item: [${docId}] ${newDoc.itemNumber} — "${title}" (${priority})`);
    return;
  }

  console.error(`Unknown task command: ${sub}`);
  console.log('Available commands: task list, task get, task claim, task done, task create');
}

async function handleDecisions(positional, flags) {
  const sub = positional[1] || 'list';

  if (sub === 'list' || sub === 'ls') {
    const decisions = await querySanity(`*[_type == "decision"] | order(date desc) {
      _id,
      decisionNumber,
      title,
      decision,
      reason,
      status,
      date,
      productId
    }`);

    if (flags.json) {
      console.log(JSON.stringify(decisions, null, 2));
      return;
    }

    console.log(`\n🏛️ WSTAR Architectural & Strategic Decisions (${decisions.length}):\n`);
    decisions.forEach((d) => {
      console.log(`  📌 [${d._id}] ${d.decisionNumber || ''}: ${d.title} (${d.status || 'accepted'})`);
      console.log(`     Decision: ${d.decision}`);
      console.log(`     Reason: ${d.reason}`);
      console.log(`     Date: ${d.date} | Product: ${d.productId || 'ace-acad'}\n`);
    });
    return;
  }

  if (sub === 'log' || sub === 'create' || sub === 'add') {
    const title = flags.title;
    const decisionText = flags.decision;
    const reasonText = flags.reason || flags.rationale;
    const productId = flags.product || 'ace-acad';

    if (!title || !decisionText || !reasonText) {
      console.error('Usage: node scripts/wstar-agent.js decision log --title "..." --decision "..." --reason "..." [--product ace-acad]');
      process.exit(1);
    }

    const docId = `decision-${Date.now()}`;
    const newDecision = {
      _id: docId,
      _type: 'decision',
      decisionNumber: `DEC-${Date.now().toString().slice(-3)}`,
      title: title,
      decision: decisionText,
      reason: reasonText,
      status: 'accepted',
      date: new Date().toISOString().split('T')[0],
      productId: productId,
      participants: ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
    };

    await mutateSanity([
      { create: newDecision },
      {
        create: {
          _type: 'activityItem',
          actor: 'AI Agent',
          action: 'logged architectural decision',
          targetTitle: `${newDecision.decisionNumber}: ${title}`,
          targetType: 'decision',
          timestamp: new Date().toISOString(),
          badgeColor: 'amber',
        },
      },
    ]);

    console.log(`✅ Logged Architectural Decision: [${docId}] ${newDecision.decisionNumber} — "${title}"`);
    return;
  }

  console.error(`Unknown decision command: ${sub}`);
}

async function handleActivity(positional, flags) {
  const sub = positional[1] || 'list';

  if (sub === 'list' || sub === 'ls') {
    const activities = await querySanity(`*[_type == "activityItem"] | order(timestamp desc)[0...15] {
      _id,
      actor,
      action,
      targetTitle,
      targetType,
      timestamp,
      badgeColor
    }`);

    if (flags.json) {
      console.log(JSON.stringify(activities, null, 2));
      return;
    }

    console.log(`\n⚡ Recent WSTAR OS Activity Stream (Last 15):\n`);
    activities.forEach((a) => {
      console.log(`  • [${a.timestamp ? a.timestamp.slice(11, 16) : '--:--'}] ${a.actor} ${a.action} "${a.targetTitle}" (${a.targetType})`);
    });
    console.log('');
    return;
  }

  if (sub === 'log' || sub === 'add') {
    const action = flags.action || 'updated';
    const target = flags.target || positional.slice(2).join(' ');
    const actor = flags.actor || 'AI Agent';
    const targetType = flags.type || 'task';

    if (!target) {
      console.error('Usage: node scripts/wstar-agent.js activity log --action "..." --target "..." [--type task|decision|proposal]');
      process.exit(1);
    }

    await mutateSanity([
      {
        create: {
          _type: 'activityItem',
          actor: actor,
          action: action,
          targetTitle: target,
          targetType: targetType,
          timestamp: new Date().toISOString(),
          badgeColor: 'blue',
        },
      },
    ]);

    console.log(`✅ Logged Activity: ${actor} ${action} "${target}"`);
    return;
  }
}

async function handleProposals(positional, flags) {
  const proposals = await querySanity(`*[_type == "proposal"] | order(_createdAt desc) {
    _id,
    proposalNumber,
    title,
    status,
    category,
    authors,
    _createdAt
  }`);

  if (flags.json) {
    console.log(JSON.stringify(proposals, null, 2));
    return;
  }

  console.log(`\n💡 Strategic Proposals Hub (${proposals.length}):\n`);
  proposals.forEach((p) => {
    console.log(`  📄 [${p._id}] ${p.proposalNumber || ''}: ${p.title}`);
    console.log(`     Status: ${p.status} | Category: ${p.category || 'Strategy'} | Author: ${(p.authors || []).join(', ')}\n`);
  });
}

// 5. Main Dispatcher
async function main() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.length === 0 || rawArgs[0] === '--help' || rawArgs[0] === '-h') {
    console.log(`
WSTAR OS Agent CLI — Autonomous Sync & Task Protocol

Usage:
  node scripts/wstar-agent.js <command> [options]

Commands:
  tasks / task list                     List work items (--product, --status, --priority, --assignee)
  task get <id>                         Inspect full details of a work item
  task claim <id>                       Claim and set task status to in_progress
  task done <id> [--note "text"]        Mark task as done and log verification activity
  task create --title "..." [options]   Create a new task or bug ticket
  
  decisions / decision list             List architectural decision records (ADRs)
  decision log --title "..." ...        Log an architectural decision
  
  activity / activity list              View live operational stream
  activity log --action "..." ...       Emit a manual activity event
  
  proposals                             List strategic proposals

Options:
  --json                                Output raw JSON for machine parsing
  --product <ace-acad|plantiq|wstar>    Filter by product scope
  --status <todo|in_progress|done>      Filter by status
  --priority <critical|high|medium|low> Filter by priority
`);
    return;
  }

  const { positional, flags } = parseArgs(rawArgs);
  const primary = positional[0];

  try {
    switch (primary) {
      case 'tasks':
      case 'task':
        await handleTasks(positional, flags);
        break;
      case 'decisions':
      case 'decision':
        await handleDecisions(positional, flags);
        break;
      case 'activity':
      case 'activities':
        await handleActivity(positional, flags);
        break;
      case 'proposals':
      case 'proposal':
        await handleProposals(positional, flags);
        break;
      default:
        console.error(`Unknown command: ${primary}. Run with --help for usage.`);
        process.exit(1);
    }
  } catch (err) {
    console.error(`\n❌ [WSTAR OS CLI Error]: ${err.message}\n`);
    process.exit(1);
  }
}

main();

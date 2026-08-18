import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import {
  initialProducts,
  initialProductAreas,
  initialProposals,
  initialWorkItems,
  initialDecisions,
  initialFeedback,
  initialProjects,
  initialRoadmap,
  initialActivities,
} from '@/os/data/initialSeed'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qx20j59l'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

const writeClient = token
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-03-01',
      token,
      useCdn: false,
    })
  : null

export async function POST() {
  if (!writeClient) {
    return NextResponse.json(
      {
        success: false,
        error:
          'SANITY_API_WRITE_TOKEN is missing. Please add SANITY_API_WRITE_TOKEN to .env.local or Vercel Environment Variables to seed Sanity.',
      },
      { status: 400 }
    )
  }

  try {
    let seededCount = 0
    const tx = writeClient.transaction()

    // 1. Products
    for (const p of initialProducts) {
      tx.createOrReplace({
        _id: `product-${p.id}`,
        _type: 'product',
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        status: p.status,
        version: p.version,
        targetAudience: p.targetAudience,
      })
      seededCount++
    }

    // 2. Product Areas
    for (const a of initialProductAreas) {
      tx.createOrReplace({
        _id: `area-${a.id}`,
        _type: 'productArea',
        name: a.name,
        description: a.description,
        maturity: a.maturity,
        owner: a.owner,
        iconName: a.iconName,
        product: { _type: 'reference', _ref: `product-${a.productId}` },
      })
      seededCount++
    }

    // 3. Strategic Proposals
    for (const prop of initialProposals) {
      tx.createOrReplace({
        _id: `proposal-${prop.id}`,
        _type: 'proposal',
        proposalNumber: prop.proposalNumber,
        title: prop.title,
        subtitle: prop.subtitle,
        category: prop.category,
        status: prop.status,
        date: prop.date,
        authors: prop.authors,
        executiveSummary: prop.executiveSummary,
        proposedSolution: prop.proposedSolution,
        filename: prop.filename,
      })
      seededCount++
    }

    // 4. Work Items
    for (const w of initialWorkItems) {
      tx.createOrReplace({
        _id: `work-${w.id}`,
        _type: 'workItem',
        itemNumber: w.itemNumber,
        title: w.title,
        type: w.type,
        status: w.status,
        priority: w.priority,
        description: w.description,
        assignee: w.assignee,
        dueDate: w.dueDate,
        codeReference: w.codeReference,
        product: { _type: 'reference', _ref: `product-${w.productId}` },
        productArea: { _type: 'reference', _ref: `area-${w.productAreaId}` },
      })
      seededCount++
    }

    // 5. Decisions
    for (const d of initialDecisions) {
      tx.createOrReplace({
        _id: `decision-${d.id}`,
        _type: 'decision',
        decisionNumber: d.decisionNumber,
        title: d.title,
        decision: d.decision,
        reason: d.reason,
        status: d.status,
        participants: d.participants,
        date: d.date,
        consequences: d.consequences,
      })
      seededCount++
    }

    // 6. Feedback
    for (const f of initialFeedback) {
      tx.createOrReplace({
        _id: `feedback-${f.id}`,
        _type: 'feedbackItem',
        subject: f.subject,
        type: f.type,
        description: f.description,
        userId: f.userId,
        timestamp: f.timestamp,
        status: f.status,
      })
      seededCount++
    }

    // 7. Projects
    for (const pr of initialProjects) {
      tx.createOrReplace({
        _id: `project-${pr.id}`,
        _type: 'project',
        name: pr.name,
        summary: pr.summary,
        status: pr.status,
        targetDate: pr.targetDate,
        lead: pr.lead,
        progress: pr.progress,
      })
      seededCount++
    }

    // 8. Roadmap
    for (const r of initialRoadmap) {
      tx.createOrReplace({
        _id: `roadmap-${r.id}`,
        _type: 'roadmapItem',
        title: r.title,
        horizon: r.horizon,
        description: r.description,
        targetQuarter: r.targetQuarter,
        category: r.category,
      })
      seededCount++
    }

    // 9. Activity Items
    for (const act of initialActivities) {
      tx.createOrReplace({
        _id: `activity-${act.id}`,
        _type: 'activityItem',
        actor: act.actor,
        action: act.action,
        targetTitle: act.targetTitle,
        targetType: act.targetType,
        timestamp: act.timestamp,
        badgeColor: act.badgeColor,
      })
      seededCount++
    }

    await tx.commit()

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${seededCount} documents into Sanity production dataset!`,
      seededCount,
    })
  } catch (err: any) {
    console.error('Error seeding Sanity dataset:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

/**
 * MYNE7X BPO PDF Engine
 * Professional branded PDF generation using jsPDF.
 *
 * All documents share a consistent premium layout:
 * - Branded header with gradient strip
 * - Document title + reference number
 * - Date + recipient information
 * - Main content
 * - Authorized signature section
 * - Footer with page numbers
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const BRAND = {
  name: 'MYNE7X BPO',
  tagline: 'Professional Customer Support & Business Process Outsourcing',
  primary: [139, 92, 246] as [number, number, number], // violet
  secondary: [99, 102, 241] as [number, number, number], // indigo
  dark: [10, 14, 31] as [number, number, number], // navy-950
  light: [241, 245, 249] as [number, number, number],
  muted: [148, 163, 184] as [number, number, number],
  success: [16, 185, 129] as [number, number, number],
  warning: [245, 158, 11] as [number, number, number],
  danger: [244, 63, 94] as [number, number, number],
}

export interface PdfDoc {
  doc: jsPDF
  pageWidth: number
  pageHeight: number
  margin: number
  cursorY: number
}

export function createPdf(orientation: 'p' | 'l' = 'p'): PdfDoc {
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  return { doc, pageWidth, pageHeight, margin, cursorY: 0 }
}

export function drawHeader(ctx: PdfDoc, title: string, referenceNo: string, date?: string) {
  const { doc, pageWidth, margin } = ctx

  // Top gradient strip
  doc.setFillColor(...BRAND.primary)
  doc.rect(0, 0, pageWidth, 4, 'F')
  doc.setFillColor(...BRAND.secondary)
  doc.rect(pageWidth / 2, 0, pageWidth / 2, 4, 'F')

  // Brand name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...BRAND.dark)
  doc.text(BRAND.name, margin, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...BRAND.muted)
  doc.text(BRAND.tagline, margin, 23)

  // Right side: reference + date
  doc.setFontSize(9)
  doc.setTextColor(...BRAND.dark)
  doc.text(`Ref: ${referenceNo}`, pageWidth - margin, 18, { align: 'right' })
  if (date) {
    doc.setFontSize(8)
    doc.setTextColor(...BRAND.muted)
    doc.text(`Date: ${date}`, pageWidth - margin, 23, { align: 'right' })
  }

  // Divider
  doc.setDrawColor(...BRAND.primary)
  doc.setLineWidth(0.5)
  doc.line(margin, 27, pageWidth - margin, 27)

  // Document title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...BRAND.dark)
  doc.text(title.toUpperCase(), margin, 35)

  ctx.cursorY = 42
}

export function drawFooter(ctx: PdfDoc) {
  const { doc, pageWidth, pageHeight, margin } = ctx
  const pageCount = doc.getNumberOfPages()

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    // Footer divider
    doc.setDrawColor(...BRAND.muted)
    doc.setLineWidth(0.2)
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15)

    // Footer text
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...BRAND.muted)
    doc.text(
      `${BRAND.name} · Confidential · Generated electronically`,
      margin,
      pageHeight - 10
    )
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    )
  }
}

export function addInfoBlock(ctx: PdfDoc, label: string, value: string, x: number, y: number, width: number) {
  const { doc } = ctx
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...BRAND.muted)
  doc.text(label.toUpperCase(), x, y)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...BRAND.dark)
  const lines = doc.splitTextToSize(value, width)
  doc.text(lines, x, y + 5)
  return y + 5 + lines.length * 4
}

export function drawSignatureSection(ctx: PdfDoc, signatoryLabel = 'Authorized Signatory') {
  const { doc, pageWidth, margin } = ctx
  ctx.cursorY += 25

  // Two-column signatures
  const colWidth = (pageWidth - margin * 2 - 20) / 2

  doc.setDrawColor(...BRAND.muted)
  doc.setLineWidth(0.3)
  doc.line(margin, ctx.cursorY, margin + colWidth, ctx.cursorY)
  doc.line(margin + colWidth + 20, ctx.cursorY, margin + colWidth * 2 + 20, ctx.cursorY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...BRAND.muted)
  doc.text('Employee Signature', margin, ctx.cursorY + 5)
  doc.text(signatoryLabel, margin + colWidth + 20, ctx.cursorY + 5)

  ctx.cursorY += 20
}

export function addSectionTitle(ctx: PdfDoc, title: string) {
  const { doc, pageWidth, margin } = ctx
  if (ctx.cursorY > 240) {
    ctx.doc.addPage()
    ctx.cursorY = 20
  }

  doc.setFillColor(...BRAND.primary)
  doc.rect(margin, ctx.cursorY - 3, 2, 6, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...BRAND.dark)
  doc.text(title, margin + 4, ctx.cursorY + 1)

  ctx.cursorY += 6
}

// ----- Specific document generators -----

export function generatePayslipPDF(data: {
  referenceNo: string
  employeeName: string
  employeeId: string
  department?: string
  position?: string
  payPeriod: string
  attendanceSummary?: Record<string, number>
  earnings: { label: string; amount: number }[]
  deductions: { label: string; amount: number }[]
  netSalary: number
  paymentStatus: string
}) {
  const ctx = createPdf()
  drawHeader(ctx, 'Payslip', data.referenceNo, new Date().toLocaleDateString())

  // Employee info
  const { doc, margin, pageWidth } = ctx
  const half = (pageWidth - margin * 2) / 2

  ctx.cursorY = addInfoBlock(ctx, 'Employee Name', data.employeeName, margin, ctx.cursorY, half - 5)
  ctx.cursorY = 48
  addInfoBlock(ctx, 'Employee ID', data.employeeId, margin + half, ctx.cursorY, half - 5)
  ctx.cursorY = 60

  addInfoBlock(ctx, 'Department', data.department || '—', margin, ctx.cursorY, half - 5)
  ctx.cursorY = 60
  addInfoBlock(ctx, 'Position', data.position || '—', margin + half, ctx.cursorY, half - 5)
  ctx.cursorY = 70

  addInfoBlock(ctx, 'Pay Period', data.payPeriod, margin, ctx.cursorY, half - 5)
  ctx.cursorY = 70
  addInfoBlock(ctx, 'Payment Status', data.paymentStatus, margin + half, ctx.cursorY, half - 5)
  ctx.cursorY = 82

  // Attendance summary
  if (data.attendanceSummary) {
    addSectionTitle(ctx, 'Attendance Summary')
    autoTable(doc, {
      startY: ctx.cursorY,
      head: [['Present', 'Absent', 'Late', 'Leave', 'Working Days']],
      body: [[
        String(data.attendanceSummary.present ?? 0),
        String(data.attendanceSummary.absent ?? 0),
        String(data.attendanceSummary.late ?? 0),
        String(data.attendanceSummary.leave ?? 0),
        String(data.attendanceSummary.workingDays ?? 22),
      ]],
      theme: 'grid',
      headStyles: { fillColor: BRAND.primary, fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: BRAND.dark },
      margin: { left: margin, right: margin },
    })
    // @ts-ignore
    ctx.cursorY = doc.lastAutoTable.finalY + 8
  }

  // Earnings table
  addSectionTitle(ctx, 'Earnings')
  autoTable(doc, {
    startY: ctx.cursorY,
    head: [['Description', 'Amount (PKR)']],
    body: data.earnings.map((e) => [e.label, e.amount.toLocaleString()]),
    theme: 'striped',
    headStyles: { fillColor: BRAND.success, fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: BRAND.dark },
    margin: { left: margin, right: margin },
  })
  // @ts-ignore
  ctx.cursorY = doc.lastAutoTable.finalY + 6

  // Deductions table
  addSectionTitle(ctx, 'Deductions')
  autoTable(doc, {
    startY: ctx.cursorY,
    head: [['Description', 'Amount (PKR)']],
    body: data.deductions.map((d) => [d.label, d.amount.toLocaleString()]),
    theme: 'striped',
    headStyles: { fillColor: BRAND.danger, fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: BRAND.dark },
    margin: { left: margin, right: margin },
  })
  // @ts-ignore
  ctx.cursorY = doc.lastAutoTable.finalY + 8

  // Net salary highlight box
  doc.setFillColor(...BRAND.primary)
  doc.rect(margin, ctx.cursorY, pageWidth - margin * 2, 12, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text('NET SALARY', margin + 3, ctx.cursorY + 8)
  doc.text(
    `PKR ${data.netSalary.toLocaleString()}`,
    pageWidth - margin - 3,
    ctx.cursorY + 8,
    { align: 'right' }
  )
  ctx.cursorY += 20

  drawSignatureSection(ctx, 'HR Authorized Signatory')
  drawFooter(ctx)

  return ctx.doc
}

export function generateContractPDF(data: {
  referenceNo: string
  employeeName: string
  employeeId: string
  position: string
  department?: string
  startDate: string
  endDate?: string
  salary: number
  workingHours: string
  workLocation?: string
  employmentType: string
  responsibilities?: string
  benefits?: string
  confidentiality?: string
  terminationConditions?: string
}) {
  const ctx = createPdf()
  drawHeader(ctx, 'Employment Contract', data.referenceNo, new Date().toLocaleDateString())

  const { doc, margin, pageWidth } = ctx
  const half = (pageWidth - margin * 2) / 2

  ctx.cursorY = 48
  addInfoBlock(ctx, 'Employee Name', data.employeeName, margin, ctx.cursorY, half - 5)
  addInfoBlock(ctx, 'Employee ID', data.employeeId, margin + half, ctx.cursorY, half - 5)
  ctx.cursorY = 60
  addInfoBlock(ctx, 'Position', data.position, margin, ctx.cursorY, half - 5)
  addInfoBlock(ctx, 'Department', data.department || '—', margin + half, ctx.cursorY, half - 5)
  ctx.cursorY = 72
  addInfoBlock(ctx, 'Contract Start', data.startDate, margin, ctx.cursorY, half - 5)
  addInfoBlock(ctx, 'Contract End', data.endDate || 'Open-ended', margin + half, ctx.cursorY, half - 5)
  ctx.cursorY = 84
  addInfoBlock(ctx, 'Employment Type', data.employmentType, margin, ctx.cursorY, half - 5)
  addInfoBlock(ctx, 'Work Location', data.workLocation || 'On-site', margin + half, ctx.cursorY, half - 5)
  ctx.cursorY = 96
  addInfoBlock(ctx, 'Monthly Salary', `PKR ${data.salary.toLocaleString()}`, margin, ctx.cursorY, half - 5)
  addInfoBlock(ctx, 'Working Hours', data.workingHours, margin + half, ctx.cursorY, half - 5)
  ctx.cursorY = 110

  const sections: { title: string; body?: string }[] = [
    { title: 'Responsibilities', body: data.responsibilities },
    { title: 'Benefits', body: data.benefits },
    { title: 'Confidentiality', body: data.confidentiality },
    { title: 'Termination Conditions', body: data.terminationConditions },
  ]

  for (const s of sections) {
    if (!s.body) continue
    addSectionTitle(ctx, s.title)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...BRAND.dark)
    const lines = doc.splitTextToSize(s.body, pageWidth - margin * 2)
    if (ctx.cursorY + lines.length * 4.5 > 230) {
      doc.addPage()
      ctx.cursorY = 20
    }
    doc.text(lines, margin, ctx.cursorY + 2)
    ctx.cursorY += lines.length * 4.5 + 5
  }

  drawSignatureSection(ctx, 'Authorized by MYNE7X BPO HR')
  drawFooter(ctx)

  return ctx.doc
}

export function generateGenericReportPDF(opts: {
  title: string
  referenceNo: string
  meta?: { label: string; value: string }[]
  summary?: string
  table?: { head: string[]; body: string[][] }
  notes?: string
}) {
  const ctx = createPdf()
  drawHeader(ctx, opts.title, opts.referenceNo, new Date().toLocaleDateString())

  const { doc, margin, pageWidth } = ctx

  if (opts.meta && opts.meta.length) {
    ctx.cursorY = 48
    const half = (pageWidth - margin * 2) / 2
    opts.meta.forEach((m, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const x = margin + col * half
      const y = 48 + row * 14
      addInfoBlock(ctx, m.label, m.value, x, y, half - 5)
    })
    ctx.cursorY = 48 + Math.ceil(opts.meta.length / 2) * 14 + 5
  } else {
    ctx.cursorY = 48
  }

  if (opts.summary) {
    addSectionTitle(ctx, 'Summary')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...BRAND.dark)
    const lines = doc.splitTextToSize(opts.summary, pageWidth - margin * 2)
    doc.text(lines, margin, ctx.cursorY + 2)
    ctx.cursorY += lines.length * 4.5 + 5
  }

  if (opts.table) {
    addSectionTitle(ctx, 'Details')
    autoTable(doc, {
      startY: ctx.cursorY,
      head: [opts.table.head],
      body: opts.table.body,
      theme: 'grid',
      headStyles: { fillColor: BRAND.primary, fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: BRAND.dark },
      margin: { left: margin, right: margin },
    })
    // @ts-ignore
    ctx.cursorY = doc.lastAutoTable.finalY + 8
  }

  if (opts.notes) {
    addSectionTitle(ctx, 'Notes')
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(...BRAND.muted)
    const lines = doc.splitTextToSize(opts.notes, pageWidth - margin * 2)
    doc.text(lines, margin, ctx.cursorY + 2)
    ctx.cursorY += lines.length * 4.5 + 5
  }

  drawSignatureSection(ctx, 'Prepared by MYNE7X BPO')
  drawFooter(ctx)

  return ctx.doc
}

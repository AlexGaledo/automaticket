import { AiQueryResult } from '../types'

const API_BASE = 'https://automation-api-bix0.onrender.com/api/v1'

export async function processAiQuery(message: string, context: string = 'client'): Promise<AiQueryResult> {
  const res = await fetch(`${API_BASE}/ai/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context }),
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export interface BackendTicket {
  id: string
  subject: string
  description: string
  status: string
  priority: string
  client_name: string
  created_at: string
}

export async function createTicket(
  subject: string,
  description: string,
  priority: string = 'Normal',
  status: string = 'In Progress',
): Promise<BackendTicket> {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, description, priority, status }),
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export async function listTickets(): Promise<BackendTicket[]> {
  const res = await fetch(`${API_BASE}/tickets`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export async function updateTicketStatus(id: string, status: string): Promise<BackendTicket> {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export interface KnowledgeResult {
  content: string
  updated_at: string
}

export async function getKnowledge(): Promise<KnowledgeResult> {
  const res = await fetch(`${API_BASE}/knowledge`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export async function updateKnowledge(content: string): Promise<KnowledgeResult> {
  const res = await fetch(`${API_BASE}/knowledge`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export interface NotificationEmailResult {
  email: string
}

export async function getNotificationEmail(): Promise<NotificationEmailResult> {
  const res = await fetch(`${API_BASE}/settings/notification-email`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export async function updateNotificationEmail(email: string): Promise<NotificationEmailResult> {
  const res = await fetch(`${API_BASE}/settings/notification-email`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

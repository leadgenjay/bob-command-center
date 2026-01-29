import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DOCS_FILE = path.join(process.cwd(), 'data', 'documents.json');

interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function getDocuments(): Promise<Document[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(DOCS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveDocuments(docs: Document[]) {
  await ensureDataDir();
  await fs.writeFile(DOCS_FILE, JSON.stringify(docs, null, 2));
}

// GET all documents
export async function GET() {
  const docs = await getDocuments();
  return NextResponse.json(docs);
}

// POST new document
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, content, category = 'Other' } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: 'Title and content are required' },
      { status: 400 }
    );
  }

  const docs = await getDocuments();
  const now = new Date().toISOString();
  
  const newDoc: Document = {
    id: `doc-${Date.now()}`,
    title,
    description: description || '',
    content,
    category,
    createdAt: now,
    updatedAt: now,
  };

  docs.unshift(newDoc);
  await saveDocuments(docs);

  return NextResponse.json(newDoc, { status: 201 });
}

// DELETE document
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const docs = await getDocuments();
  const filtered = docs.filter(d => d.id !== id);
  
  if (filtered.length === docs.length) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  await saveDocuments(filtered);
  return NextResponse.json({ success: true });
}

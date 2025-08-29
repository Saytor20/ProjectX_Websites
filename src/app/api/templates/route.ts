import { NextResponse } from 'next/server';
import { listTemplates } from '../../../../templates/registry';

export async function GET() {
  try {
    const templates = listTemplates();

    // Include both `templates` and `data` keys for compatibility with callers
    return NextResponse.json({
      success: true,
      templates,
      data: templates,
      count: templates.length,
    });
  } catch (error) {
    console.error('Error listing templates:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list templates',
        templates: [],
        data: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}

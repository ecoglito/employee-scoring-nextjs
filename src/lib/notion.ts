// Simple Notion API client without external dependencies
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

export interface NotionProperty {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
}

export interface NotionDatabase {
  id: string;
  title: Array<{ plain_text: string }>;
  properties: Record<string, NotionProperty>;
}

export interface NotionPage {
  id: string;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
}

export class NotionService {
  private token: string;
  private databaseId: string;

  constructor(token: string, databaseId: string) {
    this.token = token;
    this.databaseId = databaseId;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${NOTION_API_BASE}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...options.headers,
        },
        mode: 'cors',
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Notion API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to Notion API from browser due to CORS restrictions. This needs to be done from a server.');
      }
      throw error;
    }
  }

  async getDatabaseSchema(): Promise<NotionDatabase> {
    return await this.makeRequest(`/databases/${this.databaseId}`);
  }

  async queryDatabase(filter?: any, sorts?: any): Promise<{ results: NotionPage[] }> {
    return await this.makeRequest(`/databases/${this.databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        filter,
        sorts,
        page_size: 100,
      }),
    });
  }

  async getAllPages(): Promise<NotionPage[]> {
    const allPages: NotionPage[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const response = await this.makeRequest(`/databases/${this.databaseId}/query`, {
        method: 'POST',
        body: JSON.stringify({
          start_cursor: startCursor,
          page_size: 100,
        }),
      });

      allPages.push(...response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    return allPages;
  }

  // Helper method to extract text from Notion rich text
  static extractText(richText: any[]): string {
    if (!richText || !Array.isArray(richText)) return '';
    return richText.map(text => text.plain_text || '').join('');
  }

  // Helper method to extract value from Notion property
  static extractPropertyValue(property: any, type: string): any {
    if (!property) return null;

    switch (type) {
      case 'title':
        return this.extractText(property.title);
      case 'rich_text':
        return this.extractText(property.rich_text);
      case 'number':
        return property.number;
      case 'select':
        return property.select?.name || null;
      case 'multi_select':
        return property.multi_select?.map((item: any) => item.name) || [];
      case 'date':
        return property.date?.start || null;
      case 'checkbox':
        return property.checkbox;
      case 'url':
        return property.url;
      case 'email':
        return property.email;
      case 'phone_number':
        return property.phone_number;
      case 'relation':
        return property.relation?.map((item: any) => item.id) || [];
      case 'people':
        return property.people?.map((person: any) => ({
          id: person.id,
          name: person.name,
          email: person.person?.email,
        })) || [];
      case 'files':
        return property.files?.map((file: any) => ({
          name: file.name,
          url: file.external?.url || file.file?.url,
        })) || [];
      case 'created_time':
        return property.created_time;
      case 'last_edited_time':
        return property.last_edited_time;
      default:
        return null;
    }
  }
}

// Initialize the service
export const notionService = new NotionService(
  process.env.NOTION_TOKEN || '',
  process.env.NOTION_DATABASE_ID || ''
);

export default NotionService;
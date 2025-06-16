// Airtable Campaign Data Service
// Handles saving personalized campaign data for each organization

import Airtable from 'airtable';

// Configure Airtable
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY
});

// Campaign record interface for Airtable
export interface CampaignRecord {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  subject_line: string;
  email_body: string;
  campaign_id: string;
  campaign_name: string;
  prospect_company: string;
  prospect_title: string;
  prospect_industry?: string;
  prospect_location?: string;
  linkedin_url?: string;
  phone_number?: string;
  company_website?: string;

  // Email status tracking
  email_sent: boolean;
  email_sent_date?: string;
  email_platform?: string;

  // Quality control
  content_approved: boolean;
  notes?: string;

  // Metadata
  created_date: string;
  user_organization: string;
  user_company: string;
  generation_settings?: string; // JSON stringified settings

  // Lead source and scoring
  lead_source?: string;
  lead_score?: number;
}

// Response interfaces
export interface AirtableSaveResponse {
  success: boolean;
  recordId?: string;
  recordIds?: string[];
  error?: string;
  recordsSaved?: number;
}

export interface AirtableQueryResponse {
  success: boolean;
  records?: CampaignRecord[];
  error?: string;
  totalRecords?: number;
}

export class AirtableService {
  private baseId: string;
  private tableName: string = 'Generated_Campaigns';

  constructor() {
    this.baseId = process.env.AIRTABLE_BASE_ID!;

    if (!this.baseId) {
      throw new Error('AIRTABLE_BASE_ID environment variable is required');
    }

    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY environment variable is required');
    }
  }

  private getBase() {
    try {
      return Airtable.base(this.baseId);
    } catch (error) {
      console.error('❌ Failed to connect to Airtable base:', error);
      throw new Error('Failed to connect to Airtable');
    }
  }

  // Save a single campaign record
  async saveCampaignRecord(
    organizationId: string,
    record: CampaignRecord
  ): Promise<AirtableSaveResponse> {
    try {
      const base = this.getBase();

      // Validate required fields
      if (!record.email || !record.first_name || !record.last_name) {
        throw new Error(
          'Missing required fields: email, first_name, last_name'
        );
      }

      const airtableRecord = await base(this.tableName).create([
        {
          fields: {
            ...record,
            user_organization: organizationId,
            created_date: record.created_date || new Date().toISOString()
          }
        }
      ]);

      const recordId = airtableRecord[0].id;

      return {
        success: true,
        recordId,
        recordsSaved: 1
      };
    } catch (error) {
      console.error('❌ Airtable save failed:', error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        recordsSaved: 0
      };
    }
  }

  // Save multiple campaign records in batches
  async saveBulkRecords(
    organizationId: string,
    records: CampaignRecord[]
  ): Promise<AirtableSaveResponse> {
    try {
      // console.log('🔄 Saving bulk campaign records to Airtable...', {
      //   count: records.length,
      //   organization: organizationId
      // });

      if (!records.length) {
        return {
          success: true,
          recordsSaved: 0,
          recordIds: []
        };
      }

      const base = this.getBase();
      const savedRecordIds: string[] = [];

      // Validate records
      for (const record of records) {
        if (!record.email || !record.first_name || !record.last_name) {
          throw new Error(
            `Invalid record: Missing required fields for ${record.email || 'unknown'}`
          );
        }
      }

      // Airtable has a 10 record limit per batch
      const batches = [];
      for (let i = 0; i < records.length; i += 10) {
        batches.push(records.slice(i, i + 10));
      }

      // console.log(`📦 Processing ${batches.length} batches...`);

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];

        try {
          const airtableRecords = await base(this.tableName).create(
            batch.map((record) => ({
              fields: {
                ...record,
                user_organization: organizationId,
                created_date: record.created_date || new Date().toISOString()
              }
            }))
          );

          const batchRecordIds = airtableRecords.map((r) => r.id);
          savedRecordIds.push(...batchRecordIds);

          // console.log(
          //   `✅ Batch ${batchIndex + 1}/${batches.length} saved successfully (${batchRecordIds.length} records)`
          // );

          // Small delay between batches to avoid rate limits
          if (batchIndex < batches.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        } catch (batchError) {
          console.error(`❌ Batch ${batchIndex + 1} failed:`, batchError);
          throw new Error(
            `Failed to save batch ${batchIndex + 1}: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`
          );
        }
      }

      // console.log('✅ All batches saved successfully:', {
      //   totalRecords: savedRecordIds.length,
      //   organization: organizationId
      // });

      return {
        success: true,
        recordIds: savedRecordIds,
        recordsSaved: savedRecordIds.length
      };
    } catch (error) {
      console.error('❌ Bulk Airtable save failed:', error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        recordsSaved: 0,
        recordIds: []
      };
    }
  }

  // Query records by organization (for debugging/admin purposes)
  async getRecordsByOrganization(
    organizationId: string,
    limit: number = 100
  ): Promise<AirtableQueryResponse> {
    try {
      // console.log('🔍 Querying Airtable records...', {
      //   organization: organizationId,
      //   limit
      // });

      const base = this.getBase();

      const records = await base(this.tableName)
        .select({
          filterByFormula: `{user_organization} = '${organizationId}'`,
          maxRecords: limit,
          sort: [{ field: 'created_date', direction: 'desc' }]
        })
        .all();

      const campaignRecords: CampaignRecord[] = records.map(
        (record) =>
          ({
            ...record.fields,
            id: record.id
          }) as unknown as CampaignRecord
      );

      // console.log('✅ Query successful:', {
      //   recordsFound: campaignRecords.length,
      //   organization: organizationId
      // });

      return {
        success: true,
        records: campaignRecords,
        totalRecords: campaignRecords.length
      };
    } catch (error) {
      console.error('❌ Airtable query failed:', error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        records: [],
        totalRecords: 0
      };
    }
  }

  // Test connection to Airtable
  async testConnection(): Promise<AirtableSaveResponse> {
    try {
      // console.log('🧪 Testing Airtable connection...');

      const testRecord: CampaignRecord = {
        email: `test-${Date.now()}@example.com`,
        first_name: 'Test',
        last_name: 'User',
        full_name: 'Test User',
        subject_line: 'Test Subject Line',
        email_body: 'This is a test email body.',
        campaign_id: `test-campaign-${Date.now()}`,
        campaign_name: 'Connection Test Campaign',
        prospect_company: 'Test Company',
        prospect_title: 'Test Title',
        email_sent: false,
        content_approved: false,
        created_date: new Date().toISOString(),
        user_organization: 'test-org',
        user_company: 'Test Organization'
      };

      const result = await this.saveCampaignRecord(
        'test-connection',
        testRecord
      );

      if (result.success) {
        // console.log('✅ Airtable connection test successful!');
      } else {
        // console.log('❌ Airtable connection test failed:', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Airtable connection test error:', error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Connection test failed',
        recordsSaved: 0
      };
    }
  }
}

// Export singleton instance
export const airtableService = new AirtableService();

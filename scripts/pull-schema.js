#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 SUPABASE SCHEMA PULLER');
console.log('========================\n');

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  process.exit(1);
}

// Try different authentication methods
async function pullSchema() {
  console.log('🚀 Attempting to pull schema from Supabase...\n');
  
  // Method 1: Try with service role key if available
  if (supabaseServiceKey) {
    console.log('🔑 Method 1: Using Service Role Key');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    try {
      await introspectWithSupabase(supabase, 'Service Role');
      return;
    } catch (error) {
      console.log('❌ Service role method failed:', error.message);
    }
  }
  
  // Method 2: Try with anon key
  if (supabaseAnonKey) {
    console.log('\n🔑 Method 2: Using Anonymous Key');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    try {
      await introspectWithSupabase(supabase, 'Anonymous');
      return;
    } catch (error) {
      console.log('❌ Anonymous key method failed:', error.message);
    }
  }
  
  // Method 3: CLI-based approach
  console.log('\n🔑 Method 3: Using Supabase CLI');
  await suggestCLIMethods();
}

async function introspectWithSupabase(supabase, method) {
  console.log(`📋 Introspecting database using ${method} key...`);
  
  const tables = [];
  const schema = {
    tables: {},
    relationships: [],
    policies: [],
    functions: []
  };
  
  // Get table information from information_schema
  try {
    const { data: tableInfo, error } = await supabase
      .rpc('get_schema_info')
      .select('*');
      
    if (error && error.code === '42883') {
      // Function doesn't exist, try manual approach
      console.log('📊 Using manual table discovery...');
      await discoverTablesManually(supabase, schema);
    } else if (error) {
      throw error;
    } else {
      console.log('✅ Retrieved schema via RPC');
      schema.tables = tableInfo;
    }
  } catch (error) {
    console.log('📊 Falling back to manual table discovery...');
    await discoverTablesManually(supabase, schema);
  }
  
  // Save schema to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `schema-${timestamp}.json`;
  const filepath = path.join('scripts', filename);
  
  fs.writeFileSync(filepath, JSON.stringify(schema, null, 2));
  console.log(`✅ Schema saved to: ${filepath}`);
  
  // Also create a readable markdown version
  const mdFilename = `schema-${timestamp}.md`;
  const mdFilepath = path.join('scripts', mdFilename);
  createMarkdownSchema(schema, mdFilepath);
  console.log(`📝 Readable schema saved to: ${mdFilepath}`);
}

async function discoverTablesManually(supabase, schema) {
  // Known tables from your migrations
  const knownTables = ['credits', 'images', 'models', 'samples', 'instances'];
  
  for (const tableName of knownTables) {
    console.log(`🔍 Checking table: ${tableName}`);
    
    try {
      // Get sample data to understand structure
      const { data: sample, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.log(`  ❌ ${tableName}: ${sampleError.message}`);
        continue;
      }
      
      // Get count
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      schema.tables[tableName] = {
        exists: true,
        rowCount: count || 0,
        columns: sample && sample.length > 0 ? Object.keys(sample[0]) : [],
        sampleData: sample && sample.length > 0 ? sample[0] : null
      };
      
      console.log(`  ✅ ${tableName}: ${count || 0} rows, ${schema.tables[tableName].columns.length} columns`);
      
    } catch (error) {
      console.log(`  ❌ ${tableName}: ${error.message}`);
      schema.tables[tableName] = {
        exists: false,
        error: error.message
      };
    }
  }
}

function createMarkdownSchema(schema, filepath) {
  let markdown = '# Database Schema\n\n';
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;
  
  markdown += '## Tables\n\n';
  
  for (const [tableName, tableInfo] of Object.entries(schema.tables)) {
    if (!tableInfo.exists) continue;
    
    markdown += `### ${tableName}\n\n`;
    markdown += `- **Row Count**: ${tableInfo.rowCount}\n`;
    markdown += `- **Columns**: ${tableInfo.columns.length}\n\n`;
    
    if (tableInfo.columns.length > 0) {
      markdown += '#### Columns:\n';
      tableInfo.columns.forEach(col => {
        markdown += `- \`${col}\`\n`;
      });
      markdown += '\n';
    }
    
    if (tableInfo.sampleData) {
      markdown += '#### Sample Data:\n```json\n';
      markdown += JSON.stringify(tableInfo.sampleData, null, 2);
      markdown += '\n```\n\n';
    }
  }
  
  fs.writeFileSync(filepath, markdown);
}

async function suggestCLIMethods() {
  console.log('💡 CLI-based schema pulling methods:\n');
  
  console.log('1️⃣  **Dump Schema Only:**');
  console.log('   npx supabase db dump --schema-only --local > schema.sql');
  console.log('   npx supabase db dump --schema-only --linked > schema.sql\n');
  
  console.log('2️⃣  **Generate TypeScript Types:**');
  console.log('   npx supabase gen types typescript --local > types/supabase.ts');
  console.log('   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts\n');
  
  console.log('3️⃣  **Dump Full Database:**');
  console.log('   npx supabase db dump --local > full-dump.sql');
  console.log('   npx supabase db dump --linked > full-dump.sql\n');
  
  console.log('4️⃣  **Pull Remote Schema to Local:**');
  console.log('   npx supabase db pull');
  console.log('   npx supabase db diff --linked');
}

// Run the schema puller
pullSchema().catch(console.error); 
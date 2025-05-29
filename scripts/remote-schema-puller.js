#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🚀 REMOTE SUPABASE SCHEMA PULLER (NO DOCKER)');
console.log('=============================================\n');

// You can set these directly or use env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hzcgbsakzagvgfuektjb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_key_here';

async function pullRemoteSchema() {
  console.log('🔗 Connecting to remote Supabase...');
  console.log(`📍 URL: ${supabaseUrl}\n`);
  
  // Try service role first, then anon key
  const keys = [
    { key: supabaseServiceKey, type: 'Service Role' },
    { key: supabaseAnonKey, type: 'Anonymous' }
  ];
  
  for (const { key, type } of keys) {
    if (!key || key === 'your_anon_key_here' || key === 'your_service_key_here') {
      console.log(`⏭️  Skipping ${type} (not configured)`);
      continue;
    }
    
    console.log(`🔑 Trying ${type} key...`);
    
    try {
      const supabase = createClient(supabaseUrl, key);
      const schema = await introspectRemoteDB(supabase, type);
      
      if (schema && Object.keys(schema.tables).length > 0) {
        await saveSchema(schema, type);
        return;
      }
    } catch (error) {
      console.log(`❌ ${type} failed: ${error.message}`);
    }
  }
  
  console.log('\n❌ All authentication methods failed');
  console.log('💡 You need to set your Supabase keys in environment variables:');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   SUPABASE_SERVICE_ROLE_KEY');
  console.log('\n🔧 Or edit this script directly with your keys');
}

async function introspectRemoteDB(supabase, authType) {
  console.log(`📊 Introspecting database with ${authType} access...`);
  
  const schema = {
    url: supabaseUrl,
    authType: authType,
    timestamp: new Date().toISOString(),
    tables: {},
    views: {},
    functions: {}
  };
  
  // Known tables from your migrations
  const knownTables = ['credits', 'images', 'models', 'samples', 'instances'];
  
  // Test each table
  for (const tableName of knownTables) {
    try {
      console.log(`  🔍 Testing table: ${tableName}`);
      
      // Try to get a sample record
      const { data: sample, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.log(`    ❌ ${sampleError.message}`);
        schema.tables[tableName] = {
          accessible: false,
          error: sampleError.message
        };
        continue;
      }
      
      // Get record count
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      // Get columns from sample data
      const columns = sample && sample.length > 0 ? 
        Object.keys(sample[0]).map(col => ({
          name: col,
          type: typeof sample[0][col],
          nullable: sample[0][col] === null
        })) : [];
      
      schema.tables[tableName] = {
        accessible: true,
        rowCount: count || 0,
        columns: columns,
        sampleRecord: sample && sample.length > 0 ? sample[0] : null
      };
      
      console.log(`    ✅ ${count || 0} rows, ${columns.length} columns`);
      
    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
      schema.tables[tableName] = {
        accessible: false,
        error: error.message
      };
    }
  }
  
  // Try to get some meta information
  try {
    console.log('\n  🔍 Testing auth access...');
    const { data: user } = await supabase.auth.getUser();
    schema.authInfo = user ? 'Authenticated user' : 'Anonymous access';
  } catch (error) {
    schema.authInfo = 'Anonymous access';
  }
  
  return schema;
}

async function saveSchema(schema, authType) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Save JSON
  const jsonFile = `scripts/remote-schema-${timestamp}.json`;
  fs.writeFileSync(jsonFile, JSON.stringify(schema, null, 2));
  console.log(`\n✅ Schema saved to: ${jsonFile}`);
  
  // Save readable Markdown
  const mdFile = `scripts/remote-schema-${timestamp}.md`;
  const markdown = generateMarkdown(schema);
  fs.writeFileSync(mdFile, markdown);
  console.log(`📝 Readable version: ${mdFile}`);
  
  // Generate SQL DDL approximation
  const sqlFile = `scripts/remote-schema-${timestamp}.sql`;
  const sql = generateSQLFromSchema(schema);
  fs.writeFileSync(sqlFile, sql);
  console.log(`🗃️  SQL version: ${sqlFile}`);
  
  console.log('\n🎉 Remote schema successfully pulled!');
}

function generateMarkdown(schema) {
  let md = `# Remote Supabase Schema\n\n`;
  md += `**URL:** ${schema.url}\n`;
  md += `**Auth Type:** ${schema.authType}\n`;
  md += `**Generated:** ${schema.timestamp}\n\n`;
  
  md += `## Tables\n\n`;
  
  for (const [tableName, tableInfo] of Object.entries(schema.tables)) {
    md += `### ${tableName}\n\n`;
    
    if (!tableInfo.accessible) {
      md += `❌ **Not accessible:** ${tableInfo.error}\n\n`;
      continue;
    }
    
    md += `- **Rows:** ${tableInfo.rowCount}\n`;
    md += `- **Columns:** ${tableInfo.columns.length}\n\n`;
    
    if (tableInfo.columns.length > 0) {
      md += `#### Columns:\n`;
      md += `| Column | Type | Nullable |\n`;
      md += `|--------|------|----------|\n`;
      tableInfo.columns.forEach(col => {
        md += `| \`${col.name}\` | ${col.type} | ${col.nullable ? '✓' : '✗'} |\n`;
      });
      md += `\n`;
    }
    
    if (tableInfo.sampleRecord) {
      md += `#### Sample Record:\n`;
      md += `\`\`\`json\n${JSON.stringify(tableInfo.sampleRecord, null, 2)}\n\`\`\`\n\n`;
    }
  }
  
  return md;
}

function generateSQLFromSchema(schema) {
  let sql = `-- Remote Supabase Schema\n`;
  sql += `-- Generated: ${schema.timestamp}\n`;
  sql += `-- Auth: ${schema.authType}\n\n`;
  
  for (const [tableName, tableInfo] of Object.entries(schema.tables)) {
    if (!tableInfo.accessible) continue;
    
    sql += `-- Table: ${tableName}\n`;
    sql += `-- Rows: ${tableInfo.rowCount}\n`;
    
    if (tableInfo.columns.length > 0) {
      sql += `CREATE TABLE ${tableName} (\n`;
      tableInfo.columns.forEach((col, index) => {
        const type = col.type === 'string' ? 'TEXT' : 
                    col.type === 'number' ? 'NUMERIC' : 
                    col.type === 'boolean' ? 'BOOLEAN' : 
                    'TEXT';
        const nullable = col.nullable ? '' : ' NOT NULL';
        const comma = index < tableInfo.columns.length - 1 ? ',' : '';
        sql += `  ${col.name} ${type}${nullable}${comma}\n`;
      });
      sql += `);\n\n`;
    }
  }
  
  return sql;
}

// Run it
pullRemoteSchema().catch(console.error); 
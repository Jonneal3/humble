const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCompleteSchema() {
  console.log('🔍 PULLING COMPLETE DATABASE SCHEMA FROM REMOTE...\n');

  // Test these potential tables
  const potentialTables = ['instances', 'credits', 'images', 'models', 'samples'];
  const existingTables = [];
  
  for (const tableName of potentialTables) {
    console.log(`\n📋 TABLE: ${tableName.toUpperCase()}`);
    console.log('=' + '='.repeat(50));
    
    try {
      // Get sample record to understand structure
      const { data: sample, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (sampleError) {
        console.log(`❌ Table does not exist: ${sampleError.message}`);
        continue;
      }

      // If we get here, table exists
      existingTables.push(tableName);

      if (sample && sample.length > 0) {
        console.log('✅ Table exists with data and columns:');
        const record = sample[0];
        
        Object.entries(record).forEach(([key, value]) => {
          const type = typeof value;
          const displayValue = value === null ? 'null' : 
                              type === 'object' ? 'object/json' :
                              type === 'string' && value.length > 50 ? `string(${value.length} chars)` :
                              JSON.stringify(value);
          
          console.log(`  📌 ${key.padEnd(15)} : ${type.padEnd(8)} = ${displayValue}`);
        });

        // Get total count
        const { count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        console.log(`📊 Total records: ${count}`);
        
      } else {
        console.log('✅ Table exists but is empty');
      }

    } catch (err) {
      console.log(`❌ Error with ${tableName}:`, err.message);
    }
  }

  // Test some specific queries to understand relationships
  console.log('\n\n🔗 TESTING RELATIONSHIPS & CONSTRAINTS');
  console.log('=' + '='.repeat(50));

  try {
    // Test instances relationship
    const { data: instanceWithUser, error: instError } = await supabase
      .from('instances')
      .select(`
        id,
        name,
        user_id,
        created_at
      `)
      .limit(1);

    if (!instError && instanceWithUser && instanceWithUser.length > 0) {
      console.log('✅ Instances table structure confirmed');
      console.log('Sample instance:', instanceWithUser[0]);
    }

  } catch (err) {
    console.log('❌ Relationship test error:', err.message);
  }

  console.log('\n\n📝 ACTUAL DATABASE SCHEMA');
  console.log('=' + '='.repeat(40));
  console.log('🎯 TABLES THAT ACTUALLY EXIST:');
  for (const table of existingTables) {
    console.log(`  ✅ ${table}`);
  }
  
  const missingTables = potentialTables.filter(t => !existingTables.includes(t));
  if (missingTables.length > 0) {
    console.log('\n❌ TABLES THAT DO NOT EXIST:');
    for (const table of missingTables) {
      console.log(`  ❌ ${table}`);
    }
  }
}

getCompleteSchema().catch(console.error); 
rm GenerateDefaults.cjs & tsc GenerateDefaults.ts --lib ES2021;  
mv GenerateDefaults.js GenerateDefaults.cjs; 
node GenerateDefaults.cjs
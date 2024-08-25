rm GenerateDefaults.cjs & tsc GenerateDefaults.ts --lib ES2021; # Remove previously generated code, and compile new code
mv GenerateDefaults.js GenerateDefaults.cjs;                    # Change the extension, such that it can be run locally by node
node GenerateDefaults.cjs                                       # Run the script
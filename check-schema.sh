#!/bin/bash

# Store initial migration files
initial_files=$(ls drizzle/*.sql 2>/dev/null | sort)

# Run schema generation
npm run db:generate

# Get new migration files
new_files=$(ls drizzle/*.sql 2>/dev/null | sort)

# Compare files
if [ "$initial_files" != "$new_files" ]; then
    echo "❌ Error: Schema changes detected!"
    echo "New migration files were generated. Please review and commit these changes:"
    diff <(echo "$initial_files") <(echo "$new_files")
    exit 1
else
    echo "✅ Schema is up to date!"
    exit 0
fi
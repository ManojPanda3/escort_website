#!/usr/bin/bash
if [[ -z "$PROJECTID" ]]; then
  echo "Error: PROJECTID environment variable not set or empty."
  exit 1 # Exit with an error code
else
  echo "Generating Supabase Typescript definitions for project ID: $PROJECTID"
  supabase gen types typescript --project-id "$PROJECTID" --schema public >lib/database.types.ts
  echo "Supabase types generated successfully in lib/database.types.ts"
fi

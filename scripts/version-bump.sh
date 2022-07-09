#! /bin/bash
bump_type=$1

# Handle no bump type
if [ -z "$bump_type" ] | [ -z "$NPM_TOKEN" ]
then 
  exit 0
fi

npm set //registry.npmjs.org/:_authToken $NPM_TOKEN

# increase version
new_version=$(npm version $bump_type)

# push tag to remote
git push origin $new_version
git push origin main

# publish to npm
npm publish --access public
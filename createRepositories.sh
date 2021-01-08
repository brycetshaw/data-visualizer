for r in $(grep  'image: \${REPOSITORY_URI}' docker-compose.yml | sed -e 's/^.*\///')
 do
   echo create repo "$r"
   aws ecr create-repository --repository-name "$r"
 done
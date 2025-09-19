export REGION=eu-north-1
export CLUSTER=apps-cluster
export SERVICE=in-store-nav-service-53nloe11
export CONTAINER=in-store-nav
export IMAGE_URI="666203386231.dkr.ecr.eu-north-1.amazonaws.com/in-store-nav:main-e57322f"

# Dohvati trenutni TD u file
TD_ARN=$(aws ecs describe-services --cluster "$CLUSTER" --services "$SERVICE" \
  --region "$REGION" --query 'services[0].taskDefinition' --output text)

aws ecs describe-task-definition --task-definition "$TD_ARN" --region "$REGION" > td.json

# Napravi novi TD:
# - zamijeni image
# - postavi portMappings na 80
# - ukloni env var PORT ako postoji
jq --arg IMG "$IMAGE_URI" --arg NAME "$CONTAINER" '
  .taskDefinition
  | .containerDefinitions = (.containerDefinitions
      | map(if .name==$NAME then
              .image = $IMG
              | .portMappings = [ {containerPort:80, hostPort:80, protocol:"tcp", appProtocol:"http"} ]
              | .environment = ( (.environment // []) | map(select(.name != "PORT")) )
            else . end))
  | {family,executionRoleArn,taskRoleArn,networkMode,containerDefinitions,
     requiresCompatibilities,cpu,memory,volumes,placementConstraints,runtimePlatform}
' td.json > td-new.json

NEW_TD_ARN=$(aws ecs register-task-definition \
  --cli-input-json file://td-new.json \
  --region "$REGION" \
  --query 'taskDefinition.taskDefinitionArn' --output text)

# Update service na novi TD i pokreni rollout
aws ecs update-service \
  --cluster "$CLUSTER" --service "$SERVICE" \
  --task-definition "$NEW_TD_ARN" \
  --force-new-deployment \
  --region "$REGION"

# Pričekaj stabilizaciju
aws ecs wait services-stable --cluster "$CLUSTER" --services "$SERVICE" --region "$REGION"

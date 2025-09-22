# Uslugar CI/CD (GitHub Actions → ECR/ECS Fargate) 

## 1) Preduvjeti na AWS-u
- ECR repo: `uslugar-backend`
- ECS cluster (Fargate): `project-cluster`
- ECS service: `uslugar-backend-svc` (ALB target group na port 4000)
- Task execution role ARN (secrets.ECS_TASK_EXEC_ROLE_ARN)
- Task role ARN (secrets.ECS_TASK_ROLE_ARN)
- ALB + TargetGroup + SecurityGroup + Subneti (awsvpc)
- CloudWatch log group: `/ecs/uslugar-backend`

## 2) GitHub OIDC role
- Kreiraj IAM rolu s trust policy za GitHub OIDC i dodijeli minimalne politike (ECR push, ECS update service, CloudWatch logs).
- Spremi ARN u GitHub Secrets: `AWS_OIDC_ROLE_ARN`

## 3) GitHub Secrets
U repo postavi:
- `AWS_OIDC_ROLE_ARN` – IAM role za OIDC
- `ECS_TASK_EXEC_ROLE_ARN` – task execution role
- `ECS_TASK_ROLE_ARN` – task role
- `DATABASE_URL` – connection string za Postgres (Neon/RDS)

(Po potrebi promijeni varijable na vrhu workflowa: `AWS_REGION`, `ECR_REPO_BACKEND`, `ECS_CLUSTER`, `ECS_SERVICE`.)

## 4) Deploy
- Commit/push u `main` s promjenama u `backend/` triggera workflow.
- GitHub Actions:
  1. builda `backend/Dockerfile.prod`
  2. push-a image u ECR
  3. renderira task def s IMAGE_URI i env varijablama
  4. pozove ECS service update (rolling deploy)

## 5) Frontend varijante
- **Opcija A (S3+CloudFront)**: build lokalno u workflowu i upload u S3.
- **Opcija B (ECS container)**: koristi `frontend/Dockerfile.prod` i ALB na :5173.
  (Preporuka A zbog performansi i cijene.)

## 6) Korisni AWS CLI primjeri
```bash
aws ecr create-repository --repository-name uslugar-backend --region eu-north-1

aws logs create-log-group --log-group-name /ecs/uslugar-backend --region eu-north-1 || true
```
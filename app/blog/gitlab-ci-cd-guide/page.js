export const metadata = {
  title: 'GitLab CI/CD Pipeline Guide 2026 — From Zero to Production',
  description: 'Build production-ready .gitlab-ci.yml pipelines: lint, test, build, deploy. Node.js, Python, Go, Docker, Kubernetes examples.',
  alternates: { canonical: '/blog/gitlab-ci-cd-guide/' },
  keywords: ['gitlab ci cd guide', 'gitlab-ci.yml tutorial', 'gitlab pipeline setup', 'gitlab ci docker build', 'gitlab ci kubernetes deploy', 'gitlab ci node.js', 'gitlab ci python', 'gitlab ci cache'],
};
import Link from 'next/link';

export default function GitlabCIGuide() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/blog/" className="text-xs text-dark-500 hover:text-dark-300 no-underline">&larr; Blog</Link>
      </div>
      <h1 className="text-2xl font-bold text-dark-50 mb-2">GitLab CI/CD Pipeline Guide 2026</h1>
      <p className="text-sm text-dark-500 mb-8">Build, test, and deploy with .gitlab-ci.yml — from zero to production pipeline</p>

      <article className="text-sm text-dark-300 leading-relaxed space-y-4">
        <p>GitLab CI/CD runs pipelines directly from your repository with zero external setup. Create a <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">.gitlab-ci.yml</code> file in your repo root, push, and GitLab runs it automatically. This guide covers the essential patterns you need for production pipelines.</p>

        <p>Want to generate a pipeline config instantly? Use our <Link href="/gitlab-ci-generator/" className="text-brand-400 hover:underline">GitLab CI/CD Generator</Link> — select your language, configure stages, and download a ready-to-use .gitlab-ci.yml.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">1. Pipeline Structure</h2>
        <p>A typical pipeline has 4 stages that run sequentially. Jobs within the same stage run in parallel:</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`stages:
  - lint
  - test
  - build
  - deploy`}</pre>
        </div>
        <p>If any job in a stage fails, the pipeline stops and subsequent stages don&apos;t run. This prevents deploying broken code.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">2. Node.js Pipeline Example</h2>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`image: node:20-alpine

stages:
  - lint
  - test
  - build
  - deploy

cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

lint:
  stage: lint
  script:
    - npm ci
    - npm run lint
  allow_failure: true

test:
  stage: test
  script:
    - npm ci
    - npm run test -- --coverage
  coverage: '/All files.*?\\|\\s*([\\d.]+)/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  only:
    - main

deploy:
  stage: deploy
  script:
    - echo "Deploying to production..."
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main`}</pre>
        </div>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">3. Python Pipeline Example</h2>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`image: python:3.12-slim

stages:
  - lint
  - test
  - build

cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - .cache/pip/

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

lint:
  stage: lint
  script:
    - pip install ruff
    - ruff check .

test:
  stage: test
  services:
    - postgres:16-alpine
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: runner
    POSTGRES_PASSWORD: password
    DATABASE_URL: "postgresql://runner:password@postgres/test_db"
  script:
    - pip install -r requirements.txt
    - pytest --cov --junitxml=report.xml
  artifacts:
    reports:
      junit: report.xml`}</pre>
        </div>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">4. Docker Build & Push</h2>
        <p>Building and pushing Docker images is one of the most common CI/CD tasks:</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`build-docker:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker build -t $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main`}</pre>
        </div>
        <p>GitLab provides a built-in container registry (<code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">$CI_REGISTRY</code>), so you don&apos;t need Docker Hub. The <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">$CI_COMMIT_SHORT_SHA</code> tag ensures each build produces a unique, traceable image.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">5. Kubernetes Deployment</h2>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`deploy-k8s:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/myapp
        myapp=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
        --namespace=production
    - kubectl rollout status deployment/myapp
        --namespace=production --timeout=300s
  environment:
    name: production
  when: manual
  only:
    - main`}</pre>
        </div>
        <p>The <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">rollout status</code> command waits for the deployment to complete and fails the pipeline if it doesn&apos;t finish within 5 minutes — catching stuck deployments automatically.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">6. Caching Strategy</h2>
        <p>Proper caching cuts pipeline times by 50-80%. Key rules:</p>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`cache:
  key:
    files:
      - package-lock.json  # Cache invalidates when deps change
  paths:
    - node_modules/
  policy: pull-push  # Default: download cache, upload after job`}</pre>
        </div>
        <p>Use <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">key: files</code> to bust cache only when your lockfile changes. For jobs that only read cache (like deploy), use <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">policy: pull</code> to skip the upload step.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">7. Staging → Production Pipeline</h2>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 font-mono text-xs my-3 overflow-x-auto">
          <pre className="whitespace-pre">{`deploy-staging:
  stage: deploy
  script:
    - ./deploy.sh staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - main

deploy-production:
  stage: deploy
  script:
    - ./deploy.sh production
  environment:
    name: production
    url: https://example.com
  when: manual  # Requires click to deploy
  needs:
    - deploy-staging  # Only after staging succeeds
  only:
    - main`}</pre>
        </div>
        <p><code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">when: manual</code> adds a play button in the GitLab UI — production deploys require explicit human approval. <code className="bg-dark-800 px-1.5 py-0.5 rounded text-dark-200">needs: [deploy-staging]</code> ensures you can&apos;t deploy to production without a successful staging deploy first.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">8. Essential CI/CD Variables</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse my-3">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-2 pr-3 text-dark-400 font-semibold">Variable</th>
                <th className="text-left py-2 px-3 text-dark-400 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody className="font-mono text-dark-300">
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">$CI_COMMIT_SHA</td><td className="px-3">Full commit hash</td></tr>
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">$CI_COMMIT_SHORT_SHA</td><td className="px-3">First 8 chars of commit hash</td></tr>
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">$CI_COMMIT_REF_SLUG</td><td className="px-3">Branch name (URL-safe)</td></tr>
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">$CI_REGISTRY</td><td className="px-3">GitLab container registry URL</td></tr>
              <tr className="border-b border-dark-800"><td className="py-1.5 pr-3">$CI_REGISTRY_IMAGE</td><td className="px-3">Full image path for this project</td></tr>
              <tr><td className="py-1.5 pr-3">$CI_ENVIRONMENT_URL</td><td className="px-3">URL of the deployment environment</td></tr>
            </tbody>
          </table>
        </div>
        <p>Store secrets (API keys, SSH keys, tokens) in <strong className="text-dark-100">Settings → CI/CD → Variables</strong> with the &quot;Masked&quot; flag enabled. Never hardcode secrets in .gitlab-ci.yml.</p>

        <h2 className="text-lg font-bold text-dark-100 mt-8 mb-3">Generate Your Pipeline</h2>
        <p>Instead of writing YAML from scratch, use our <Link href="/gitlab-ci-generator/" className="text-brand-400 hover:underline font-semibold">GitLab CI/CD Generator</Link>. Pick your language (Node.js, Python, Go, Java, Rust, PHP, Ruby, .NET), configure test services (PostgreSQL, Redis, MySQL), choose a deployment target (Docker, Kubernetes, SSH, AWS), and download a complete .gitlab-ci.yml ready for production.</p>
      </article>
    </div>
  );
}

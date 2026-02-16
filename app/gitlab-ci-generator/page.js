export const metadata = {
  title: 'GitLab CI/CD Generator — Build .gitlab-ci.yml Online',
  description: 'Free GitLab CI/CD pipeline generator. Build .gitlab-ci.yml for Node.js, Python, Go, Java, Docker. Add lint, test, build, deploy stages. No signup.',
  alternates: { canonical: '/gitlab-ci-generator/' },
  keywords: ['gitlab ci generator', 'gitlab-ci.yml builder', 'gitlab pipeline generator', 'gitlab ci/cd template', 'gitlab ci yaml', 'devops pipeline builder'],
};
import Client from './client';
export default function Page() { return <Client />; }

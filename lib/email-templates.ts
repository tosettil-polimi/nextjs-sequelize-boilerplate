import fs from 'fs';
import path from 'path';

type TemplateVariables = Record<string, string | number>;

/**
 * Load and render an email template with variable substitution
 */
export function renderTemplate(
  templateName: string,
  variables: TemplateVariables
): { html: string; text: string } {
  const templatesDir = path.join(process.cwd(), 'templates', 'email');

  const htmlPath = path.join(templatesDir, `${templateName}.html`);
  const textPath = path.join(templatesDir, `${templateName}.txt`);

  let html = fs.readFileSync(htmlPath, 'utf-8');
  let text = fs.readFileSync(textPath, 'utf-8');

  // Replace all {{variable}} placeholders
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(placeholder, String(value));
    text = text.replace(placeholder, String(value));
  }

  return { html, text };
}

/**
 * Get common template variables
 * Configure APP_NAME in your environment variables
 */
export function getCommonVariables(): TemplateVariables {
  return {
    year: new Date().getFullYear(),
    appName: process.env.APP_NAME || 'MyApp',
  };
}

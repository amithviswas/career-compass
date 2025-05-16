import type { RewriteResumeOutput, WorkExperience, Education } from '@/ai/flows/resume-rewriter-flow';

function escapeHtml(unsafe: string | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatTextToHtml(text: string | undefined | null): string {
  if (!text) return '';
  return escapeHtml(text).replace(/\n\s*[-*]\s*/g, '<br>• ').replace(/\n/g, '<br>');
}

function formatBulletList(text: string | undefined | null, listStyle: string = 'disc'): string {
  if (!text) return '';
  const items = text.split('\n')
    .map(line => line.trim().replace(/^[-*]\s*/, ''))
    .filter(line => line.length > 0);
  if (items.length === 0) return '';
  return `<ul style="list-style-type: ${listStyle}; margin: 0; padding-left: 20px;">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

export function generateResumeHtml(resume: RewriteResumeOutput): string {
  const styles = `
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #fff; }
    .container { max-width: 800px; margin: 20px auto; padding: 30px; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0,0,0,0.05); background-color: #fff;}
    h1, h2, h3, h4 { margin-top: 0; color: #2c3e50; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 5px; }
    .contact-info { text-align: center; margin-bottom: 20px; font-size: 14px; color: #555; }
    .contact-info a { color: #3498db; text-decoration: none; }
    .contact-info a:hover { text-decoration: underline; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 20px; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-bottom: 15px; color: #3498db; }
    .job, .education-entry { margin-bottom: 15px; }
    .job-title, .degree { font-weight: bold; font-size: 16px; color: #333; }
    .company, .institution { font-style: italic; font-size: 15px; color: #555; }
    .dates { float: right; font-size: 14px; color: #777; }
    .responsibilities, .education-details, .skills-list, .certifications-list { margin-top: 5px; font-size: 14px; padding-left: 0; }
    ul { list-style-type: disc; margin: 5px 0 5px 20px; padding-left: 0px; }
    li { margin-bottom: 5px; }
    p { margin: 0 0 10px 0; }
    .clearfix::after { content: ""; clear: both; display: table; }
    @media print {
      body { margin: 0; background-color: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
      .container { border: none; box-shadow: none; margin: 0; padding: 20px; max-width: 100%; }
      .dates { color: #555 !important; } /* Ensure dates are visible when printing */
    }
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(resume.fullName) || 'Resume'}</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        ${resume.fullName ? `<h1>${escapeHtml(resume.fullName)}</h1>` : ''}
        ${resume.contactInfo ? `<div class="contact-info">${formatTextToHtml(resume.contactInfo)}</div>` : ''}

        ${resume.summary ? `
          <div class="section">
            <h2 class="section-title">Summary</h2>
            <p>${formatTextToHtml(resume.summary)}</p>
          </div>
        ` : ''}

        ${resume.skills ? `
          <div class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-list">${formatBulletList(resume.skills)}</div>
          </div>
        ` : ''}

        ${resume.workExperience && resume.workExperience.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Work Experience</h2>
            ${resume.workExperience.map(exp => `
              <div class="job clearfix">
                <span class="dates">${escapeHtml(exp.dates)}</span>
                <div class="job-title">${escapeHtml(exp.role)}</div>
                <div class="company">${escapeHtml(exp.company)}</div>
                ${exp.responsibilities ? `<div class="responsibilities">${formatBulletList(exp.responsibilities)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resume.education && resume.education.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Education</h2>
            ${resume.education.map(edu => `
              <div class="education-entry clearfix">
                <span class="dates">${escapeHtml(edu.dates)}</span>
                <div class="degree">${escapeHtml(edu.degree)}</div>
                <div class="institution">${escapeHtml(edu.institution)}</div>
                ${edu.details ? `<div class="education-details">${formatBulletList(edu.details)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resume.certifications ? `
          <div class="section">
            <h2 class="section-title">Certifications</h2>
            <div class="certifications-list">${formatBulletList(resume.certifications)}</div>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

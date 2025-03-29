import { describe, it, expect } from '@jest/globals';
import { emailTemplates } from '@/config/email-templates';

describe('Email Templates', () => {
  const requiredTemplates = ['welcome', 'verifyEmail', 'resetPassword', 'magicLink'] as const;

  it('should have all required templates', () => {
    requiredTemplates.forEach(template => {
      expect(emailTemplates[template]).toBeDefined();
      expect(emailTemplates[template].subject).toBeDefined();
      expect(emailTemplates[template].html).toBeDefined();
    });
  });

  it('should have correct template structures', () => {
    const template = emailTemplates.welcome;
    expect(typeof template.subject).toBe('string');
    expect(typeof template.html).toBe('string');
  });
});

export const emailTemplates = {
  // Welcome email template
  welcome: {
    subject: 'Welcome to AI Career Platform',
    html: `
      <h1>Welcome to AI Career Platform</h1>
      <p>Thank you for joining our platform! We're excited to help you with your career journey.</p>
      <p>Get started by:</p>
      <ul>
        <li>Uploading your resume</li>
        <li>Searching for jobs</li>
        <li>Preparing for interviews</li>
      </ul>
    `,
  },

  // Email verification template
  verifyEmail: {
    subject: 'Verify your email address',
    html: `
      <h1>Verify your email address</h1>
      <p>Please click the button below to verify your email address:</p>
      <a href="{{url}}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a>
      <p>If you didn't request this verification, you can safely ignore this email.</p>
    `,
  },

  // Password reset template
  resetPassword: {
    subject: 'Reset your password',
    html: `
      <h1>Reset your password</h1>
      <p>Click the button below to reset your password:</p>
      <a href="{{url}}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
  },

  // Magic link template
  magicLink: {
    subject: 'Sign in to AI Career Platform',
    html: `
      <h1>Sign in to AI Career Platform</h1>
      <p>Click the button below to sign in:</p>
      <a href="{{url}}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
        Sign In
      </a>
      <p>If you didn't request to sign in, you can safely ignore this email.</p>
    `,
  },
};

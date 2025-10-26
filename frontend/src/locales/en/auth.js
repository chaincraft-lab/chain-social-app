export default {
  login: {
    title: 'Login',
    email: 'Email',
    password: 'Password',
    submit: 'Login',
    forgotPassword: 'Forgot password?'
  },
  register: {
    title: 'Register',
    fullName: 'Full Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    submit: 'Register',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    passwordHelp: 'Password must be at least 6 characters with one lowercase, one uppercase and one number/special character',
    acceptTerms: 'I accept the <a href="/terms" target="_blank" class="text-indigo-400 hover:text-indigo-300">Terms of Service</a> and <a href="/privacy" target="_blank" class="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>'
  },
  forgotPassword: {
    title: 'Forgot Password',
    email: 'Email',
    submit: 'Send Password Reset',
    description: 'Enter your email address and we\'ll send you a password reset link.',
    backToLogin: '← Back to login'
  },
  social: {
    loginWith: '{action} with {provider}',
    loginAction: 'Login',
    registerAction: 'Register',
    or: 'or'
  },
  header: {
    title: 'ArbitrumSocial',
    subtitle: 'Blockchain news dedicated to Arbitrum ecosystem'
  },
  validation: {
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    passwordRequirements: 'Password must contain {requirements}',
    confirmPasswordRequired: 'Password confirmation is required',
    confirmPasswordMinLength: 'Password confirmation must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    nameRequired: 'Full name is required',
    termsRequired: 'You must accept the terms of service',
    passwordRequirements: {
      minLength: 'at least 6 characters',
      lowercase: 'at least one lowercase letter',
      uppercase: 'at least one uppercase letter',
      numberOrSpecial: 'at least one number or special character'
    }
  },
  messages: {
    loginSuccess: 'Login successful! Welcome.',
    loginError: 'An error occurred while logging in',
    registerSuccess: 'Registration successful! Welcome.',
    registerError: 'An error occurred while registering',
    forgotPasswordSuccess: 'Password reset link sent to your email.',
    forgotPasswordError: 'An error occurred while sending password reset email',
    googleNotAvailable: 'Google login is currently unavailable',
    googleError: 'An error occurred while logging in with Google'
  }
}
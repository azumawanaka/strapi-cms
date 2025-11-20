export default ({ env }) => ({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
    },
  },
});

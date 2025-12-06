import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'ar'].includes(locale as any)) {
    // This could be a redirect to a default locale
    // For now, we'll just throw an error
    throw new Error(`Invalid locale: ${locale}`);
  }
 
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

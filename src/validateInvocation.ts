import {
  IntegrationExecutionContext,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { HerokuClient } from './heroku';
import { HerokuIntegrationConfig } from './types';

export default async function validateInvocation(
  context: IntegrationExecutionContext<HerokuIntegrationConfig>,
): Promise<void> {
  context.logger.info(
    {
      instance: context.instance,
    },
    'Validating integration config...',
  );

  const heroku = new HerokuClient(context.instance.config);
  try {
    await heroku.request('/account');
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      // the API Client throws Authorization errors, but we want to throw
      // Authentication errors during validateInvocation
      throw new IntegrationProviderAuthenticationError({
        endpoint: err.endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
    throw err;
  }
}

import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationEntity,
  Entity,
  getTime,
} from '@jupiterone/integration-sdk';
import { HerokuClient } from '../../heroku';

export const STEP_ID = 'fetch-enterprise-accounts';
export const ACCOUNT_TYPE = 'heroku_account';

const step: IntegrationStep = {
  id: STEP_ID,
  name: 'Fetch Enterprise Accounts',
  types: [ACCOUNT_TYPE],
  async executionHandler({
    logger,
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const heroku = new HerokuClient(instance.config);

    logger.info('Calling /enterprise-accounts API...');
    const enterpriseAccounts = await heroku.getEnterpriseAccounts();

    await jobState.addEntities(enterpriseAccounts.map(createAccountEntity));
  },
};

export default step;

interface EnterpriseAccount {
  id: string;
  created_at: string;
  updated_at: string;
}

export function createAccountEntity(
  enterpriseAccount: EnterpriseAccount,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: enterpriseAccount,
      assign: {
        _key: enterpriseAccount.id,
        _type: ACCOUNT_TYPE,
        _class: 'Account',
        id: enterpriseAccount.id,
        createdOn: getTime(enterpriseAccount.created_at),
        updatedOn: getTime(enterpriseAccount.updated_at),
      },
    },
  });
}

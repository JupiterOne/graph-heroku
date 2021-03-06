import {
  IntegrationStep,
  createIntegrationEntity,
  Entity,
  getTime,
} from '@jupiterone/integration-sdk-core';
import { HerokuClient } from '../../heroku';
import {
  STEP_ID as ACCOUNT_STEP,
  ACCOUNT_TYPE,
} from '../fetch-enterprise-accounts';
import { HerokuIntegrationConfig } from '../../types';

export const TEAM_TYPE = 'heroku_team';
export const STEP_ID = 'fetch-teams';

const step: IntegrationStep<HerokuIntegrationConfig> = {
  id: STEP_ID,
  name: 'Fetch teams',
  entities: [
    {
      resourceName: 'Team',
      _type: TEAM_TYPE,
      _class: 'Team',
    },
  ],
  relationships: [],
  dependsOn: [ACCOUNT_STEP],
  async executionHandler({ logger, instance, jobState }) {
    const heroku = new HerokuClient(instance.config);

    logger.info('Calling /enterprise-accounts/:id/teams API...');
    await jobState.iterateEntities({ _type: ACCOUNT_TYPE }, async (account) => {
      const teams = await heroku.getEnterpriseAccountTeams(
        account.id as string,
      );
      await jobState.addEntities(
        teams.map((team) => createTeamEntity(team, account.id)),
      );
    });
  },
};

export default step;

export function createTeamEntity(team, accountId): Entity {
  return createIntegrationEntity({
    entityData: {
      source: team,
      assign: {
        _key: team.id,
        _type: TEAM_TYPE,
        _class: 'Team',
        createdOn: getTime(team.created_at),
        updatedOn: getTime(team.updated_at),
        enterpriseAccountId: accountId,
      },
    },
  });
}

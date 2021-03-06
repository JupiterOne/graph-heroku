import {
  IntegrationStep,
  createIntegrationEntity,
  Entity,
  getTime,
} from '@jupiterone/integration-sdk-core';
import { HerokuClient } from '../../heroku';
import {
  STEP_ID as TEAM_STEP,
  TEAM_TYPE,
} from '../fetch-enterprise-account-teams';
import { HerokuIntegrationConfig } from '../../types';

export const STEP_ID = 'fetch-team-apps';
export const APPLICATION_TYPE = 'heroku_application';

const step: IntegrationStep<HerokuIntegrationConfig> = {
  id: STEP_ID,
  name: 'Fetch team apps',
  entities: [
    {
      resourceName: 'Application',
      _type: APPLICATION_TYPE,
      _class: 'Application',
    },
  ],
  relationships: [],
  dependsOn: [TEAM_STEP],
  async executionHandler({ logger, instance, jobState }) {
    const heroku = new HerokuClient(instance.config);

    logger.info('Calling /teams/:id/apps API...');
    await jobState.iterateEntities({ _type: TEAM_TYPE }, async (team) => {
      const applications = await heroku.getTeamApps(team.id as string);

      await jobState.addEntities(
        applications.map((application) =>
          createApplicationEntity(application, team.id),
        ),
      );
    });
  },
};

export default step;

export function createApplicationEntity(application, teamId): Entity {
  return createIntegrationEntity({
    entityData: {
      source: application,
      assign: {
        _key: application.id,
        _type: APPLICATION_TYPE,
        _class: 'Application',
        id: application.id,
        createdOn: getTime(application.created_at),
        updatedOn: getTime(application.updated_at),
        teamId,
        name: application.name,
        owner: application.owner ? application.owner.email : null,
      },
    },
  });
}

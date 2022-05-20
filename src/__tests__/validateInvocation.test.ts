import validateInvocation from '../validateInvocation';
import {
  createMockExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { HerokuIntegrationConfig } from '../types';

let recording: Recording;

afterEach(() => {
  recording.stop();
});
describe('validateInvocation', () => {
  test('should validate if heroku call passes', async () => {
    recording = setupRecording({
      name: 'validate-invocation-pass',
      directory: __dirname,
      redactedRequestHeaders: ['authorization'],
    });

    const context = createMockExecutionContext<HerokuIntegrationConfig>({
      instanceConfig: {
        apiKey: 'test',
      },
    });

    const response = await validateInvocation(context);
    expect(response).toBe(undefined);
  });

  test('should throw if heroku call fails', async () => {
    recording = setupRecording({
      name: 'validate-invocation-fail',
      directory: __dirname,
      redactedRequestHeaders: ['authorization'],
    });

    const context = createMockExecutionContext<HerokuIntegrationConfig>({
      instanceConfig: {
        apiKey: 'test',
      },
    });

    await expect(validateInvocation(context)).rejects.toThrow(
      'Provider authentication failed at https://api.heroku.com/account: 401 Invalid credentials provided.',
    );
  });
});

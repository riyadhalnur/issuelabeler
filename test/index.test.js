const { serverless } = require('@probot/serverless-lambda');

const handler = require('../src/handler');
const app = require('../src/app');

const event_opened = require('./fixtures/event_opened');
const event_edited = require('./fixtures/event_edited');
const payload = require('./fixtures/payload');

describe('issuelabeler', () => {
  let context
  let github

  beforeAll(() => {
    github = {
      repos: {
        getContents: jest.fn().mockReturnValue(Promise.resolve({
          data: {
            content: Buffer.from(`excludeLabels:\n  - hey`).toString('base64')
          }
        }))
      },
      issues: {
        listLabelsForRepo: jest.fn().mockReturnValue(Promise.resolve({
          data: [
            {
              id: 889466157,
              url: 'https://api.github.com/repos/issuebot/test/labels/hey',
              name: 'hey',
              color: 'f5fc92',
              default: false
            },
            {
              id: 889466158,
              url: 'https://api.github.com/repos/issuebot/test/labels/test',
              name: 'test',
              color: 'f5fc93',
              default: false
            },
            {
              id: 889466159,
              url: 'https://api.github.com/repos/issuebot/test/labels/a-feature',
              name: 'A-Feature',
              color: 'f5fc93',
              default: false
            }
          ]
        })),
        get: jest.fn().mockReturnValue(Promise.resolve({
          data: payload
        })),
        addLabels: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    };

    context = { done: jest.fn() };
    handler.bot = serverless(async robot => {
      robot.auth = jest.fn().mockResolvedValue(github)
      robot.on(handler.events, app)
    });
  });

  test('that labels are applied to an issue when opened', async () => {
    await handler.bot(event_opened, context);

    expect(github.repos.getContents).toHaveBeenCalled();
    expect(github.issues.listLabelsForRepo).toHaveBeenCalled();
    expect(github.issues.get).toHaveBeenCalled();
    expect(github.issues.addLabels).toHaveBeenCalledWith({
      issue_number: 2,
      number: 2,
      owner: 'issuebot',
      repo: 'test',
      labels: [
        'test',
        'A-Feature'
      ]
    });
    expect(context.done).toHaveBeenCalled();
  });

  test('that labels are applied to an issue when edited', async () => {
    await handler.bot(event_edited, context);

    expect(github.repos.getContents).toHaveBeenCalled();
    expect(github.issues.listLabelsForRepo).toHaveBeenCalled();
    expect(github.issues.get).toHaveBeenCalled();
    expect(github.issues.addLabels).toHaveBeenCalledWith({
      issue_number: 2,
      number: 2,
      owner: 'issuebot',
      repo: 'test',
      labels: [
        'test',
        'A-Feature'
      ]
    });
    expect(context.done).toHaveBeenCalled();
  });
});

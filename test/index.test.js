const { createRobot } = require('probot')
const plugin = require('..')
const event = require('./fixtures/event')
const payload = require('./fixtures/payload')

describe('issuelabeler', () => {
  let robot
  let github

  beforeEach(() => {
    robot = createRobot()
    plugin(robot)

    github = {
      repos: {
        getContent: jest.fn().mockReturnValue(Promise.resolve({
          data: {
            content: Buffer.from(`excludeLabels:\n  - hey`).toString('base64')
          }
        }))
      },
      issues: {
        getLabels: jest.fn().mockReturnValue(Promise.resolve({
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
            }
          ]
        })),
        get: jest.fn().mockReturnValue(Promise.resolve({
          data: payload
        })),
        addLabels: jest.fn().mockReturnValue(Promise.resolve())
      }
    }

    robot.auth = () => Promise.resolve(github)
  })

  test('that required API calls are made', async () => {
    await robot.receive(event)

    expect(github.issues.getLabels).toHaveBeenCalled()
    expect(github.issues.get).toHaveBeenCalled()
  })

  test('that proper labels have been applied to an issue', async () => {
    await robot.receive(event)

    expect(github.issues.addLabels).toHaveBeenCalledWith({
      number: 2,
      owner: 'issuebot',
      repo: 'test',
      labels: [
        'test'
      ]
    })
  })
})

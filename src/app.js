'use strict';

const eventTypes = ['issues.opened', 'issues.edited'];
const loc_body = 'body';
const loc_title = 'title';

const addCustomLabels = (issue, config) => {
  let labels = [];

  config.forEach((custCfg) => {
    if (
      custCfg.location === loc_body &&
      issue.body.toLowerCase().includes(custCfg.keywords.join(','))
    ) {
      labels.push(...custCfg.labels);
    }

    if (
      custCfg.location === loc_title &&
      issue.title.toLowerCase().includes(custCfg.keywords.join(','))
    ) {
      labels.push(...custCfg.labels);
    }
  });

  return labels;
};

module.exports = async (app) => {
  app.on(eventTypes, async (context) => {
    const config = await context.config('labeler.yml', {
      numLabels: 100,
      excludeLabels: [],
    });
    const labels = await context.octokit.issues.listLabelsForRepo(
      context.issue({ per_page: config.numLabels })
    );
    const issue = await context.octokit.issues.get(
      context.issue({ issue_number: context.payload.issue.number })
    );

    let labelList = [];
    let labelsToAdd = [];

    if (config.custom) {
      labelsToAdd = addCustomLabels(issue.data, config.custom);
    } else {
      labels.data.map((label) => labelList.push(label.name));
      labelList
        .filter((label) => !config.excludeLabels.includes(label))
        .map((label) =>
          issue.data.title.toLowerCase().includes(label.toLowerCase()) ||
          issue.data.body.toLowerCase().includes(label.toLowerCase())
            ? labelsToAdd.push(label)
            : null
        );
    }

    return context.octokit.issues.addLabels(
      context.issue({
        issue_number: context.payload.issue.number,
        labels: labelsToAdd,
      })
    );
  });
};

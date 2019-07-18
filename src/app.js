'use strict';

const fs = require('fs');

module.exports = robot => {
  robot.on('issues.opened', async context => {
    const config = await context.config('labeler.yml', { numLabels: 20 });
    const labels = await context.github.issues.getLabels(context.issue({ per_page: config.numLabels }));
    const issue = await context.github.issues.get(context.issue());

    let labelList = [];
    let labelsToAdd = [];

    labels.data.map(label => labelList.push(label.name));
    labelList
      .filter(label => !config.excludeLabels.includes(label))
      .map(label => issue.data.title.toLowerCase().includes(label) || issue.data.body.toLowerCase().includes(label) ? labelsToAdd.push(label) : null);

    return context.github.issues.addLabels(context.issue({ labels: labelsToAdd }));
  });
};

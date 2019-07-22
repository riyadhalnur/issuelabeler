'use strict';

module.exports = async context => {
  const issueCtx = context.issue();

  const config = await context.config('labeler.yml', { numLabels: 20 });
  const labels = await context.github.issues.listLabelsForRepo(context.issue({ per_page: config.numLabels }));
  const issue = await context.github.issues.get(context.issue({ issue_number: context.payload.issue.number }));

  let labelList = [];
  let labelsToAdd = [];

  labels.data.map(label => labelList.push(label.name));
  labelList
    .filter(label => !config.excludeLabels.includes(label))
    .map(label => issue.data.title.toLowerCase().includes(label) || issue.data.body.toLowerCase().includes(label) ? labelsToAdd.push(label) : null);

  return context.github.issues.addLabels(context.issue({ issue_number: issueCtx.number, labels: labelsToAdd }));
};

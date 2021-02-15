"use strict";

const eventTypes = ["issues.opened", "issues.edited"];

module.exports = async (app) => {
  app.on(eventTypes, async (context) => {
    const config = await context.config("labeler.yml", { numLabels: 100 });
    const labels = await context.octokit.issues.listLabelsForRepo(
      context.issue({ per_page: config.numLabels })
    );
    const issue = await context.octokit.issues.get(
      context.issue({ issue_number: context.payload.issue.number })
    );

    let labelList = [];
    let labelsToAdd = [];

    labels.data.map((label) => labelList.push(label.name));
    labelList
      .filter((label) => !config.excludeLabels.includes(label))
      .map((label) =>
        issue.data.title.toLowerCase().includes(label.toLowerCase()) ||
        issue.data.body.toLowerCase().includes(label.toLowerCase())
          ? labelsToAdd.push(label)
          : null
      );

    return context.octokit.issues.addLabels(
      context.issue({
        issue_number: context.payload.issue.number,
        labels: labelsToAdd,
      })
    );
  });
};

export interface Activity {
  id: string;
  duration: number;
  predecessors: string[];
}

export interface ActivityWithTimes extends Activity {
  es: number; // Early Start
  ef: number; // Early Finish
  ls: number; // Late Start
  lf: number; // Late Finish
  slack: number; // Slack Time
  isCritical: boolean;
}

export const activities: Activity[] = [
  { id: "A", duration: 6, predecessors: [] },
  { id: "B", duration: 7.2, predecessors: [] },
  { id: "C", duration: 5, predecessors: ["A"] },
  { id: "D", duration: 6, predecessors: ["B", "C"] },
  { id: "E", duration: 4.5, predecessors: ["B", "C"] },
  { id: "F", duration: 7.7, predecessors: ["D"] },
  { id: "G", duration: 4, predecessors: ["E", "F"] },
];

export function calculateCPM(activities: Activity[]): {
  activitiesWithTimes: ActivityWithTimes[];
  criticalPath: string[];
  projectDuration: number;
} {
  const activityMap = new Map<string, ActivityWithTimes>();

  // Initialize activities with times
  activities.forEach((activity) => {
    activityMap.set(activity.id, {
      ...activity,
      es: 0,
      ef: 0,
      ls: 0,
      lf: 0,
      slack: 0,
      isCritical: false,
    });
  });

  // Forward pass - Calculate ES and EF
  const calculateForwardPass = (activityId: string): number => {
    const activity = activityMap.get(activityId)!;

    if (activity.ef > 0) return activity.ef; // Already calculated

    if (activity.predecessors.length === 0) {
      activity.es = 0;
      activity.ef = activity.duration;
    } else {
      let maxEF = 0;
      activity.predecessors.forEach((predId) => {
        const predEF = calculateForwardPass(predId);
        maxEF = Math.max(maxEF, predEF);
      });
      activity.es = maxEF;
      activity.ef = activity.es + activity.duration;
    }

    return activity.ef;
  };

  // Calculate forward pass for all activities
  activities.forEach((activity) => {
    calculateForwardPass(activity.id);
  });

  // Find project duration (maximum EF)
  const projectDuration = Math.max(
    ...Array.from(activityMap.values()).map((a) => a.ef)
  );

  // Backward pass - Calculate LS and LF
  const calculateBackwardPass = (activityId: string): number => {
    const activity = activityMap.get(activityId)!;

    if (activity.ls > 0 || activity.lf > 0) return activity.ls; // Already calculated

    // Find successors
    const successors = activities.filter((a) =>
      a.predecessors.includes(activityId)
    );

    if (successors.length === 0) {
      // No successors - this is an end activity
      activity.lf = projectDuration;
      activity.ls = activity.lf - activity.duration;
    } else {
      let minLS = Infinity;
      successors.forEach((successor) => {
        calculateBackwardPass(successor.id);
        const successorActivity = activityMap.get(successor.id)!;
        minLS = Math.min(minLS, successorActivity.ls);
      });
      activity.lf = minLS;
      activity.ls = activity.lf - activity.duration;
    }

    return activity.ls;
  };

  // Calculate backward pass for all activities
  activities.forEach((activity) => {
    calculateBackwardPass(activity.id);
  });

  // Calculate slack and identify critical activities
  activityMap.forEach((activity) => {
    activity.slack = activity.ls - activity.es;
    activity.isCritical = Math.abs(activity.slack) < 0.001; // Account for floating point errors
  });

  // Find critical path
  const criticalActivities = Array.from(activityMap.values()).filter(
    (a) => a.isCritical
  );

  // Sort critical activities by ES to get the path in order
  const criticalPath = criticalActivities
    .sort((a, b) => a.es - b.es)
    .map((a) => a.id);

  return {
    activitiesWithTimes: Array.from(activityMap.values()),
    criticalPath,
    projectDuration,
  };
}

export function getCPMResults() {
  return calculateCPM(activities);
}

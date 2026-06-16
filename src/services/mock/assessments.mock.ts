import { AssessmentStep, AssessmentSession } from "@/types/assessment.types";

export const MOCK_STEPS: AssessmentStep[] = [
  {
    stepIndex: 0,
    domain: "Attention",
    taskType: "coordination-test",
    title: "Attention Grid Tracker",
    instructions: "Click on the target numbers in sequential order (1 to 4) as they light up in the grid as quickly as possible.",
    durationSeconds: 30,
    config: {
      puzzleBlocks: [1, 2, 3, 4],
      targetPattern: "1-2-3-4"
    }
  },
  {
    stepIndex: 1,
    domain: "Memory",
    taskType: "word-recall",
    title: "Word Recall Exercise",
    instructions: "Memorize the list of words shown below. You will have 20 seconds to review them, and later you will write down as many as you can recall.",
    durationSeconds: 20,
    config: {
      words: ["Apple", "River", "Cabinet", "Shadow", "Anchor", "Breeze", "Lantern", "Saddle"]
    }
  },
  {
    stepIndex: 2,
    domain: "Reasoning",
    taskType: "reasoning-puzzle",
    title: "Reasoning Blocks",
    instructions: "Arrange the numbered blocks in increasing order (left to right) by sliding them into empty slots.",
    durationSeconds: 45,
    config: {
      puzzleBlocks: [3, 1, 4, 2],
      targetPattern: "1-2-3-4"
    }
  },
  {
    stepIndex: 3,
    domain: "Coordination",
    taskType: "coordination-test",
    title: "Motor Coordination Clicker",
    instructions: "Tap the floating circle as it moves around the canvas to test speed and motor coordination.",
    durationSeconds: 15,
    config: {
      clickIntervalMs: 800
    }
  },
  {
    stepIndex: 4,
    domain: "Perception",
    taskType: "perception-test",
    title: "Perception Shape Matcher",
    instructions: "Identify which shape matches the primary sample shown on screen.",
    durationSeconds: 25,
    config: {
      targetPattern: "triangle"
    }
  }
];

export function createMockSession(token: string, patientId: string, patientName: string): AssessmentSession {
  return {
    id: `session-${Math.random().toString(36).substring(2, 9)}`,
    token,
    patientId,
    patientName,
    status: "initialized",
    currentStepIndex: 0,
    steps: MOCK_STEPS,
    responses: {},
    timeRemainingSeconds: MOCK_STEPS[0].durationSeconds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function fetchMockSessionByToken(token: string): Promise<AssessmentSession | null> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  // Create a default session for Sunita Mehta or return a random new one
  if (token.includes("sunita")) {
    return createMockSession(token, "pat-sunita-mehta", "Sunita Mehta");
  } else if (token.includes("arjun")) {
    return createMockSession(token, "pat-arjun-bansal", "Arjun Bansal");
  }
  return createMockSession(token, "pat-guest", "Guest Patient");
}

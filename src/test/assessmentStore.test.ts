import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAssessmentStore } from "@/stores/assessment.store";
import { getSessionByToken, submitAssessmentResponses } from "@/services/api/assessments.service";

vi.mock("@/services/api/assessments.service", () => ({
  getSessionByToken: vi.fn(),
  submitAssessmentResponses: vi.fn(),
  submitStepAttempt: vi.fn(() => Promise.resolve({ success: true }))
}));

describe("useAssessmentStore", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset store state
    useAssessmentStore.setState({
      currentSession: null,
      isLoading: false,
      error: null,
      language: "en"
    });
  });

  it("should load session successfully", async () => {
    const mockSession = {
      id: "session-123",
      token: "token-123",
      patientId: "patient-123",
      patientName: "John Doe",
      status: "initialized",
      currentStepIndex: 0,
      steps: [
        {
          stepIndex: 0,
          domain: "Attention",
          taskType: "cpt",
          title: "CPT Task",
          instructions: "Press space on X",
          durationSeconds: 30,
          config: {}
        }
      ],
      responses: {},
      timeRemainingSeconds: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    vi.mocked(getSessionByToken).mockResolvedValue(mockSession as any);

    await useAssessmentStore.getState().loadSession("token-123");

    const state = useAssessmentStore.getState();
    expect(state.currentSession).toEqual(mockSession);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(getSessionByToken).toHaveBeenCalledWith("token-123");
  });

  it("should handle load session error", async () => {
    vi.mocked(getSessionByToken).mockRejectedValue(new Error("Network error"));

    await useAssessmentStore.getState().loadSession("token-123");

    const state = useAssessmentStore.getState();
    expect(state.currentSession).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Network error");
  });

  it("should start session and update state", () => {
    const mockSession = {
      id: "session-123",
      token: "token-123",
      status: "initialized",
      currentStepIndex: 0,
      steps: [
        { durationSeconds: 30 }
      ]
    };

    useAssessmentStore.setState({ currentSession: mockSession as any });

    useAssessmentStore.getState().startSession();

    const state = useAssessmentStore.getState();
    expect(state.currentSession?.status).toBe("started");
    expect(state.currentSession?.currentStepIndex).toBe(0);
    expect(state.currentSession?.timeRemainingSeconds).toBe(30);
  });

  it("should advance to next step when nextStep is called", () => {
    const mockSession = {
      id: "session-123",
      token: "token-123",
      status: "started",
      currentStepIndex: 0,
      steps: [
        { durationSeconds: 30 },
        { durationSeconds: 40 }
      ]
    };

    useAssessmentStore.setState({ currentSession: mockSession as any });

    useAssessmentStore.getState().nextStep();

    const state = useAssessmentStore.getState();
    expect(state.currentSession?.currentStepIndex).toBe(1);
    expect(state.currentSession?.timeRemainingSeconds).toBe(40);
  });

  it("should complete session if nextStep is called on the last step", () => {
    const mockSession = {
      id: "session-123",
      token: "token-123",
      status: "started",
      currentStepIndex: 1,
      steps: [
        { durationSeconds: 30 },
        { durationSeconds: 40 }
      ]
    };

    useAssessmentStore.setState({ currentSession: mockSession as any });

    useAssessmentStore.getState().nextStep();

    const state = useAssessmentStore.getState();
    expect(state.currentSession?.status).toBe("completed");
  });

  it("should go to previous step when prevStep is called", () => {
    const mockSession = {
      id: "session-123",
      token: "token-123",
      status: "started",
      currentStepIndex: 1,
      steps: [
        { durationSeconds: 30 },
        { durationSeconds: 40 }
      ]
    };

    useAssessmentStore.setState({ currentSession: mockSession as any });

    useAssessmentStore.getState().prevStep();

    const state = useAssessmentStore.getState();
    expect(state.currentSession?.currentStepIndex).toBe(0);
    expect(state.currentSession?.timeRemainingSeconds).toBe(30);
  });

  it("should submit a response and update local state", () => {
    const mockSession = {
      id: "session-123",
      token: "token-123",
      status: "started",
      currentStepIndex: 0,
      steps: [
        { durationSeconds: 30, domain: "Attention", taskType: "cpt" }
      ],
      responses: {}
    };

    useAssessmentStore.setState({ currentSession: mockSession as any });

    const mockResponse = { accuracy: 95.0, correctResponses: 19 };
    useAssessmentStore.getState().submitResponse(0, mockResponse);

    const state = useAssessmentStore.getState();
    expect(state.currentSession?.responses[0]).toEqual(mockResponse);
  });

  it("should tick timer and decrement seconds remaining", () => {
    const mockSession = {
      id: "session-123",
      token: "token-123",
      status: "started",
      timeRemainingSeconds: 15
    };

    useAssessmentStore.setState({ currentSession: mockSession as any });

    useAssessmentStore.getState().tickTimer();

    const state = useAssessmentStore.getState();
    expect(state.currentSession?.timeRemainingSeconds).toBe(14);
  });

  it("should automatically move to next step when timer ticks down to 0", () => {
    const mockSession = {
      id: "session-123",
      token: "token-123",
      status: "started",
      currentStepIndex: 0,
      timeRemainingSeconds: 1,
      steps: [
        { durationSeconds: 30 },
        { durationSeconds: 40 }
      ]
    };

    useAssessmentStore.setState({ currentSession: mockSession as any });

    useAssessmentStore.getState().tickTimer();

    const state = useAssessmentStore.getState();
    expect(state.currentSession?.currentStepIndex).toBe(1);
    expect(state.currentSession?.timeRemainingSeconds).toBe(40);
  });

  it("should submit assessment session responses to backend", async () => {
    const mockSession = {
      id: "session-123",
      token: "token-123",
      status: "started",
      responses: {
        0: { accuracy: 90.0 }
      }
    };

    useAssessmentStore.setState({ currentSession: mockSession as any });
    vi.mocked(submitAssessmentResponses).mockResolvedValue({ success: true, generatedReportId: "report-999" });

    const reportId = await useAssessmentStore.getState().submitSession();

    const state = useAssessmentStore.getState();
    expect(state.currentSession?.status).toBe("completed");
    expect(reportId).toBe("report-999");
    expect(submitAssessmentResponses).toHaveBeenCalledWith("session-123", mockSession.responses);
  });
});

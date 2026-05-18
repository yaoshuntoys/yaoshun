export type GlobalFormFeedbackPayload = {
  message: string;
  title: string;
  type: "success" | "error";
};

export const globalFormFeedbackEventName = "yaoshun:form-feedback";

export function showGlobalFormFeedback(payload: GlobalFormFeedbackPayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<GlobalFormFeedbackPayload>(globalFormFeedbackEventName, {
      detail: payload,
    }),
  );
}

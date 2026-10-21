   Priority                Status         What currently exists                 What remains
  ━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. Subscriptions        Partial        Live subscription table, paid/        RevenueCat webhook sync,
                                          manual/trial/inactive separation,     authoritative identity
                                          filtering, duplicate-row              reconciliation, verified revenue
                                          protection, date/status display,      totals, payment-status validation,
                                          unmatched flagging                    reconciliation testing
  ──────────────────────  ─────────────  ────────────────────────────────────  ─────────────────────────────────────
   2. Customer profiles    Partial        Profile, family, children, goals,     Routines, chores and full feature-
                                          finance, onboarding, registration     event history; reliable last
                                          date and app sessions                 activity; server-side per-user
                                                                                history; active-account vs
                                                                                actively-using segmentation
  ──────────────────────  ─────────────  ────────────────────────────────────  ─────────────────────────────────────
   3. Analytics            Partial        Sessions, app opens, platform         DAU/WAU/MAU, acquisition,
                                          breakdown, countries, onboarding      abandonment, feature adoption, D2/
                                          rate and date filters                 D7/D30 retention, trial conversion,
                                                                                renewals, cancellations and funnels
  ──────────────────────  ─────────────  ────────────────────────────────────  ─────────────────────────────────────
   4. PostHog              Not started    None                                  SDK, identification, events,
                                                                                privacy controls, recordings,
                                                                                funnels, retention reports and
                                                                                workspace configuration
  ──────────────────────  ─────────────  ────────────────────────────────────  ─────────────────────────────────────
   5. OneSignal            Not started    None                                  SDK, identity synchronization,
                                                                                consent, push/email/in-app
                                                                                messaging and automated journeys
  ──────────────────────  ─────────────  ────────────────────────────────────  ─────────────────────────────────────
   Data QA                 Partial        UI-level deduplication and            Cross-system ID audit, duplicate
                                          unmatched subscription indicators     reconciliation, synchronization
                                                                                verification, privacy audit and
                                                                                real-data acceptance testing
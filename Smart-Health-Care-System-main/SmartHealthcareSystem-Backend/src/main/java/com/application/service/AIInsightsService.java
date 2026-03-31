package com.application.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.application.model.AIInsightsRequest;
import com.application.model.AIInsightsResponse;
import com.application.model.Doctor;
import com.application.model.Slots;
import com.application.repository.DoctorRegistrationRepository;
import com.application.repository.SlotBookingRepository;

@Service
public class AIInsightsService
{
    @Autowired
    private DoctorRegistrationRepository doctorRepository;

    @Autowired
    private SlotBookingRepository slotBookingRepository;

    public AIInsightsResponse generateInsights(AIInsightsRequest request)
    {
        List<String> explicitSymptoms = normalizeList(request.getSymptoms());
        List<String> extractedSymptoms = extractSymptomsFromNarrative(request.getSymptomNarrative());
        List<String> mergedSymptoms = mergeLists(explicitSymptoms, extractedSymptoms);
        List<String> chronicConditions = normalizeList(request.getChronicConditions());
        List<String> allergies = normalizeList(request.getAllergies());
        List<String> medicines = normalizeList(request.getCurrentMedicines());

        AIInsightsResponse response = new AIInsightsResponse();
        AIInsightsResponse.SymptomTextAnalysis symptomTextAnalysis = buildSymptomTextAnalysis(request, mergedSymptoms);
        response.setSymptomTextAnalysis(symptomTextAnalysis);

        AIInsightsResponse.DiseasePrediction diseasePrediction = buildDiseasePrediction(request, mergedSymptoms);
        response.setDiseasePrediction(diseasePrediction);

        AIInsightsResponse.DoctorRecommendation doctorRecommendation = buildDoctorRecommendation(
                request,
                mergedSymptoms,
                diseasePrediction,
                symptomTextAnalysis);
        response.setDoctorRecommendation(doctorRecommendation);

        AIInsightsResponse.SlotRecommendation slotRecommendation = buildSlotRecommendation(
                request,
                doctorRecommendation,
                symptomTextAnalysis);
        response.setSlotRecommendation(slotRecommendation);

        response.setNoShowPrediction(buildNoShowPrediction(request));
        response.setPrescriptionSupport(buildPrescriptionSupport(diseasePrediction, mergedSymptoms, allergies, medicines));
        response.setPatientRisk(buildPatientRisk(request, mergedSymptoms, chronicConditions));
        response.setAdmissionRisk(buildAdmissionRisk(request, mergedSymptoms, chronicConditions, diseasePrediction));
        response.setReportSummary(buildReportSummary(request, diseasePrediction, mergedSymptoms, chronicConditions));
        response.setTriageChat(buildTriageChat(request, mergedSymptoms, diseasePrediction, slotRecommendation));
        return response;
    }

    private AIInsightsResponse.SymptomTextAnalysis buildSymptomTextAnalysis(
            AIInsightsRequest request,
            List<String> mergedSymptoms)
    {
        AIInsightsResponse.SymptomTextAnalysis analysis = new AIInsightsResponse.SymptomTextAnalysis();
        List<String> urgencySignals = new ArrayList<>();
        String narrative = safeValue(request.getSymptomNarrative(), "");

        if (containsAny(mergedSymptoms, "chest pain", "shortness of breath", "fainting", "confusion")) {
            urgencySignals.add("Red-flag symptom pattern detected.");
        }
        if (request.getTemperature() >= 102.0) {
            urgencySignals.add("High temperature suggests stronger clinical review.");
        }
        if (request.getPainLevel() >= 8) {
            urgencySignals.add("Severe pain level reported.");
        }
        if (request.getQuestion() != null && request.getQuestion().toLowerCase(Locale.ROOT).contains("urgent")) {
            urgencySignals.add("The patient asked directly about urgency.");
        }

        String clinicalIntent = "General evaluation";
        String question = safeValue(request.getQuestion(), "").toLowerCase(Locale.ROOT);
        if (question.contains("book")) {
            clinicalIntent = "Appointment booking";
        } else if (question.contains("doctor")) {
            clinicalIntent = "Doctor recommendation";
        } else if (question.contains("medicine") || question.contains("prescription")) {
            clinicalIntent = "Medication safety review";
        } else if (question.contains("report")) {
            clinicalIntent = "Report explanation";
        }

        AIInsightsResponse.DiseasePrediction predictionPreview = buildDiseasePrediction(request, mergedSymptoms);
        String specialization = chooseSpecialization(
                request.getSpecializationPreference(),
                mergedSymptoms,
                predictionPreview.getProbableCondition());

        analysis.setNormalizedNarrative(narrative.isEmpty()
                ? "Structured symptom entry only."
                : "Narrative normalized for triage review: " + narrative.trim());
        analysis.setClinicalIntent(clinicalIntent);
        analysis.setDetectedSymptoms(mergedSymptoms);
        analysis.setUrgencySignals(urgencySignals);
        analysis.setRecommendedSpecialization(specialization);
        analysis.setTriagePriority(predictionPreview.getUrgency());
        return analysis;
    }

    private AIInsightsResponse.DiseasePrediction buildDiseasePrediction(AIInsightsRequest request, List<String> symptoms)
    {
        Map<String, List<String>> rules = new LinkedHashMap<>();
        rules.put("Viral flu", Arrays.asList("fever", "cough", "fatigue", "body ache", "headache", "sore throat"));
        rules.put("Respiratory infection", Arrays.asList("cough", "fever", "shortness of breath", "sore throat", "congestion"));
        rules.put("Migraine", Arrays.asList("headache", "nausea", "light sensitivity", "vomiting", "dizziness"));
        rules.put("Seasonal allergy", Arrays.asList("sneezing", "runny nose", "itchy eyes", "rash", "congestion"));
        rules.put("Gastrointestinal infection", Arrays.asList("nausea", "vomiting", "diarrhea", "abdominal pain", "fever"));
        rules.put("Urinary tract issue", Arrays.asList("burning urination", "frequent urination", "pelvic pain", "fever"));
        rules.put("Cardiovascular concern", Arrays.asList("chest pain", "shortness of breath", "dizziness", "arm pain", "palpitations"));
        rules.put("Skin irritation", Arrays.asList("rash", "itching", "skin redness", "swelling"));
        rules.put("Endocrine imbalance review", Arrays.asList("fatigue", "weight gain", "weight loss", "increased thirst", "frequent urination"));

        String bestCondition = "General medical review";
        int bestScore = 0;
        List<String> matched = new ArrayList<>();

        for (Map.Entry<String, List<String>> entry : rules.entrySet()) {
            List<String> conditionMatches = entry.getValue().stream()
                    .filter(symptom -> containsSymptom(symptoms, symptom))
                    .collect(Collectors.toList());
            if (conditionMatches.size() > bestScore) {
                bestScore = conditionMatches.size();
                bestCondition = entry.getKey();
                matched = conditionMatches;
            }
        }

        int confidence = Math.min(96, 35 + (bestScore * 14));
        if (symptoms.isEmpty()) {
            confidence = 25;
        }

        String urgency = "Low";
        if (containsAny(symptoms, "chest pain", "shortness of breath", "arm pain", "fainting")) {
            urgency = "Emergency";
            confidence = Math.max(confidence, 88);
        } else if (request.getTemperature() >= 102.0 || containsAny(symptoms, "high fever", "severe pain", "confusion")) {
            urgency = "High";
        } else if (bestScore >= 3 || request.getPainLevel() >= 7) {
            urgency = "Medium";
        }

        AIInsightsResponse.DiseasePrediction prediction = new AIInsightsResponse.DiseasePrediction();
        prediction.setProbableCondition(bestCondition);
        prediction.setConfidence(confidence);
        prediction.setUrgency(urgency);
        prediction.setMatchedSymptoms(matched);
        prediction.setSummary(buildPredictionSummary(bestCondition, urgency, matched));
        return prediction;
    }

    private AIInsightsResponse.DoctorRecommendation buildDoctorRecommendation(
            AIInsightsRequest request,
            List<String> symptoms,
            AIInsightsResponse.DiseasePrediction prediction,
            AIInsightsResponse.SymptomTextAnalysis symptomTextAnalysis)
    {
        String targetSpecialization = chooseSpecialization(
                request.getSpecializationPreference(),
                symptoms,
                prediction.getProbableCondition());
        List<Doctor> doctors = new ArrayList<>();
        try {
            doctorRepository.findAll().forEach(doctors::add);
        } catch (RuntimeException ex) {
            doctors.clear();
        }

        List<Doctor> acceptedDoctors = doctors.stream()
                .filter(doctor -> doctor.getStatus() == null || doctor.getStatus().trim().isEmpty()
                        || "accept".equalsIgnoreCase(doctor.getStatus()))
                .collect(Collectors.toList());

        List<AIInsightsResponse.DoctorSuggestion> ranked = acceptedDoctors.stream()
                .map(doctor -> mapDoctorSuggestion(doctor, targetSpecialization, symptoms, prediction, symptomTextAnalysis))
                .sorted(Comparator.comparingInt(AIInsightsResponse.DoctorSuggestion::getRankingScore).reversed())
                .limit(3)
                .collect(Collectors.toList());

        AIInsightsResponse.DoctorRecommendation recommendation = new AIInsightsResponse.DoctorRecommendation();
        recommendation.setRecommendedSpecialization(targetSpecialization);
        recommendation.setRationale("Recommendation is based on symptom clustering, predicted condition, text understanding, and available doctor specialization records.");

        if (ranked.isEmpty()) {
            AIInsightsResponse.DoctorSuggestion fallback = new AIInsightsResponse.DoctorSuggestion();
            fallback.setDoctorname("Recommended specialist not available in current records");
            fallback.setEmail("Not available");
            fallback.setSpecialization(targetSpecialization);
            fallback.setExperience("N/A");
            fallback.setRankingScore(0);
            fallback.setReason("The AI still recommends this specialty, but no approved doctor records were usable.");
            ranked.add(fallback);
        }

        recommendation.setDoctors(ranked);
        return recommendation;
    }

    private AIInsightsResponse.SlotRecommendation buildSlotRecommendation(
            AIInsightsRequest request,
            AIInsightsResponse.DoctorRecommendation doctorRecommendation,
            AIInsightsResponse.SymptomTextAnalysis symptomTextAnalysis)
    {
        AIInsightsResponse.SlotRecommendation recommendation = new AIInsightsResponse.SlotRecommendation();
        String specialization = safeValue(doctorRecommendation.getRecommendedSpecialization(), symptomTextAnalysis.getRecommendedSpecialization());
        List<Slots> slots = new ArrayList<>();
        try {
            slotBookingRepository.findAll().forEach(slots::add);
        } catch (RuntimeException ex) {
            slots.clear();
        }

        List<AIInsightsResponse.SlotOption> availableOptions = new ArrayList<>();
        for (Slots slot : slots) {
            if (slot == null || slot.getDoctorname() == null || slot.getSpecialization() == null) {
                continue;
            }
            if (!slot.getSpecialization().toLowerCase(Locale.ROOT).contains(specialization.toLowerCase(Locale.ROOT))) {
                continue;
            }
            appendSlotIfAvailable(availableOptions, slot, "AM slot", slot.getAmstatus(), slot.getAmslot());
            appendSlotIfAvailable(availableOptions, slot, "Noon slot", slot.getNoonstatus(), slot.getNoonslot());
            appendSlotIfAvailable(availableOptions, slot, "PM slot", slot.getPmstatus(), slot.getPmslot());
        }

        availableOptions.sort(Comparator
                .comparing(AIInsightsResponse.SlotOption::getDate, Comparator.nullsLast(String::compareTo))
                .thenComparing(AIInsightsResponse.SlotOption::getDoctorname, Comparator.nullsLast(String::compareTo)));

        recommendation.setRecommendedSpecialization(specialization);
        recommendation.setAlternatives(availableOptions.stream().limit(4).collect(Collectors.toList()));

        if (!availableOptions.isEmpty()) {
            AIInsightsResponse.SlotOption best = availableOptions.get(0);
            recommendation.setRecommendedDate(best.getDate());
            recommendation.setRecommendedSlot(best.getSlot());
            recommendation.setRecommendedDoctor(best.getDoctorname());
            recommendation.setRationale("Earliest available slot aligned with the recommended specialization and currently open booking status.");
        } else {
            recommendation.setRecommendedDate(safeValue(request.getPreferredDate(), "Check live availability"));
            recommendation.setRecommendedSlot("Review doctor slots");
            recommendation.setRecommendedDoctor(doctorRecommendation.getDoctors().isEmpty()
                    ? "Best available doctor"
                    : doctorRecommendation.getDoctors().get(0).getDoctorname());
            recommendation.setRationale("No live slot record matched the recommended specialization, so review the slot board and choose the closest open visit.");
        }
        return recommendation;
    }

    private AIInsightsResponse.NoShowPrediction buildNoShowPrediction(AIInsightsRequest request)
    {
        int score = 12;
        List<String> drivers = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        if (request.getMissedAppointments() > 0) {
            score += request.getMissedAppointments() * 18;
            drivers.add("Previous missed appointments increase future no-show risk.");
        }
        if (request.getLeadTimeDays() > 10) {
            score += 15;
            drivers.add("Long booking lead time weakens appointment commitment.");
        }
        if (request.getDistanceKm() > 15) {
            score += 12;
            drivers.add("Long travel distance can reduce attendance.");
        }
        if (!request.isHasReminder()) {
            score += 16;
            drivers.add("No reminder is scheduled for the appointment.");
        }
        if (request.isWeekendAppointment()) {
            score += 8;
            drivers.add("Weekend schedules can be easier to miss.");
        }
        if (request.getStressLevel() >= 7) {
            score += 8;
            drivers.add("High reported stress can disrupt follow-through.");
        }

        score = Math.min(100, score);
        String level = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

        actions.add("Send reminder notifications 24 hours and 2 hours before the visit.");
        actions.add("Offer quick rescheduling from the dashboard if timing changes.");
        if (request.getDistanceKm() > 15) {
            actions.add("Consider teleconsultation or a closer specialist if clinically appropriate.");
        }
        if (request.getLeadTimeDays() > 10) {
            actions.add("Reconfirm attendance midway between booking and appointment date.");
        }

        AIInsightsResponse.NoShowPrediction prediction = new AIInsightsResponse.NoShowPrediction();
        prediction.setRiskScore(score);
        prediction.setRiskLevel(level);
        prediction.setDrivers(drivers);
        prediction.setActions(actions);
        return prediction;
    }

    private AIInsightsResponse.PrescriptionSupport buildPrescriptionSupport(
            AIInsightsResponse.DiseasePrediction prediction,
            List<String> symptoms,
            List<String> allergies,
            List<String> medicines)
    {
        AIInsightsResponse.PrescriptionSupport support = new AIInsightsResponse.PrescriptionSupport();
        List<String> suggestions = new ArrayList<>();
        List<String> alerts = new ArrayList<>();

        String probableCondition = prediction.getProbableCondition().toLowerCase(Locale.ROOT);
        if (probableCondition.contains("viral flu") || probableCondition.contains("respiratory")) {
            suggestions.add("Encourage hydration, rest, and temperature monitoring.");
            suggestions.add("Discuss fever reducers or supportive cold medication with the clinician if symptoms worsen.");
        }
        if (probableCondition.contains("migraine")) {
            suggestions.add("Reduce bright-light exposure and track triggers such as stress or lack of sleep.");
            suggestions.add("Ask the doctor to review migraine-safe pain relief options and hydration status.");
        }
        if (probableCondition.contains("gastro")) {
            suggestions.add("Use oral rehydration and a bland diet while watching for dehydration.");
        }
        if (probableCondition.contains("allergy")) {
            suggestions.add("Consider discussing non-drowsy allergy relief and trigger avoidance.");
        }
        if (suggestions.isEmpty()) {
            suggestions.add("Use this as a clinician support summary rather than an automatic prescription.");
            suggestions.add("Review allergies, current medicines, and symptom severity before final prescribing.");
        }

        if (!allergies.isEmpty()) {
            alerts.add("Recorded allergies: " + String.join(", ", allergies) + ".");
        }
        if (!medicines.isEmpty()) {
            alerts.add("Current medicines to cross-check for interactions: " + String.join(", ", medicines) + ".");
        }
        if (containsAny(symptoms, "chest pain", "shortness of breath", "fainting")) {
            alerts.add("Red-flag symptoms present. Urgent clinician assessment is recommended before any routine medication advice.");
        }

        support.setSummary("This module gives clinician-facing medication support based on symptoms, allergies, and the predicted condition.");
        support.setSuggestions(suggestions);
        support.setAlerts(alerts);
        support.setDisclaimer("AI suggestions are decision-support only and must be reviewed by a licensed clinician before prescribing.");
        return support;
    }

    private AIInsightsResponse.PatientRisk buildPatientRisk(
            AIInsightsRequest request,
            List<String> symptoms,
            List<String> chronicConditions)
    {
        int score = 8;
        List<String> contributors = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        if (request.getAge() >= 60) {
            score += 18;
            contributors.add("Age above 60 raises baseline health risk.");
        } else if (request.getAge() >= 45) {
            score += 10;
            contributors.add("Midlife age band adds moderate baseline risk.");
        }
        if (request.getBmi() >= 30) {
            score += 15;
            contributors.add("BMI in the obesity range can increase disease burden.");
        } else if (request.getBmi() >= 25) {
            score += 8;
            contributors.add("BMI in the overweight range contributes to moderate risk.");
        }
        if (request.isSmoker()) {
            score += 15;
            contributors.add("Smoking status increases cardiovascular and respiratory risk.");
        }
        if (request.isAlcoholUse()) {
            score += 6;
            contributors.add("Regular alcohol use adds metabolic and compliance risk.");
        }
        if (request.isFamilyHistory()) {
            score += 8;
            contributors.add("Family history raises long-term screening priority.");
        }
        if (!chronicConditions.isEmpty()) {
            score += Math.min(24, chronicConditions.size() * 8);
            contributors.add("Chronic conditions reported: " + String.join(", ", chronicConditions) + ".");
        }
        if (containsAny(symptoms, "chest pain", "shortness of breath", "fainting")) {
            score += 20;
            contributors.add("Red-flag symptoms increase acute risk.");
        }
        if (request.getStressLevel() >= 7 || request.getSleepHours() <= 5) {
            score += 8;
            contributors.add("High stress or poor sleep can worsen overall health status.");
        }

        score = Math.min(100, score);
        String level = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

        recommendations.add("Review the highest-risk symptoms with a doctor and prioritize follow-up.");
        recommendations.add("Track vitals, symptom changes, and medicine adherence in the patient record.");
        if (request.isSmoker()) {
            recommendations.add("Discuss smoking cessation support and respiratory screening.");
        }
        if (!chronicConditions.isEmpty()) {
            recommendations.add("Schedule focused monitoring for the chronic conditions already reported.");
        }

        AIInsightsResponse.PatientRisk risk = new AIInsightsResponse.PatientRisk();
        risk.setScore(score);
        risk.setLevel(level);
        risk.setContributors(contributors);
        risk.setRecommendations(recommendations);
        return risk;
    }

    private AIInsightsResponse.AdmissionRisk buildAdmissionRisk(
            AIInsightsRequest request,
            List<String> symptoms,
            List<String> chronicConditions,
            AIInsightsResponse.DiseasePrediction prediction)
    {
        int score = 10;
        List<String> drivers = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        if ("Emergency".equalsIgnoreCase(prediction.getUrgency())) {
            score += 35;
            drivers.add("Emergency symptom severity is present.");
        }
        if ("High".equalsIgnoreCase(prediction.getUrgency())) {
            score += 18;
            drivers.add("High urgency increases the chance of admission or escalation.");
        }
        if (request.getAge() >= 65) {
            score += 16;
            drivers.add("Older age raises the need for closer observation.");
        }
        if (chronicConditions.size() >= 2) {
            score += 16;
            drivers.add("Multiple chronic conditions increase readmission and escalation risk.");
        }
        if (containsAny(symptoms, "shortness of breath", "chest pain", "confusion", "fainting")) {
            score += 18;
            drivers.add("Symptoms suggest possible instability that may need urgent evaluation.");
        }
        if (request.getTemperature() >= 102.0) {
            score += 8;
            drivers.add("High fever can require closer monitoring.");
        }

        score = Math.min(100, score);
        String level = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

        actions.add("Escalate review if symptoms intensify or new red flags appear.");
        actions.add("Document vitals trend, hydration status, and medication response.");
        if ("High".equalsIgnoreCase(level) || "Emergency".equalsIgnoreCase(prediction.getUrgency())) {
            actions.add("Discuss emergency or inpatient evaluation rather than routine outpatient follow-up.");
        } else {
            actions.add("Arrange close outpatient follow-up and provide return precautions.");
        }

        AIInsightsResponse.AdmissionRisk risk = new AIInsightsResponse.AdmissionRisk();
        risk.setScore(score);
        risk.setLevel(level);
        risk.setDrivers(drivers);
        risk.setActions(actions);
        return risk;
    }

    private AIInsightsResponse.ReportSummary buildReportSummary(
            AIInsightsRequest request,
            AIInsightsResponse.DiseasePrediction prediction,
            List<String> symptoms,
            List<String> chronicConditions)
    {
        AIInsightsResponse.ReportSummary summary = new AIInsightsResponse.ReportSummary();
        List<String> highlights = new ArrayList<>();
        List<String> followUpQuestions = new ArrayList<>();
        String reportText = safeValue(request.getReportText(), "");

        highlights.add("Predicted pattern: " + prediction.getProbableCondition() + ".");
        if (!symptoms.isEmpty()) {
            highlights.add("Symptoms captured: " + String.join(", ", symptoms) + ".");
        }
        if (!chronicConditions.isEmpty()) {
            highlights.add("Chronic history noted: " + String.join(", ", chronicConditions) + ".");
        }
        if (!reportText.isEmpty()) {
            highlights.add("Report text was included for simplified interpretation.");
        }

        followUpQuestions.add("How long have these symptoms been present?");
        followUpQuestions.add("Have the symptoms become more severe since they started?");
        followUpQuestions.add("Are there any medicines or diagnoses not yet included in the form?");

        summary.setClinicalSummary("Clinical support summary: findings currently align with "
                + prediction.getProbableCondition()
                + ", with "
                + prediction.getUrgency().toLowerCase(Locale.ROOT)
                + " urgency and follow-up determined by symptom burden plus chronic risk.");

        summary.setPatientFriendlySummary(reportText.isEmpty()
                ? "No report text was provided, so this explanation is based on your symptoms and health profile. The assistant thinks the main issue fits "
                    + prediction.getProbableCondition()
                    + " and suggests the next visit based on urgency and specialist match."
                : "Your uploaded report or pasted note was simplified into a short explanation. The main concern still points toward "
                    + prediction.getProbableCondition()
                    + ", and the assistant is translating that into easier next steps for booking and follow-up.");

        summary.setHighlights(highlights);
        summary.setFollowUpQuestions(followUpQuestions);
        return summary;
    }

    private AIInsightsResponse.TriageChat buildTriageChat(
            AIInsightsRequest request,
            List<String> symptoms,
            AIInsightsResponse.DiseasePrediction prediction,
            AIInsightsResponse.SlotRecommendation slotRecommendation)
    {
        String question = safeValue(request.getQuestion(), "").toLowerCase(Locale.ROOT);
        String urgency = prediction.getUrgency();
        List<String> nextSteps = new ArrayList<>();
        List<String> followUpQuestions = new ArrayList<>();

        String response = "Based on the details provided, I would start with a clinician review of "
                + prediction.getProbableCondition()
                + " and confirm severity using your symptom history.";

        if (question.contains("emergency") || containsAny(symptoms, "chest pain", "shortness of breath", "fainting")) {
            urgency = "Emergency";
            response = "Your symptoms include warning signs that should be treated as urgent. Please seek emergency medical care or contact emergency services immediately.";
        } else if (question.contains("appointment") || question.contains("book")) {
            response = "You can book an appointment now. The assistant recommends the "
                    + slotRecommendation.getRecommendedSpecialization()
                    + " route first, and the best current slot guidance points to "
                    + safeValue(slotRecommendation.getRecommendedDate(), "the next available date")
                    + " during "
                    + safeValue(slotRecommendation.getRecommendedSlot(), "an open visit slot")
                    + ".";
        } else if (question.contains("medicine") || question.contains("tablet") || question.contains("prescription")) {
            response = "I can summarize supportive care ideas, but medication decisions still need a licensed clinician, especially when allergies or other medicines are involved.";
        } else if (question.contains("doctor")) {
            response = "I matched your case to a specialization based on symptoms, text understanding, and available doctor profiles. Use the recommendation panel to choose the best next appointment.";
        }

        nextSteps.add("Review the disease prediction summary and urgency level.");
        nextSteps.add("Use the doctor recommendation panel to pick the right specialty.");
        nextSteps.add("Review the slot recommendation panel before confirming the appointment.");
        nextSteps.add("If symptoms worsen quickly, skip routine booking and seek urgent care.");

        followUpQuestions.add("When did the current symptoms begin?");
        followUpQuestions.add("Is there any recent change in severity, breathing, pain, or temperature?");
        followUpQuestions.add("Would you like to book the recommended specialty now?");

        AIInsightsResponse.TriageChat chat = new AIInsightsResponse.TriageChat();
        chat.setUrgency(urgency);
        chat.setResponse(response);
        chat.setNextSteps(nextSteps);
        chat.setFollowUpQuestions(followUpQuestions);
        return chat;
    }

    private AIInsightsResponse.DoctorSuggestion mapDoctorSuggestion(
            Doctor doctor,
            String targetSpecialization,
            List<String> symptoms,
            AIInsightsResponse.DiseasePrediction prediction,
            AIInsightsResponse.SymptomTextAnalysis symptomTextAnalysis)
    {
        AIInsightsResponse.DoctorSuggestion suggestion = new AIInsightsResponse.DoctorSuggestion();
        suggestion.setDoctorname(doctor.getDoctorname());
        suggestion.setEmail(doctor.getEmail());
        suggestion.setSpecialization(doctor.getSpecialization());
        suggestion.setExperience(doctor.getExperience());

        int score = parseExperience(doctor);
        if (doctor.getSpecialization() != null
                && doctor.getSpecialization().toLowerCase(Locale.ROOT).contains(targetSpecialization.toLowerCase(Locale.ROOT))) {
            score += 45;
        }
        if (prediction.getUrgency().equalsIgnoreCase("Emergency")
                && doctor.getSpecialization() != null
                && doctor.getSpecialization().toLowerCase(Locale.ROOT).contains(symptomTextAnalysis.getRecommendedSpecialization().toLowerCase(Locale.ROOT))) {
            score += 10;
        }
        if (containsAny(symptoms, "fever", "cough") && containsText(doctor.getSpecialization(), "general", "pulmo")) {
            score += 8;
        }
        if (containsAny(symptoms, "rash", "itching") && containsText(doctor.getSpecialization(), "derma", "allerg")) {
            score += 8;
        }

        suggestion.setRankingScore(score);
        suggestion.setReason("Ranked using specialization fit, symptom profile, and experience. Score: " + score + ".");
        return suggestion;
    }

    private void appendSlotIfAvailable(
            List<AIInsightsResponse.SlotOption> target,
            Slots slot,
            String slotName,
            String status,
            String slotValue)
    {
        if (status == null || !"unbooked".equalsIgnoreCase(status.trim())) {
            return;
        }
        if (slotValue == null || slotValue.trim().isEmpty() || "empty".equalsIgnoreCase(slotValue.trim())) {
            return;
        }

        AIInsightsResponse.SlotOption option = new AIInsightsResponse.SlotOption();
        option.setDoctorname(slot.getDoctorname());
        option.setSpecialization(slot.getSpecialization());
        option.setDate(slot.getDate());
        option.setSlot(slotName);
        option.setStatus("Available");
        target.add(option);
    }

    private String buildPredictionSummary(String condition, String urgency, List<String> matched)
    {
        if (matched.isEmpty()) {
            return "Not enough symptom detail was provided for a strong match, so the system suggests a general review.";
        }
        return "The strongest pattern currently matches " + condition + " with " + urgency.toLowerCase(Locale.ROOT)
                + " urgency based on symptoms such as " + String.join(", ", matched) + ".";
    }

    private String chooseSpecialization(String requestedSpecialization, List<String> symptoms, String condition)
    {
        if (requestedSpecialization != null && !requestedSpecialization.trim().isEmpty()) {
            return requestedSpecialization.trim();
        }
        String normalizedCondition = safeValue(condition, "").toLowerCase(Locale.ROOT);
        if (normalizedCondition.contains("cardio") || containsAny(symptoms, "chest pain", "palpitations")) {
            return "Cardiologist";
        }
        if (normalizedCondition.contains("migraine") || containsAny(symptoms, "headache", "dizziness")) {
            return "Neurologist";
        }
        if (normalizedCondition.contains("skin") || containsAny(symptoms, "rash", "itching")) {
            return "Dermatologist";
        }
        if (normalizedCondition.contains("urinary")) {
            return "Urologist";
        }
        if (normalizedCondition.contains("gastro")) {
            return "Gastroenterologist";
        }
        if (normalizedCondition.contains("allergy")) {
            return "Allergist";
        }
        return "General Physician";
    }

    private List<String> extractSymptomsFromNarrative(String narrative)
    {
        if (narrative == null || narrative.trim().isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, List<String>> lexicon = new LinkedHashMap<>();
        lexicon.put("fever", Arrays.asList("fever", "temperature", "hot body"));
        lexicon.put("cough", Arrays.asList("cough", "coughing"));
        lexicon.put("fatigue", Arrays.asList("fatigue", "tired", "weakness"));
        lexicon.put("sore throat", Arrays.asList("sore throat", "throat pain"));
        lexicon.put("shortness of breath", Arrays.asList("shortness of breath", "breathless", "difficulty breathing"));
        lexicon.put("chest pain", Arrays.asList("chest pain", "pressure in chest"));
        lexicon.put("headache", Arrays.asList("headache", "head pain"));
        lexicon.put("dizziness", Arrays.asList("dizzy", "dizziness", "lightheaded"));
        lexicon.put("rash", Arrays.asList("rash", "skin rash"));
        lexicon.put("itching", Arrays.asList("itching", "itchy"));
        lexicon.put("nausea", Arrays.asList("nausea", "nauseated"));
        lexicon.put("vomiting", Arrays.asList("vomiting", "vomit"));
        lexicon.put("diarrhea", Arrays.asList("diarrhea", "loose stools"));
        lexicon.put("runny nose", Arrays.asList("runny nose", "nasal discharge"));
        lexicon.put("sneezing", Arrays.asList("sneezing", "sneeze"));

        String text = narrative.toLowerCase(Locale.ROOT);
        Set<String> detected = new LinkedHashSet<>();
        for (Map.Entry<String, List<String>> entry : lexicon.entrySet()) {
            boolean found = entry.getValue().stream().anyMatch(text::contains);
            if (found) {
                detected.add(entry.getKey());
            }
        }
        return new ArrayList<>(detected);
    }

    private List<String> normalizeList(List<String> values)
    {
        if (values == null) {
            return Collections.emptyList();
        }
        return values.stream()
                .filter(value -> value != null && !value.trim().isEmpty())
                .map(value -> value.trim().toLowerCase(Locale.ROOT))
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private List<String> mergeLists(List<String> first, List<String> second)
    {
        Set<String> merged = new LinkedHashSet<>();
        merged.addAll(first);
        merged.addAll(second);
        return new ArrayList<>(merged);
    }

    private boolean containsSymptom(List<String> symptoms, String symptom)
    {
        String needle = symptom.toLowerCase(Locale.ROOT);
        return symptoms.stream().anyMatch(item -> item.contains(needle));
    }

    private boolean containsAny(List<String> symptoms, String... values)
    {
        for (String value : values) {
            if (containsSymptom(symptoms, value)) {
                return true;
            }
        }
        return false;
    }

    private boolean containsText(String source, String... values)
    {
        String normalized = safeValue(source, "").toLowerCase(Locale.ROOT);
        for (String value : values) {
            if (normalized.contains(value.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private int parseExperience(Doctor doctor)
    {
        String experience = safeValue(doctor.getExperience(), "0");
        Matcher matcher = Pattern.compile("(\\d+)").matcher(experience);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return 0;
    }

    private String safeValue(String value, String fallback)
    {
        return value == null || value.trim().isEmpty() ? fallback : value;
    }
}

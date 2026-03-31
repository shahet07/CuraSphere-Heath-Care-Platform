package com.application.model;

import java.util.ArrayList;
import java.util.List;

public class AIInsightsResponse
{
    private SymptomTextAnalysis symptomTextAnalysis;
    private DiseasePrediction diseasePrediction;
    private DoctorRecommendation doctorRecommendation;
    private SlotRecommendation slotRecommendation;
    private NoShowPrediction noShowPrediction;
    private PrescriptionSupport prescriptionSupport;
    private PatientRisk patientRisk;
    private AdmissionRisk admissionRisk;
    private ReportSummary reportSummary;
    private TriageChat triageChat;

    public SymptomTextAnalysis getSymptomTextAnalysis() {
        return symptomTextAnalysis;
    }

    public void setSymptomTextAnalysis(SymptomTextAnalysis symptomTextAnalysis) {
        this.symptomTextAnalysis = symptomTextAnalysis;
    }

    public DiseasePrediction getDiseasePrediction() {
        return diseasePrediction;
    }

    public void setDiseasePrediction(DiseasePrediction diseasePrediction) {
        this.diseasePrediction = diseasePrediction;
    }

    public DoctorRecommendation getDoctorRecommendation() {
        return doctorRecommendation;
    }

    public void setDoctorRecommendation(DoctorRecommendation doctorRecommendation) {
        this.doctorRecommendation = doctorRecommendation;
    }

    public SlotRecommendation getSlotRecommendation() {
        return slotRecommendation;
    }

    public void setSlotRecommendation(SlotRecommendation slotRecommendation) {
        this.slotRecommendation = slotRecommendation;
    }

    public NoShowPrediction getNoShowPrediction() {
        return noShowPrediction;
    }

    public void setNoShowPrediction(NoShowPrediction noShowPrediction) {
        this.noShowPrediction = noShowPrediction;
    }

    public PrescriptionSupport getPrescriptionSupport() {
        return prescriptionSupport;
    }

    public void setPrescriptionSupport(PrescriptionSupport prescriptionSupport) {
        this.prescriptionSupport = prescriptionSupport;
    }

    public PatientRisk getPatientRisk() {
        return patientRisk;
    }

    public void setPatientRisk(PatientRisk patientRisk) {
        this.patientRisk = patientRisk;
    }

    public AdmissionRisk getAdmissionRisk() {
        return admissionRisk;
    }

    public void setAdmissionRisk(AdmissionRisk admissionRisk) {
        this.admissionRisk = admissionRisk;
    }

    public ReportSummary getReportSummary() {
        return reportSummary;
    }

    public void setReportSummary(ReportSummary reportSummary) {
        this.reportSummary = reportSummary;
    }

    public TriageChat getTriageChat() {
        return triageChat;
    }

    public void setTriageChat(TriageChat triageChat) {
        this.triageChat = triageChat;
    }

    public static class SymptomTextAnalysis
    {
        private String normalizedNarrative;
        private String clinicalIntent;
        private String recommendedSpecialization;
        private String triagePriority;
        private List<String> detectedSymptoms = new ArrayList<>();
        private List<String> urgencySignals = new ArrayList<>();

        public String getNormalizedNarrative() {
            return normalizedNarrative;
        }

        public void setNormalizedNarrative(String normalizedNarrative) {
            this.normalizedNarrative = normalizedNarrative;
        }

        public String getClinicalIntent() {
            return clinicalIntent;
        }

        public void setClinicalIntent(String clinicalIntent) {
            this.clinicalIntent = clinicalIntent;
        }

        public String getRecommendedSpecialization() {
            return recommendedSpecialization;
        }

        public void setRecommendedSpecialization(String recommendedSpecialization) {
            this.recommendedSpecialization = recommendedSpecialization;
        }

        public String getTriagePriority() {
            return triagePriority;
        }

        public void setTriagePriority(String triagePriority) {
            this.triagePriority = triagePriority;
        }

        public List<String> getDetectedSymptoms() {
            return detectedSymptoms;
        }

        public void setDetectedSymptoms(List<String> detectedSymptoms) {
            this.detectedSymptoms = detectedSymptoms;
        }

        public List<String> getUrgencySignals() {
            return urgencySignals;
        }

        public void setUrgencySignals(List<String> urgencySignals) {
            this.urgencySignals = urgencySignals;
        }
    }

    public static class DiseasePrediction
    {
        private String probableCondition;
        private int confidence;
        private String urgency;
        private String summary;
        private List<String> matchedSymptoms = new ArrayList<>();

        public String getProbableCondition() {
            return probableCondition;
        }

        public void setProbableCondition(String probableCondition) {
            this.probableCondition = probableCondition;
        }

        public int getConfidence() {
            return confidence;
        }

        public void setConfidence(int confidence) {
            this.confidence = confidence;
        }

        public String getUrgency() {
            return urgency;
        }

        public void setUrgency(String urgency) {
            this.urgency = urgency;
        }

        public String getSummary() {
            return summary;
        }

        public void setSummary(String summary) {
            this.summary = summary;
        }

        public List<String> getMatchedSymptoms() {
            return matchedSymptoms;
        }

        public void setMatchedSymptoms(List<String> matchedSymptoms) {
            this.matchedSymptoms = matchedSymptoms;
        }
    }

    public static class DoctorRecommendation
    {
        private String recommendedSpecialization;
        private String rationale;
        private List<DoctorSuggestion> doctors = new ArrayList<>();

        public String getRecommendedSpecialization() {
            return recommendedSpecialization;
        }

        public void setRecommendedSpecialization(String recommendedSpecialization) {
            this.recommendedSpecialization = recommendedSpecialization;
        }

        public String getRationale() {
            return rationale;
        }

        public void setRationale(String rationale) {
            this.rationale = rationale;
        }

        public List<DoctorSuggestion> getDoctors() {
            return doctors;
        }

        public void setDoctors(List<DoctorSuggestion> doctors) {
            this.doctors = doctors;
        }
    }

    public static class DoctorSuggestion
    {
        private String doctorname;
        private String email;
        private String specialization;
        private String experience;
        private String reason;
        private int rankingScore;

        public String getDoctorname() {
            return doctorname;
        }

        public void setDoctorname(String doctorname) {
            this.doctorname = doctorname;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getSpecialization() {
            return specialization;
        }

        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }

        public String getExperience() {
            return experience;
        }

        public void setExperience(String experience) {
            this.experience = experience;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        public int getRankingScore() {
            return rankingScore;
        }

        public void setRankingScore(int rankingScore) {
            this.rankingScore = rankingScore;
        }
    }

    public static class SlotRecommendation
    {
        private String recommendedDate;
        private String recommendedSlot;
        private String recommendedDoctor;
        private String recommendedSpecialization;
        private String rationale;
        private List<SlotOption> alternatives = new ArrayList<>();

        public String getRecommendedDate() {
            return recommendedDate;
        }

        public void setRecommendedDate(String recommendedDate) {
            this.recommendedDate = recommendedDate;
        }

        public String getRecommendedSlot() {
            return recommendedSlot;
        }

        public void setRecommendedSlot(String recommendedSlot) {
            this.recommendedSlot = recommendedSlot;
        }

        public String getRecommendedDoctor() {
            return recommendedDoctor;
        }

        public void setRecommendedDoctor(String recommendedDoctor) {
            this.recommendedDoctor = recommendedDoctor;
        }

        public String getRecommendedSpecialization() {
            return recommendedSpecialization;
        }

        public void setRecommendedSpecialization(String recommendedSpecialization) {
            this.recommendedSpecialization = recommendedSpecialization;
        }

        public String getRationale() {
            return rationale;
        }

        public void setRationale(String rationale) {
            this.rationale = rationale;
        }

        public List<SlotOption> getAlternatives() {
            return alternatives;
        }

        public void setAlternatives(List<SlotOption> alternatives) {
            this.alternatives = alternatives;
        }
    }

    public static class SlotOption
    {
        private String doctorname;
        private String specialization;
        private String date;
        private String slot;
        private String status;

        public String getDoctorname() {
            return doctorname;
        }

        public void setDoctorname(String doctorname) {
            this.doctorname = doctorname;
        }

        public String getSpecialization() {
            return specialization;
        }

        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getSlot() {
            return slot;
        }

        public void setSlot(String slot) {
            this.slot = slot;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class NoShowPrediction
    {
        private int riskScore;
        private String riskLevel;
        private List<String> drivers = new ArrayList<>();
        private List<String> actions = new ArrayList<>();

        public int getRiskScore() {
            return riskScore;
        }

        public void setRiskScore(int riskScore) {
            this.riskScore = riskScore;
        }

        public String getRiskLevel() {
            return riskLevel;
        }

        public void setRiskLevel(String riskLevel) {
            this.riskLevel = riskLevel;
        }

        public List<String> getDrivers() {
            return drivers;
        }

        public void setDrivers(List<String> drivers) {
            this.drivers = drivers;
        }

        public List<String> getActions() {
            return actions;
        }

        public void setActions(List<String> actions) {
            this.actions = actions;
        }
    }

    public static class PrescriptionSupport
    {
        private String summary;
        private List<String> suggestions = new ArrayList<>();
        private List<String> alerts = new ArrayList<>();
        private String disclaimer;

        public String getSummary() {
            return summary;
        }

        public void setSummary(String summary) {
            this.summary = summary;
        }

        public List<String> getSuggestions() {
            return suggestions;
        }

        public void setSuggestions(List<String> suggestions) {
            this.suggestions = suggestions;
        }

        public List<String> getAlerts() {
            return alerts;
        }

        public void setAlerts(List<String> alerts) {
            this.alerts = alerts;
        }

        public String getDisclaimer() {
            return disclaimer;
        }

        public void setDisclaimer(String disclaimer) {
            this.disclaimer = disclaimer;
        }
    }

    public static class PatientRisk
    {
        private int score;
        private String level;
        private List<String> contributors = new ArrayList<>();
        private List<String> recommendations = new ArrayList<>();

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public String getLevel() {
            return level;
        }

        public void setLevel(String level) {
            this.level = level;
        }

        public List<String> getContributors() {
            return contributors;
        }

        public void setContributors(List<String> contributors) {
            this.contributors = contributors;
        }

        public List<String> getRecommendations() {
            return recommendations;
        }

        public void setRecommendations(List<String> recommendations) {
            this.recommendations = recommendations;
        }
    }

    public static class AdmissionRisk
    {
        private int score;
        private String level;
        private List<String> drivers = new ArrayList<>();
        private List<String> actions = new ArrayList<>();

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public String getLevel() {
            return level;
        }

        public void setLevel(String level) {
            this.level = level;
        }

        public List<String> getDrivers() {
            return drivers;
        }

        public void setDrivers(List<String> drivers) {
            this.drivers = drivers;
        }

        public List<String> getActions() {
            return actions;
        }

        public void setActions(List<String> actions) {
            this.actions = actions;
        }
    }

    public static class ReportSummary
    {
        private String clinicalSummary;
        private String patientFriendlySummary;
        private List<String> highlights = new ArrayList<>();
        private List<String> followUpQuestions = new ArrayList<>();

        public String getClinicalSummary() {
            return clinicalSummary;
        }

        public void setClinicalSummary(String clinicalSummary) {
            this.clinicalSummary = clinicalSummary;
        }

        public String getPatientFriendlySummary() {
            return patientFriendlySummary;
        }

        public void setPatientFriendlySummary(String patientFriendlySummary) {
            this.patientFriendlySummary = patientFriendlySummary;
        }

        public List<String> getHighlights() {
            return highlights;
        }

        public void setHighlights(List<String> highlights) {
            this.highlights = highlights;
        }

        public List<String> getFollowUpQuestions() {
            return followUpQuestions;
        }

        public void setFollowUpQuestions(List<String> followUpQuestions) {
            this.followUpQuestions = followUpQuestions;
        }
    }

    public static class TriageChat
    {
        private String urgency;
        private String response;
        private List<String> nextSteps = new ArrayList<>();
        private List<String> followUpQuestions = new ArrayList<>();

        public String getUrgency() {
            return urgency;
        }

        public void setUrgency(String urgency) {
            this.urgency = urgency;
        }

        public String getResponse() {
            return response;
        }

        public void setResponse(String response) {
            this.response = response;
        }

        public List<String> getNextSteps() {
            return nextSteps;
        }

        public void setNextSteps(List<String> nextSteps) {
            this.nextSteps = nextSteps;
        }

        public List<String> getFollowUpQuestions() {
            return followUpQuestions;
        }

        public void setFollowUpQuestions(List<String> followUpQuestions) {
            this.followUpQuestions = followUpQuestions;
        }
    }
}

package com.application.model;

import java.util.ArrayList;
import java.util.List;

public class AIInsightsRequest
{
    private String patientName;
    private String email;
    private String gender;
    private String specializationPreference;
    private String question;
    private String symptomNarrative;
    private String reportText;
    private String preferredDate;
    private int age;
    private double temperature;
    private double bmi;
    private double distanceKm;
    private int missedAppointments;
    private int leadTimeDays;
    private int stressLevel;
    private int sleepHours;
    private int painLevel;
    private boolean smoker;
    private boolean alcoholUse;
    private boolean familyHistory;
    private boolean hasReminder;
    private boolean weekendAppointment;
    private List<String> symptoms = new ArrayList<>();
    private List<String> chronicConditions = new ArrayList<>();
    private List<String> allergies = new ArrayList<>();
    private List<String> currentMedicines = new ArrayList<>();

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getSpecializationPreference() {
        return specializationPreference;
    }

    public void setSpecializationPreference(String specializationPreference) {
        this.specializationPreference = specializationPreference;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getSymptomNarrative() {
        return symptomNarrative;
    }

    public void setSymptomNarrative(String symptomNarrative) {
        this.symptomNarrative = symptomNarrative;
    }

    public String getReportText() {
        return reportText;
    }

    public void setReportText(String reportText) {
        this.reportText = reportText;
    }

    public String getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(String preferredDate) {
        this.preferredDate = preferredDate;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getBmi() {
        return bmi;
    }

    public void setBmi(double bmi) {
        this.bmi = bmi;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public int getMissedAppointments() {
        return missedAppointments;
    }

    public void setMissedAppointments(int missedAppointments) {
        this.missedAppointments = missedAppointments;
    }

    public int getLeadTimeDays() {
        return leadTimeDays;
    }

    public void setLeadTimeDays(int leadTimeDays) {
        this.leadTimeDays = leadTimeDays;
    }

    public int getStressLevel() {
        return stressLevel;
    }

    public void setStressLevel(int stressLevel) {
        this.stressLevel = stressLevel;
    }

    public int getSleepHours() {
        return sleepHours;
    }

    public void setSleepHours(int sleepHours) {
        this.sleepHours = sleepHours;
    }

    public int getPainLevel() {
        return painLevel;
    }

    public void setPainLevel(int painLevel) {
        this.painLevel = painLevel;
    }

    public boolean isSmoker() {
        return smoker;
    }

    public void setSmoker(boolean smoker) {
        this.smoker = smoker;
    }

    public boolean isAlcoholUse() {
        return alcoholUse;
    }

    public void setAlcoholUse(boolean alcoholUse) {
        this.alcoholUse = alcoholUse;
    }

    public boolean isFamilyHistory() {
        return familyHistory;
    }

    public void setFamilyHistory(boolean familyHistory) {
        this.familyHistory = familyHistory;
    }

    public boolean isHasReminder() {
        return hasReminder;
    }

    public void setHasReminder(boolean hasReminder) {
        this.hasReminder = hasReminder;
    }

    public boolean isWeekendAppointment() {
        return weekendAppointment;
    }

    public void setWeekendAppointment(boolean weekendAppointment) {
        this.weekendAppointment = weekendAppointment;
    }

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public List<String> getChronicConditions() {
        return chronicConditions;
    }

    public void setChronicConditions(List<String> chronicConditions) {
        this.chronicConditions = chronicConditions;
    }

    public List<String> getAllergies() {
        return allergies;
    }

    public void setAllergies(List<String> allergies) {
        this.allergies = allergies;
    }

    public List<String> getCurrentMedicines() {
        return currentMedicines;
    }

    public void setCurrentMedicines(List<String> currentMedicines) {
        this.currentMedicines = currentMedicines;
    }
}

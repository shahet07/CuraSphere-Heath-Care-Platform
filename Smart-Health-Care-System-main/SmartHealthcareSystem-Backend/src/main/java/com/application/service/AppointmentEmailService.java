package com.application.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.application.model.Appointments;

@Service
public class AppointmentEmailService 
{
	private final JavaMailSender mailSender;
	private final String fromAddress;

	public AppointmentEmailService(JavaMailSender mailSender, @Value("${app.mail.from:}") String fromAddress) 
	{
		this.mailSender = mailSender;
		this.fromAddress = fromAddress;
	}

	public void sendAppointmentBookedEmail(Appointments appointment)
	{
		if(appointment == null || appointment.getEmail() == null || appointment.getEmail().isBlank())
		{
			return;
		}

		if(fromAddress == null || fromAddress.isBlank())
		{
			throw new IllegalStateException("Appointment email is not configured. Set MAIL_USERNAME / MAIL_PASSWORD / MAIL_FROM first.");
		}

		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(appointment.getEmail());
		message.setFrom(fromAddress);
		message.setSubject("Appointment booked successfully - Smart Healthcare System");
		message.setText(buildEmailBody(appointment));
		mailSender.send(message);
	}

	private String buildEmailBody(Appointments appointment)
	{
		return "Hello " + safe(appointment.getPatientname()) + ",\n\n"
				+ "Your appointment has been booked successfully.\n\n"
				+ "Appointment details:\n"
				+ "Patient ID: " + safe(appointment.getPatientid()) + "\n"
				+ "Doctor: " + safe(appointment.getDoctorname()) + "\n"
				+ "Specialization: " + safe(appointment.getSpecialization()) + "\n"
				+ "Date: " + safe(appointment.getDate()) + "\n"
				+ "Time / Slot: " + safe(appointment.getSlot()) + "\n"
				+ "Problem / Reason: " + safe(appointment.getProblem()) + "\n"
				+ "Status: Pending doctor approval\n\n"
				+ "Please keep this email for your records.\n\n"
				+ "Thank you,\n"
				+ "Smart Healthcare System";
	}

	private String safe(String value)
	{
		return value == null || value.isBlank() ? "Not provided" : value;
	}
}

package com.application;

import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.cache.annotation.EnableCaching;

import com.application.model.Doctor;
import com.application.model.Slots;
import com.application.repository.DoctorRegistrationRepository;
import com.application.repository.SlotBookingRepository;

@SpringBootApplication
@EnableCaching
public class HealthcareManagementBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthcareManagementBackendApplication.class, args);
		System.out.println("Project Running");
	}

	@Bean
	CommandLineRunner seedDemoData(DoctorRegistrationRepository doctorRepository, SlotBookingRepository slotRepository)
	{
		return args -> {
			if(doctorRepository.count() == 0)
			{
				doctorRepository.save(new Doctor(
					"maya.care@curasphere.com",
					"Dr Maya Reddy",
					"4085551201",
					"Female",
					"12 years",
					"General Physician",
					"Santa Clara Medical Center",
					"431 El Camino Real, Santa Clara",
					"Doctor@123",
					"accept"
				));
				doctorRepository.save(new Doctor(
					"adrian.heart@curasphere.com",
					"Dr Adrian Cole",
					"4085551202",
					"Male",
					"15 years",
					"Cardiologist",
					"Bay Heart Institute",
					"920 Benton Street, Santa Clara",
					"Doctor@123",
					"accept"
				));
				doctorRepository.save(new Doctor(
					"nina.allergy@curasphere.com",
					"Dr Nina Kapoor",
					"4085551203",
					"Female",
					"9 years",
					"Allergist",
					"Westside Specialty Clinic",
					"5151 Great America Pkwy, Santa Clara",
					"Doctor@123",
					"accept"
				));
				doctorRepository.save(new Doctor(
					"ethan.neuro@curasphere.com",
					"Dr Ethan Brooks",
					"4085551204",
					"Male",
					"11 years",
					"Neurologist",
					"NeuroCare Pavilion",
					"2900 Lakeside Drive, Santa Clara",
					"Doctor@123",
					"accept"
				));
			}

			if(slotRepository.count() == 0)
			{
				LocalDate startDate = LocalDate.now().plusDays(1);
				saveSlot(slotRepository, "maya.care@curasphere.com", "Dr Maya Reddy", "General Physician", startDate.plusDays(0).toString());
				saveSlot(slotRepository, "maya.care@curasphere.com", "Dr Maya Reddy", "General Physician", startDate.plusDays(1).toString());
				saveSlot(slotRepository, "adrian.heart@curasphere.com", "Dr Adrian Cole", "Cardiologist", startDate.plusDays(0).toString());
				saveSlot(slotRepository, "adrian.heart@curasphere.com", "Dr Adrian Cole", "Cardiologist", startDate.plusDays(2).toString());
				saveSlot(slotRepository, "nina.allergy@curasphere.com", "Dr Nina Kapoor", "Allergist", startDate.plusDays(1).toString());
				saveSlot(slotRepository, "nina.allergy@curasphere.com", "Dr Nina Kapoor", "Allergist", startDate.plusDays(3).toString());
				saveSlot(slotRepository, "ethan.neuro@curasphere.com", "Dr Ethan Brooks", "Neurologist", startDate.plusDays(2).toString());
				saveSlot(slotRepository, "ethan.neuro@curasphere.com", "Dr Ethan Brooks", "Neurologist", startDate.plusDays(4).toString());
			}
		};
	}

	private void saveSlot(SlotBookingRepository slotRepository, String email, String doctorname, String specialization, String date)
	{
		Slots slot = new Slots();
		slot.setEmail(email);
		slot.setDoctorname(doctorname);
		slot.setSpecialization(specialization);
		slot.setDate(date);
		slot.setAmslot("09:00 AM - 11:00 AM");
		slot.setAmstatus("unbooked");
		slot.setNoonslot("12:00 PM - 02:00 PM");
		slot.setNoonstatus("unbooked");
		slot.setPmslot("04:00 PM - 06:00 PM");
		slot.setPmstatus("unbooked");
		slot.setPatienttype("All");
		slotRepository.save(slot);
	}

}

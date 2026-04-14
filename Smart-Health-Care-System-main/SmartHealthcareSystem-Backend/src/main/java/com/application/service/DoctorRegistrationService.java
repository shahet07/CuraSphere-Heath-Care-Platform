package com.application.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import com.application.model.Doctor;
import com.application.repository.DoctorRegistrationRepository;

@Service
public class DoctorRegistrationService 
{
	@Autowired
	private DoctorRegistrationRepository doctorRegistrationRepo;
	
	@CacheEvict(value = {"doctorCatalog", "slotCatalog", "slotCatalogByEmail"}, allEntries = true)
	public Doctor saveDoctor(Doctor  doctor)
	{
		return doctorRegistrationRepo.save(doctor);
	}
	
	@CacheEvict(value = {"doctorCatalog", "slotCatalog", "slotCatalogByEmail"}, allEntries = true)
	public Doctor updateDoctorProfile(Doctor doctor)
	{
		return doctorRegistrationRepo.save(doctor);
	}
	
	@Cacheable("doctorCatalog")
	public List<Doctor> getAllDoctors()
	{
		return (List<Doctor>)doctorRegistrationRepo.findAll();
	}
	
	@CacheEvict(value = {"doctorCatalog", "slotCatalog", "slotCatalogByEmail"}, allEntries = true)
	public void updateStatus(String email)
	{
		doctorRegistrationRepo.updateStatus(email);
	}
	
	@CacheEvict(value = {"doctorCatalog", "slotCatalog", "slotCatalogByEmail"}, allEntries = true)
	public void rejectStatus(String email)
	{
		doctorRegistrationRepo.rejectStatus(email);
		System.out.print("rejected");
	}
	
	public void updatePatientStatus(String slot, String doctorname)
	{
		doctorRegistrationRepo.updatePatientStatus(slot, doctorname);
	}
	
	public void rejectPatientStatus(String slot, String doctorname)
	{
		doctorRegistrationRepo.rejectPatientStatus(slot, doctorname);
		System.out.print("rejected");
	}
	
	public List<Doctor> getDoctorListByEmail(String email) 
	{
		return (List<Doctor>)doctorRegistrationRepo.findDoctorListByEmail(email);
	}
	
	public Doctor fetchDoctorByEmail(String email)
	{
		return doctorRegistrationRepo.findByEmail(email);
	}
	
	public Doctor fetchDoctorByDoctorname(String doctorname)
	{
		return doctorRegistrationRepo.findByDoctorname(doctorname);
	}
	
	public Doctor fetchDoctorByEmailAndPassword(String email, String password)
	{
		return doctorRegistrationRepo.findByEmailAndPassword(email, password);
	}
	
	public List<Doctor> fetchProfileByEmail(String email)
	{
		List<Doctor> doctors = new ArrayList<>();
		Doctor doctor = doctorRegistrationRepo.findByEmail(email);
		if(doctor != null)
		{
			doctors.add(doctor);
		}
		return doctors;
	}

}

export const getDoctors = async () => {
	try {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/doctors`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Fetching doctors failed:", error);
		throw error;
	}
};

export const getDoctor = async (id) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/doctors/${id}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Fetching doctor failed:", error);
		throw error;
	}
};

export const getAvailableDoctorsForToday = async (patientId) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/doctors/available-today-for/${patientId}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Fetching appointments failed:", error);
		throw error;
	}
};

export const getAppointmentsForAPatient = async (patientId) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/appointments/patient/${patientId}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Fetching appointments failed:", error);
		throw error;
	}
};

export const getAppointmentsForAPatientForToday = async (patientId) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/appointments/today/${patientId}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Fetching appointments failed:", error);
		throw error;
	}
};

export const getHealthTips = async () => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/health-tips`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Fetching appointments failed:", error);
		throw error;
	}
};

export const createAppointment = async (appointmentData) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/appointments`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(appointmentData),
			}
		);
		if (!response.ok) {
			let errorMessage =
				"There was an issue creating the appointment. Please try again later.";
			const responseBody = await response.json();
			if (responseBody && responseBody.error) {
				errorMessage = responseBody.error;
			}
			alert(errorMessage);
		}
		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const getTheDetailedAppointmentInfo = async (appointmentId) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/appointments/${appointmentId}`
		);
		if (!response.ok) {
			let errorMessage =
				"There was an issue getting the appointment info. Please try again later.";
			const responseBody = await response.json();
			if (responseBody && responseBody.error) {
				errorMessage = responseBody.error;
			}
			alert(errorMessage);
		}
		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const sendMail = async (
	nameOfReciever,
	mailOfReciever,
	mailSubject,
	mailBodyIntro,
	mailBodyOutro
) => {
	try {
		if (
			nameOfReciever &&
			mailOfReciever &&
			mailSubject &&
			mailBodyIntro &&
			mailBodyOutro
		) {
			const mailInfoData = {
				nameOfReciever,
				mailOfReciever,
				mailSubject,
				mailBodyIntro,
				mailBodyOutro,
			};
			const response = await fetch(`${process.env.REACT_APP_API_URL}/mail`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(mailInfoData),
			});
			if (!response.ok) {
				let errorMessage = "There was an issue sending the email...";
				const responseBody = await response.json();
				if (responseBody && responseBody.error) {
					errorMessage = responseBody.error;
				}
				alert(errorMessage);
			}
			return await response.json();
		} else {
			let errorMessage = "Please Provide Valid Info to make the mail...";
			alert(errorMessage);
			return null;
		}
	} catch (error) {
		throw error;
	}
};

const apiService = {
	getDoctors,
	getDoctor,
	getAppointmentsForAPatient,
	createAppointment,
	getHealthTips,
	getAvailableDoctorsForToday,
	getAppointmentsForAPatientForToday,
	getTheDetailedAppointmentInfo,
	sendMail,
};

export default apiService;

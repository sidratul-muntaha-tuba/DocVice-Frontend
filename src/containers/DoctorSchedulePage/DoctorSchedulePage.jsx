import React, { useEffect, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/red.css";
import Calender from "../../components/Common/Calender/Calender";
import { useAuth } from "../../contexts/AuthContext";
import "./DoctorSchedulePage.scss";

const DoctorSchedulePage = () => {
	const { auth } = useAuth();
	const doctorId = auth.user.id;

	const [timeSegments, setTimeSegments] = useState([
		[],
		[],
		[],
		[],
		[],
		[],
		[],
	]);
	const [isThereAnyPreviousShcedule, setIsThereAnyPreviousShcedule] =
		useState(false);
	const [selectedOffDates, setSelectedOffDates] = useState([]);
	const [responseGot, setResponseGot] = useState(null);
	const [saveButtonShouldBeShown, setSaveButtonShouldBeShown] = useState(false);
	const [howManyMinutesForOnePatient, setHowManyMinutesForOnePatient] =
		useState(10);
	const [todayDay, setTodayDay] = useState(new Date().getDay());
	const [fromWhenSchedulesShouldStart, setFromWhenSchedulesShouldStart] = useState(
		new Date()
	);

	const handleOffDatesChange = (dates) => {
		const formattedDates = dates
			.map((singleDate) => {
				const selectedDate = parseInt(singleDate.day);
				const selectedMonth = parseInt(singleDate.month.number);
				const selectedYear = parseInt(singleDate.year);
				return new Date(
					Date.UTC(selectedYear, selectedMonth - 1, selectedDate)
				);
			})
			.filter((date) => date !== null)
			.map((date) => date.toISOString().substring(0, 10)); // Convert to ISO string format (YYYY-MM-DD)

		setSelectedOffDates(formattedDates);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setTodayDay(new Date().getDay());
		}, 10000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (
			(responseGot &&
				(responseGot?.offDays !== selectedOffDates ||
					responseGot?.activeHours !== timeSegments ||
					responseGot?.onePatientVisitingTime !==
						howManyMinutesForOnePatient)) ||
			(!responseGot &&
				(selectedOffDates.length ||
					timeSegments.reduce(
						(accumulator, item) => accumulator + item.length,
						0
					) ||
					howManyMinutesForOnePatient !== 10))
		) {
			setSaveButtonShouldBeShown(true);
		} else {
			setSaveButtonShouldBeShown(false);
		}
	}, [
		responseGot,
		selectedOffDates,
		timeSegments,
		howManyMinutesForOnePatient,
	]);

	const fetchWeeklySchedules = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/doctor-schedule/${doctorId}`
			);
			if (response.ok) {
				const data = await response.json();
				setResponseGot(data);
				setSelectedOffDates(data.offDays);
				setTimeSegments(data.activeHours);
				setHowManyMinutesForOnePatient(data.onePatientVisitingTime);
				setIsThereAnyPreviousShcedule(true);
				let scheduleStartingDate = new Date();
				let doctorJoiningDate = new Date();
				if (data.createdAt) {
					scheduleStartingDate = new Date(data.createdAt);
				}
				if (data.doctor.createdAt) {
					doctorJoiningDate = new Date(data.doctor.createdAt);
				}
				if (scheduleStartingDate > doctorJoiningDate) {
					setFromWhenSchedulesShouldStart(doctorJoiningDate);
				} else {
					setFromWhenSchedulesShouldStart(scheduleStartingDate);
				}
			} else {
				setIsThereAnyPreviousShcedule(false);
				throw new Error("Failed to fetch data");
			}
		} catch (error) {
			console.log("Errror Happened.", error.message);
		}
	};

	useEffect(() => {
		fetchWeeklySchedules();
	}, [doctorId]);

	const addTimeSegment = (dayIndex) => {
		const updatedSegments = [...timeSegments];
		updatedSegments[dayIndex] = [
			...updatedSegments[dayIndex],
			{ startTime: "", endTime: "" },
		];
		setTimeSegments(updatedSegments);
	};

	const removeTimeSegment = (dayIndex, segmentIndex) => {
		const updatedSegments = [...timeSegments];
		updatedSegments[dayIndex] = updatedSegments[dayIndex].filter(
			(_, index) => index !== segmentIndex
		);
		setTimeSegments(updatedSegments);
	};

	const validateAndUpdateTimeSegments = (
		startTime,
		endTime,
		updatedSegments,
		dayIndex
	) => {
		setTodayDay(new Date().getDay());

		if (dayIndex === todayDay) {
			alert("You cannot modify time segments for the current day.");
			return;
		}

		if (startTime && endTime) {
			const timeDifference = Math.abs(
				(new Date(`1999-01-20T${endTime}:00Z`) -
					new Date(`1999-01-20T${startTime}:00Z`)) /
					60000
			);

			if (
				timeDifference >= howManyMinutesForOnePatient &&
				!checkForOverlap(updatedSegments[dayIndex])
			) {
				setTimeSegments(updatedSegments);
			} else {
				let errorMessage = "";
				if (timeDifference < howManyMinutesForOnePatient) {
					errorMessage =
						"End time should be at least " +
						howManyMinutesForOnePatient +
						" minutes apart from start time.";
				} else {
					errorMessage = "Overlapping time segments are not allowed.";
				}
				alert(errorMessage);
			}
		} else {
			if (startTime) {
				setTimeSegments(updatedSegments);
			}
		}
	};

	// Function to check for overlapping time segments
	const checkForOverlap = (segments) => {
		for (let i = 0; i < segments.length - 1; i++) {
			const startTime1 = segments[i].startTime;
			const endTime1 = segments[i].endTime;

			for (let j = i + 1; j < segments.length; j++) {
				const startTime2 = segments[j].startTime;
				const endTime2 = segments[j].endTime;

				if (
					(startTime1 >= startTime2 && startTime1 < endTime2) ||
					(endTime1 > startTime2 && endTime1 <= endTime2) ||
					(startTime2 >= startTime1 && startTime2 < endTime1) ||
					(endTime2 > startTime1 && endTime2 <= endTime1)
				) {
					return true; // Overlapping segments found
				}
			}
		}
		return false; // No overlapping segments
	};

	const saveSchedule = async () => {
		const filteredSegments = timeSegments.map((daySegments) =>
			daySegments.filter(
				(segment) => segment.startTime !== "" && segment.endTime !== ""
			)
		);
		const methodForRequest = isThereAnyPreviousShcedule ? "PUT" : "POST";
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/doctor-schedule`,
				{
					method: methodForRequest,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						doctorId: doctorId,
						activeHours: filteredSegments,
						offDays: selectedOffDates,
						onePatientVisitingTime: howManyMinutesForOnePatient,
					}),
				}
			);

			if (response.ok) {
				fetchWeeklySchedules();
				alert("Schedules set successfully!");
				setIsThereAnyPreviousShcedule(false);
			} else {
				alert("Failed to set Schedules!");
				setIsThereAnyPreviousShcedule(true);
			}
		} catch (error) {
			alert("Error to process the schedules");
		}
	};

	return (
		<div>
			{saveButtonShouldBeShown && (
				<button onClick={saveSchedule} className="save-button">
					Save
				</button>
			)}
			<div className="doctor-schedule-page">
				<div className="schedule-section">
					<h2>Set Working Schedules</h2>
					{[
						"Sunday",
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday",
						"Saturday",
					].map((dayOfWeek, dayIndex) => (
						<div className="week-wise-section" key={dayIndex}>
							<h3>{dayOfWeek}</h3>
							{timeSegments[dayIndex].map((segment, segmentIndex) => (
								<div key={segmentIndex} className="time-segment">
									<div>
										<label>Start Time</label>
										<br />
										<input
											disabled={dayIndex === todayDay}
											type="time"
											value={segment.startTime}
											onChange={(event) => {
												const startTimeValue = event.target.value;
												const updatedSegments = [...timeSegments];
												updatedSegments[dayIndex][segmentIndex].startTime =
													startTimeValue;
												const endTimeValue =
													updatedSegments[dayIndex][segmentIndex].endTime;
												validateAndUpdateTimeSegments(
													startTimeValue,
													endTimeValue,
													updatedSegments,
													dayIndex
												);
											}}
										/>
									</div>
									{segment.startTime && (
										<div>
											<label>End Time</label>
											<br />
											<input
												disabled={dayIndex === todayDay}
												type="time"
												value={segment.endTime}
												onChange={(event) => {
													const endTimeValue = event.target.value;
													const updatedSegments = [...timeSegments];
													updatedSegments[dayIndex][segmentIndex].endTime =
														endTimeValue;
													const startTimeValue =
														updatedSegments[dayIndex][segmentIndex].startTime;
													validateAndUpdateTimeSegments(
														startTimeValue,
														endTimeValue,
														updatedSegments,
														dayIndex
													);
												}}
											/>
										</div>
									)}
									<button
										disabled={dayIndex === todayDay}
										onClick={() => removeTimeSegment(dayIndex, segmentIndex)}
										className="remove-button"
										style={
											dayIndex === todayDay
												? { backgroundColor: "#c0c0c0", cursor: "no-drop" }
												: {}
										}>
										Remove
									</button>
								</div>
							))}
							<button
								disabled={dayIndex === todayDay}
								onClick={() => addTimeSegment(dayIndex)}
								style={
									dayIndex === todayDay
										? { backgroundColor: "#c0c0c0", cursor: "no-drop" }
										: {}
								}
								className="add-button">
								Add Time
							</button>
						</div>
					))}
				</div>
				<div>
					<div style={{ marginBottom: "4rem" }}>
						<h2>Select Time For One Patient</h2>
						<input
							style={{ padding: "4px", fontSize: "18px", width: "100px" }}
							type="number"
							value={howManyMinutesForOnePatient}
							onChange={(e) => {
								const timeToSet = parseInt(e.target.value);
								if (timeToSet >= 5) {
									setHowManyMinutesForOnePatient(timeToSet);
								} else {
									alert("You must give at least 5 minutes for a patient...");
								}
							}}
						/>
						<span> Minutes</span>
					</div>
					<div className="off-days-section">
						<h2>Select Off Days</h2>
						<Calendar
							value={selectedOffDates}
							onChange={handleOffDatesChange}
							multiple={true}
							className="red"
							highlightToday={true}
							minDate={new Date().setDate(new Date().getDate() + 1)}
						/>
					</div>
					{responseGot && (
						<div style={{ marginTop: "4rem" }}>
							<h2>Preview</h2>
							<Calender
								startColoringFrom={fromWhenSchedulesShouldStart}
								offDatesFromProps={responseGot.offDays}
								workingDaysFromProps={responseGot.activeHours
									.map((timeSegment, i) => {
										if (timeSegment.length) {
											return i;
										} else {
											return null;
										}
									})
									.filter((item) => item !== null)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default DoctorSchedulePage;

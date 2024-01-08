import React, { useEffect, useState } from "react";
import "./Calender.scss";

const Calender = ({
	offDatesFromProps,
	workingDaysFromProps,
	startColoringFrom,
}) => {
	useEffect(() => {
		if (offDatesFromProps && offDatesFromProps.length) {
			setOffDates(offDatesFromProps);
		}
		let shouldWorkingSlotsBeAdded = false;
		if (workingDaysFromProps && workingDaysFromProps.length) {
			shouldWorkingSlotsBeAdded = true;
		}
		if (shouldWorkingSlotsBeAdded) {
			setSelectedWorkingDates(workingDaysFromProps);
		}
	}, [offDatesFromProps, workingDaysFromProps]);

	const [currentDateInfo, setCurrentDateInfo] = useState(new Date());
	const [additionalGapsArray, setAdditionalGapsArray] = useState(
		new Array(
			new Date(
				(
					currentDateInfo.getFullYear() +
					"-" +
					(parseInt(currentDateInfo.getMonth()) + 1) +
					"-01"
				).toString()
			).getDay()
		).fill(0)
	);
	const [selectedWorkingDates, setSelectedWorkingDates] =
		useState(workingDaysFromProps);
	const [offDates, setOffDates] = useState(offDatesFromProps);

	const changeGapCounts = (newDate) => {
		const newFirstDate = new Date(
			(
				newDate.getFullYear() +
				"-" +
				(parseInt(newDate.getMonth()) + 1) +
				"-01"
			).toString()
		);
		setAdditionalGapsArray(new Array(newFirstDate.getDay()).fill(0));
	};

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const prevMonth = () => {
		const newDate = new Date(
			currentDateInfo.getFullYear(),
			currentDateInfo.getMonth() - 1
		);
		setCurrentDateInfo(newDate);
		changeGapCounts(newDate);
	};

	const nextMonth = () => {
		const newDate = new Date(
			currentDateInfo.getFullYear(),
			currentDateInfo.getMonth() + 1
		);
		setCurrentDateInfo(newDate);
		changeGapCounts(newDate);
	};

	const isSameDay = (date1, date2) => {
		return (
			date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear()
		);
	};

	const isDateInArray = (date, dateArray) => {
		return dateArray.some((d) => isSameDay(new Date(d), new Date(date)));
	};

	const getDaysArray = () => {
		const days = [];
		const month = currentDateInfo.getMonth();
		const year = currentDateInfo.getFullYear();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		for (let i = 1; i <= daysInMonth; i++) {
			const date = new Date(year, month, i);
			const className =
				date.getMonth() === month ? "current-month" : "other-month";
			const isOffDay = isDateInArray(date, offDates);
			const isWorkingDay =
				selectedWorkingDates.includes(date.getDay()) && !isOffDay;
			const dayClasses = `day ${className} ${
				date >= startColoringFrom && isOffDay ? "off-day" : ""
			} ${date >= startColoringFrom && isWorkingDay ? "green-day" : ""}`;
			days.push(
				<div key={i} className={dayClasses}>
					<span>{i}</span>
				</div>
			);
		}
		return days;
	};

	return (
		<div className="calender">
			<div className="header">
				<button onClick={prevMonth}>&lt;</button>
				<div className="month-year">
					<select
						value={currentDateInfo.getMonth()}
						onChange={(e) => {
							const selectedMonthNumber = parseInt(e.target.value);
							const currentDateInfoNumber = currentDateInfo.getMonth();
							const newDate = new Date(
								currentDateInfo.getFullYear(),
								currentDateInfo.getMonth() +
									(selectedMonthNumber - currentDateInfoNumber)
							);
							setCurrentDateInfo(newDate);
							changeGapCounts(newDate);
						}}>
						{months.map((month, index) => (
							<option key={index} value={index}>
								{month}
							</option>
						))}
					</select>
					<input
						type="number"
						value={currentDateInfo.getFullYear()}
						onChange={(e) => {
							const newDate = new Date(
								(
									parseInt(e.target.value) +
									"-" +
									(currentDateInfo.getMonth() + 1) +
									"-" +
									currentDateInfo.getDate()
								).toString()
							);

							setCurrentDateInfo(newDate);
							changeGapCounts(newDate);
						}}
					/>
				</div>
				<button onClick={nextMonth}>&gt;</button>
			</div>
			<div className="body">
				<div className="row">
					{days.map((day, index) => (
						<div key={index} className="day">
							<span>{day}</span>
						</div>
					))}
				</div>
				<div className="row">
					{additionalGapsArray.map((gap, i) => (
						<p key={i}></p>
					))}
					{getDaysArray().map((day, index) => (
						<React.Fragment key={index}>{day}</React.Fragment>
					))}
				</div>
			</div>
		</div>
	);
};

export default Calender;

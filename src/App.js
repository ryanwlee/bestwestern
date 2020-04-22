import React, { Component } from "react";
import "./App.css";

// Material-ui
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";

// Day picker
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { formatDate, parseDate } from "react-day-picker/moment";

// Date format
import moment from "moment";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleNightShiftChange = this.handleNightShiftChange.bind(this);
    this.listCreator = this.listCreator.bind(this);
    this.calculateDays = this.calculateDays.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleNightStartTimeChange = this.handleNightStartTimeChange.bind(
      this
    );
    this.handleNightEndTimeChange = this.handleNightEndTimeChange.bind(this);
    this.handleTimeCalculation = this.handleTimeCalculation.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.locationHelper = this.locationHelper.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
    this.handleTotalMin = this.handleTotalMin.bind(this);
    this.handleDiff = this.handleDiff.bind(this);
    this.handleTotalMinFormat = this.handleTotalMinFormat.bind(this);

    this.state = {
      selectedDay: undefined,
      days: undefined,
      workingHours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      holidayHours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      overtimeHours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      startTime: [
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540
      ],
      endTime: [
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540
      ],
      nightStartTime: [
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020
      ],
      nightEndTime: [
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020
      ],
      isHoliday: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      isNightShift: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      nightWorkingHours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      totalWorkingHour: undefined,
      totalOvertimeHour: undefined,
      totalHolidayHour: undefined
    };
  }

  handleDayChange(day) {
    this.setState({ selectedDay: day });
    this.setState({
      days: this.calculateDays(day)
    });
  }

  calculateDays(day) {
    let days = [];
    let limit = 14;
    while (limit !== 0) {
      days.push(moment(day).format("MMM DD"));
      day = moment(day).add(1, "d");
      limit = limit - 1;
    }
    return days;
  }

  listCreator(day) {
    let loc = this.locationHelper(day);
    const { classes } = this.props;

    return (
      <li key={day} className="styleLi">
        <div className="date">
          {day}
          <div className="isHoliday">
            Holiday?
            <Checkbox
              checked={this.state.isHoliday[loc]}
              onChange={this.handleHolidayChange.bind(this, loc)}
            />
          </div>
        </div>
        <div className="timePickerContainer">
          <TextField
            id={"ST" + loc}
            label="Start Time"
            type="time"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              step: 60 // 1 min
            }}
            onChange={this.handleStartTimeChange(loc)}
            value={this.handleTotalMinFormat(this.state.startTime[loc])}
          />
          <TextField
            id={"ET" + loc}
            label="End Time"
            type="time"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              step: 60 // 1 min
            }}
            onChange={this.handleEndTimeChange(loc)}
            value={this.handleTotalMinFormat(this.state.endTime[loc])}
          />
        </div>

        {/* Night Shift */}
        <div className="isHoliday">
          Night Shift?<Checkbox
            checked={this.state.isNightShift[loc]}
            onChange={this.handleNightShiftChange.bind(this, loc)}
          />
        </div>
        {this.state.isNightShift[loc] && (
          <div className="timePickerContainer">
            <TextField
              id={"NST" + loc}
              label="Start Time"
              type="time"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                step: 60 // 1 min
              }}
              onChange={this.handleNightStartTimeChange(loc)}
              value={this.handleTotalMinFormat(this.state.nightStartTime[loc])}
            />
            <TextField
              id={"NET" + loc}
              label="End Time"
              type="time"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                step: 60 // 1 min
              }}
              onChange={this.handleNightEndTimeChange(loc)}
              value={this.handleTotalMinFormat(this.state.nightEndTime[loc])}
            />
          </div>
        )}

        <div className="timePickerDisplayContainer">
          {this.state.workingHours[loc] !== 0 &&
            `WH: ${this.state.workingHours[loc]}`}
          {this.state.overtimeHours[loc] !== 0 &&
            ` / OH: ${this.state.overtimeHours[loc]}`}
          {this.state.holidayHours[loc] !== 0 &&
            `HH: ${this.state.holidayHours[loc]}`}
        </div>
        <Divider />
      </li>
    );
  }

  handleStartTimeChange = loc => event => {
    let selectedTime = event.target.value.split(":");
    let totalMin = this.handleTotalMin(selectedTime[0], selectedTime[1]);
    let tempStartTime = this.state.startTime;
    tempStartTime[loc] = totalMin;
    this.setState({ startTime: tempStartTime });

    this.handleTimeCalculation(loc);
  };

  handleEndTimeChange = loc => event => {
    let selectedTime = event.target.value.split(":");
    let totalMin = this.handleTotalMin(selectedTime[0], selectedTime[1]);
    let tempEndTime = this.state.endTime;
    tempEndTime[loc] = totalMin;
    this.setState({ endTime: tempEndTime });

    this.handleTimeCalculation(loc);
  };

  handleNightStartTimeChange = loc => event => {
    let selectedTime = event.target.value.split(":");
    let totalMin = this.handleTotalMin(selectedTime[0], selectedTime[1]);
    let tempStartTime = this.state.nightStartTime;
    tempStartTime[loc] = totalMin;
    this.setState({ nightStartTime: tempStartTime });

    this.handleTimeCalculation(loc);
  };

  handleNightEndTimeChange = loc => event => {
    let selectedTime = event.target.value.split(":");
    let totalMin = this.handleTotalMin(selectedTime[0], selectedTime[1]);
    let tempEndTime = this.state.nightEndTime;
    tempEndTime[loc] = totalMin;
    this.setState({ nightEndTime: tempEndTime });

    this.handleTimeCalculation(loc);
  };

  handleHolidayChange(loc, event) {
    let tempIsHoliday = this.state.isHoliday;
    tempIsHoliday[loc] = event.target.checked;
    this.setState({ isHoliday: tempIsHoliday });

    this.handleTimeCalculation(loc);
  }

  handleNightShiftChange(loc, event) {
    let tempIsNightShift = this.state.isNightShift;
    tempIsNightShift[loc] = event.target.checked;
    this.setState({ isNightShift: tempIsNightShift });

    if (!tempIsNightShift[loc]) {
      let tempStartTime = this.state.nightStartTime;
      let tempEndTime = this.state.nightEndTime;
      tempStartTime[loc] = 0;
      tempEndTime[loc] = 0;
      this.setState({
        nightStartTime: tempStartTime,
        nightEndTime: tempEndTime
      });

      this.handleTimeCalculation(loc);
    }
  }

  handleTotalMin(hour, min) {
    return 60 * parseInt(hour, 10) + parseInt(min, 10);
  }

  handleTotalMinFormat(min) {
    let hr = Math.floor(min / 60);
    if (hr < 10) {
      hr = `0${hr}`;
    }
    let minute = min % 60;
    if (minute < 10) {
      minute = `0${minute}`;
    }
    return `${hr}:${minute}`;
  }

  handleDiff(start, end, nightStart, nightEnd) {
    let totalMin = start > end ? 24 * 60 - start + end : end - start;
    let totalNightMin =
      nightStart > nightEnd
        ? 24 * 60 - nightStart + nightEnd
        : nightEnd - nightStart;
    return Number(Math.round((totalMin + totalNightMin) / 60 + "e2") + "e-2");
  }

  handleTimeCalculation(loc) {
    let startTime = this.state.startTime[loc];
    let endTime = this.state.endTime[loc];
    let nightStartTime = this.state.nightStartTime[loc];
    let nightEndTime = this.state.nightEndTime[loc];

    let diff = this.handleDiff(
      startTime,
      endTime,
      nightStartTime,
      nightEndTime
    );

    // Check overtime and holiday
    let tempOvertimeHours = this.state.overtimeHours;
    let tempWorkingHours = this.state.workingHours;
    let tempHolidayHours = this.state.holidayHours;

    if (this.state.isHoliday[loc]) {
      // If it is holiday, working hours AND holiday hours
      // TODO: visit this for holiday AND overtime
      tempHolidayHours[loc] = diff;
      tempWorkingHours[loc] = 0;
      tempOvertimeHours[loc] = 0;
    } else if (diff > 8) {
      tempOvertimeHours[loc] = Number(Math.round(diff - 8 + "e2") + "e-2");
      tempWorkingHours[loc] = 8;
      tempHolidayHours[loc] = 0;
    } else {
      tempOvertimeHours[loc] = 0;
      tempWorkingHours[loc] = diff;
      tempHolidayHours[loc] = 0;
    }

    this.setState({
      workingHours: tempWorkingHours,
      overtimeHours: tempOvertimeHours,
      holidayHours: tempHolidayHours
    });
  }

  /**
   ** Reset
   **/
  handleReset() {
    this.setState({
      workingHours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      holidayHours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      overtimeHours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      startTime: [
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540
      ],
      endTime: [
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540,
        540
      ],
      nightStartTime: [
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020
      ],
      nightEndTime: [
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020,
        1020
      ],
      isNightShift: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      nightWorkingHours: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      totalWorkingHour: undefined,
      totalOvertimeHour: undefined,
      totalHolidayHour: undefined
    });
  }

  /**
   ** Calculate
   **/
  handleCalculate() {
    const { workingHours, holidayHours, overtimeHours } = this.state;
    const totalWorkingHour = Number(
      Math.round(workingHours.reduce((total, next) => total + next) + "e2") +
        "e-2"
    );
    const totalHolidayHour = Number(
      Math.round(holidayHours.reduce((total, next) => total + next) + "e2") +
        "e-2"
    );
    const totalOvertimeHour = Number(
      Math.round(overtimeHours.reduce((total, next) => total + next) + "e2") +
        "e-2"
    );

    this.setState({ totalWorkingHour, totalOvertimeHour, totalHolidayHour });
  }

  /**
   ** Helpers
   **/
  locationHelper(day) {
    return this.state.days.indexOf(day);
  }

  render() {
    const {
      selectedDay,
      days,
      totalWorkingHour,
      totalOvertimeHour,
      totalHolidayHour
    } = this.state;
    const { classes } = this.props;

    return (
      <div className="App">
        <AppBar position="static" color="primary" className="styleAppbar">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Best Western Diamond Inn
            </Typography>
          </Toolbar>
        </AppBar>

        <DayPickerInput
          onDayChange={this.handleDayChange}
          placeholder="Choose the first day"
          classNames={{ container: "dayPickerContainer", overlay: "overlay" }}
          format="MMM DD, YYYY"
          formatDate={formatDate}
          parseDate={parseDate}
          inputProps={{ className: "dayPickerInput" }}
          value={selectedDay}
        />
        <ul className="styleUl">
          {days && days.map(day => this.listCreator(day))}
        </ul>

        {totalWorkingHour || totalHolidayHour ? (
          <Paper className="paper" elevation={1}>
            <Typography component="pre">
              {`Total working hours: ${totalWorkingHour}\nTotal overtime hours: ${totalOvertimeHour}\nTotal holiday hours: ${totalHolidayHour}`}
            </Typography>
          </Paper>
        ) : (
          ""
        )}

        <Button
          classes={{ root: classes.styleButton }}
          variant="outlined"
          onClick={this.handleReset}
          color="secondary"
        >
          Start Over
        </Button>
        <Button
          classes={{ root: classes.styleButton }}
          variant="outlined"
          onClick={this.handleCalculate}
        >
          Calculate
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(App);

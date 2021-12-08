import { Component, OnInit } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
} from '@fullcalendar/angular';
import { AdminService } from 'src/app/Services/admin.service';
import { INITIAL_EVENTS, createEventId } from '../model/event.utils';
import { EventMap } from '../model/admin.model';

@Component({
  selector: 'app-admin-calendar',
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.css'],
})
export class AdminCalendarComponent implements OnInit {
  name!: string;
  date!: string;
  showModal!: boolean;

  listOfEvent: EventMap[] = [];
  value: EventMap[] = [];
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.GetListofData().subscribe((x) => {
      this.listOfEvent.push(...x);
      for (var i = 0; i < this.listOfEvent.length; i++) {
        var title = this.listOfEvent[i].title;
        var start = DateType(this.listOfEvent[i].date);
        this.value.push({
          // id: this.listOfEvent[i].id,
          title: this.listOfEvent[i].title,
          date: this.listOfEvent[i].date,
        });
      }
    });
    console.log(this.value[1].title);

    function DateType(date: any): Date {
      var convertDate = new Date(date);

      return convertDate;
    }
  }
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    //initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),

    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
    // events: [
    //   { title: 'Today Checkup', date: new Date('12-2-2021 13:15:30') },
    //   { title: 'Doctor Appointment', date: new Date() },
    // ],
    events: this.value,
    //events: [{ title: 'event 2', date: '2021-12-04 13:15:30' }],
  };

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr);
  }

  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title: 'New Even Created',
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.name = clickInfo.event.title;
    var dateparms = clickInfo.event._instance?.range.start;
    var date = dateparms?.toDateString();
    var time = dateparms?.toTimeString();
    //if(clickInfo.event.de)
    //this.date = date;
    this.showModal = true;
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}

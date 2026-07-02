import Link from "next/link";

import type { EventsCalendarMonth } from "@/app/()/company/data/eventsListContent";



type CompanyEventsCalendarProps = {

  months: EventsCalendarMonth[];

};



export default function CompanyEventsCalendar({ months }: CompanyEventsCalendarProps) {

  return (

    <section className="company-events-calendar">

      <div className="inner">

        <h2 className="company-events-calendar__heading">Events Calendar</h2>



        <div className="company-events-calendar__months">

          {months.map((month) => (

            <div key={month.id} className="company-events-calendar__month">

              <div className="company-events-calendar__month-label">

                <span className="company-events-calendar__month-icon" aria-hidden="true">

                  <img src="/ico/ico_calendar.svg" alt="" />

                </span>

                <p className="company-events-calendar__month-text">{month.label}</p>

              </div>



              <ul className="company-events-calendar__list">

                {month.events.map((event) => (

                  <li key={event.id}>

                    <Link

                      href={event.href || "#"}

                      className="company-events-calendar__row"

                      aria-label={`${event.title}, Venue ${event.venue}, ${event.dates}`}

                    >

                      <p className="company-events-calendar__title">{event.title}</p>

                      <div className="company-events-calendar__meta">

                        <span className="company-events-calendar__meta-group">

                          <span className="company-events-calendar__meta-label">Venue</span>

                          <span className="company-events-calendar__meta-value">

                            {event.venue}

                          </span>

                        </span>

                        <span

                          className="company-events-calendar__meta-sep"

                          aria-hidden="true"

                        />

                        <span className="company-events-calendar__meta-group">

                          <span className="company-events-calendar__meta-label">Dates</span>

                          <span className="company-events-calendar__meta-value">

                            {event.dates}

                          </span>

                        </span>

                      </div>

                    </Link>

                  </li>

                ))}

              </ul>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}


